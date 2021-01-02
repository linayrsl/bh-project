import base64
import io
import logging
import re
import zipfile
from typing import Dict, Optional, Generator, Any

from flask import Blueprint, request, Response, abort
from jsonschema import validate, ValidationError, FormatChecker

from src.database.database_connection import DatabaseConnection
from src.database.family_tree_db import log_family_tree_submission

from src.gedcom.handler import handler
from src.mail.email import Email
from src.models.family_tree import FamilyTree
from src.models.person_node import PersonNode
from src.models.submitter import Submitter
from src.settings import SENDGRID_API_KEY, GEDCOM_EMAIL_FROM, GEDCOM_EMAIL_TO, DATABASE_URL

logger = logging.getLogger(__name__)

family_tree_json_schema = {
    "definitions": {
        "person": {
            "type": "object",
            "properties": {
                "firstName": {"type": ["string", "null"]},
                "lastName": {"type": ["string", "null"]},
                "maidenName": {"type": ["string", "null"]},
                "gender": {"type": ["string", "null"], "enum": ["male", "female", "other", None]},
                "birthDate": {"type": ["string", "null"], "pattern": "^([0-9]{2}/[0-9]{2}/[0-9]{4}|[0-9]{4})$"},
                "birthPlace": {"type": ["string", "null"]},
                "isAlive": {"type": "boolean"},
                # "deathDate": {"type": ["string", "null"], "pattern": "^([0-9]{2}/[0-9]{2}/[0-9]{4}|[0-9]{4})$"},
                # "deathPlace": {"type": ["string", "null"]},
                "mother": {
                    "oneOf": [
                        {
                            "$ref": "#/definitions/person",
                            "additionalProperties": False
                        },
                        {"type": "null"}
                    ],
                },
                "father": {
                    "oneOf": [
                        {
                            "$ref": "#/definitions/person",
                            "additionalProperties": False
                        },
                        {"type": "null"}
                    ],
                },
                "siblings": {
                    "type": ["array", "null"],
                    "items": {
                        "$ref": "#/definitions/person",
                        "additionalProperties": False
                    }
                },
                "isSubmitter": {"type": "boolean"},
                "image": {"type": ["string", "null"]}
            },
            "oneOf": [
                {
                    "properties": {
                        "deathDate": {"type": "string", "pattern": "^([0-9]{2}/[0-9]{2}/[0-9]{4}|[0-9]{4})$"},
                        "deathPlace": {"type": "string"},
                        "isAlive": {
                            "enum": [False]
                        }
                    }
                }, {
                    "properties": {
                        "deathDate": {"enum": [None]},
                        "deathPlace": {"type": "string"},
                        "isAlive": {
                            "enum": [False]
                        }
                    }
                },
                {
                    "properties": {
                        "deathDate": {"type": "string", "pattern": "^([0-9]{2}/[0-9]{2}/[0-9]{4}|[0-9]{4})$"},
                        "deathPlace": {"enum": [None]},
                        "isAlive": {
                            "enum": [False]
                        }
                    }
                },
                {
                    "properties": {
                        "deathDate": {"enum": [None]},
                        "deathPlace": {"enum": [None]},
                        "isAlive": {"enum": [False, True]}
                    }
                }
            ],
        },
        "submitter": {
            "allOf": [
                {"$ref": "#/definitions/person"},
            ],
            "required": ["firstName",
                         "lastName",
                         "gender"],
        }
    },
    "type": "object",
    "properties": {
        "submitterEmail": {"type": "string"},
        "language": {"type": "string"},
        "submitter": {
            "$ref": "#/definitions/submitter",
            "additionalProperties": False
        }
    }
}

family_tree = Blueprint('family_tree', __name__)


@family_tree.route("/", methods=["POST"])
def family_tree_post():
    family_tree_json = request.get_json(silent=True)
    if not family_tree_json:
        logger.info("Received invalid request, Request is missing body")
        return abort(400, description="Request is missing a valid JSON body")

    try:
        validate(family_tree_json, family_tree_json_schema, format_checker=FormatChecker())
    except ValidationError as e:
        logger.exception("Family tree json validation has failed")
        return abort(400, e.message)

    family_tree_model: FamilyTree = map_family_tree_json_to_model(family_tree_json)

    try:
        image_dict: Dict[str, str]
        gedcom_string, image_dict, _ = handler(family_tree_json["familyTree"], family_tree_json["language"])
    except Exception:
        logger.exception("Failed to generate gedcom from family tree json")
        return abort(500, description="Failed to generate gedcom")

    try:
        user_id = re.findall(r'I[0-9]+', gedcom_string, re.UNICODE)[0][1:]
        file_name = 'user{}.ged'.format(user_id)
        zip_file_name = 'user{}.zip'.format(user_id)

        user_last_name = re.findall(r'/\w+', gedcom_string, re.UNICODE)[0][1:]
        content = str(b'{} family tree', 'utf-8').format(user_last_name)
    except Exception:
        logger.exception("Failed to extract user name and user last name from gedcom string")
        return abort(500, description="Failed to generate gedcom")

    send_email = Email(SENDGRID_API_KEY,
                       GEDCOM_EMAIL_FROM,
                       GEDCOM_EMAIL_TO,
                       content,
                       content,
                       language=family_tree_json["language"])

    zip_file_data = create_zip_with_gedcom_and_images(
        file_name,
        gedcom_string.encode(),
        {key: base64.b64decode(value) for (key, value) in image_dict.items()})

    if send_email.send_zip(
            zip_file_name,
            zip_file_data):

        logger.info("Gedcom zip sent to email successfully")

        with DatabaseConnection(DATABASE_URL) as db_connection:
            if not db_connection:
                logger.error("Could not get connection to database")
                return abort(500, description="Failed to connect to database")

            log_family_tree_submission(db_connection, family_tree_json["familyTree"],
                                       family_tree_json["submitterEmail"])

        logger.info("Family tree submission log saved to database")

        if not send_email.send_zip_to_user(zip_file_name, zip_file_data, family_tree_json["submitterEmail"]):
            logger.error("Gedcom wasn't sent to the user with email {}".format(family_tree_json["submitterEmail"]))

        return Response("{}", mimetype="application/json")

    logger.error("Failed to send Gedcom zip to email")
    return abort(500, "Failed to send family tree to Beit Hatfutzot")


def create_zip_with_gedcom_and_images(file_name: str, data: bytes, images: Dict[str, bytes]) -> bytes:
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        zip_file.writestr(file_name, data)
        for image_name, image_data in images.items():
            zip_file.writestr(image_name, image_data)
    return zip_buffer.getvalue()


def sequential_id_generator():
    next_id = 1
    while True:
        yield next_id
        next_id += 1


def map_person_json_to_model(person_json: Dict, id_generator: Generator[int, Any, None]) -> Optional[PersonNode]:
    if not person_json:
        return None
    person_node = PersonNode(
        id=next(id_generator),
        father=map_person_json_to_model(person_json["father"], id_generator) if "father" in person_json else None,
        mother=map_person_json_to_model(person_json["mother"], id_generator) if "mother" in person_json else None,
        siblings=[map_person_json_to_model(sibling, id_generator) for sibling in
                  person_json["siblings"]] if "siblings" in person_json and person_json["siblings"] else None,
        image=person_json["image"] if "image" in person_json else None,
        first_name=person_json["firstName"] if "firstName" in person_json else None,
        last_name=person_json["lastName"] if "lastName" in person_json else None,
        maiden_name=person_json["maidenName"] if "maidenName" in person_json else None,
        birth_date=person_json["birthDate"] if "birthDate" in person_json else None,
        birth_place=person_json["birthPlace"] if "birthPlace" in person_json else None,
        gender=person_json["gender"] if "gender" in person_json else None,
        is_alive=person_json["isAlive"] if "isAlive" in person_json else None,
        death_date=person_json["deathDate"] if "deathDate" in person_json else None,
        death_place=person_json["deathDate"] if "deathPlace" in person_json else None,
        related_person=person_json["relatedPerson"] if "relatedPerson" in person_json else None
    )
    return person_node


def map_submitter_json_to_model(submitter_json: Dict, id_generator: Generator[int, Any, None]) -> Optional[Submitter]:
    if not submitter_json:
        return None
    submitter = Submitter(
        id=next(id_generator),
        father=map_person_json_to_model(submitter_json["father"], id_generator),
        mother=map_person_json_to_model(submitter_json["mother"], id_generator),
        siblings=[map_person_json_to_model(sibling, id_generator) for sibling in
                  submitter_json["siblings"]] if "siblings" in submitter_json and submitter_json["siblings"] else None,
        children=[map_person_json_to_model(child, id_generator) for child in
                  submitter_json["children"]] if "children" in submitter_json and submitter_json["children"] else None,
        image=submitter_json["image"] if "image" in submitter_json else None,
        first_name=submitter_json["firstName"] if "firstName" in submitter_json else None,
        last_name=submitter_json["lastName"] if "lastName" in submitter_json else None,
        maiden_name=submitter_json["maidenName"] if "maidenName" in submitter_json else None,
        birth_date=submitter_json["birthDate"] if "birthDate" in submitter_json else None,
        birth_place=submitter_json["birthPlace"] if "birthPlace" in submitter_json else None,
        gender=submitter_json["gender"] if "gender" in submitter_json else None,
        is_alive=submitter_json["isAlive"] if "isAlive" in submitter_json else None,
        death_date=submitter_json["deathDate"] if "deathDate" in submitter_json else None,
        death_place=submitter_json["deathDate"] if "deathPlace" in submitter_json else None,
        related_person=submitter_json["relatedPerson"] if "relatedPerson" in submitter_json else None
    )
    return submitter


def map_family_tree_json_to_model(family_tree_json: Dict) -> FamilyTree:
    family_tree_model = FamilyTree(
        submitter_email=family_tree_json["submitterEmail"],
        language=family_tree_json["language"],
        submitter=map_submitter_json_to_model(family_tree_json["submitter"], sequential_id_generator())
    )
    return family_tree_model
