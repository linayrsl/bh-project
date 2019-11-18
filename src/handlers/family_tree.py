import base64
import io
import logging
import re
import zipfile
from typing import Dict

from flask import Blueprint, request, Response, abort
from jsonschema import validate, ValidationError, FormatChecker

from src.database.database_connection import DatabaseConnection
from src.database.family_tree_db import log_family_tree_submission

from src.gedcom.handler import handler
from src.mail.email import Email
from src.settings import SENDGRID_API_KEY, GEDCOM_EMAIL_FROM, GEDCOM_EMAIL_TO, DATABASE_URL

logger = logging.getLogger(__name__)

family_tree_json_schema = {
    "definitions": {
        "person": {
            "type": "object",
            "properties": {
                "ID": {"type": "string", "pattern": "^[0-9]+$"},
                "firstName": {"type": ["string", "null"]},
                "lastName": {"type": ["string", "null"]},
                "maidenName": {"type": ["string", "null"]},
                "gender": {"type": ["string", "null"], "enum": ["male", "female", "other", None]},
                "birthDate": {"type": ["string", "null"], "pattern": "^([0-9]{2}/[0-9]{2}/[0-9]{4}|[0-9]{4})$"},
                "birthPlace": {"type": ["string", "null"]},
                "isAlive": {"type": "boolean"},
                "deathDate": {"type": "string", "pattern": "^([0-9]{2}/[0-9]{2}/[0-9]{4}|[0-9]{4})$"},
                "deathPlace": {"type": "string"},
                "motherID": {"type": ["string", "null"], "pattern": "^[0-9]+$"},
                "fatherID": {"type": ["string", "null"], "pattern": "^[0-9]+$"},
                "siblings": {
                    "type": "array",
                    "items": {"type": "string", "pattern": "^[0-9]+$"}
                },
                "image": {"type": ["string", "null"]}
            },
            "required": ["fatherID",
                         "motherID",
                         "ID"],
            "dependencies": {
                "deathDate": {
                    "properties": {
                        "isAlive": {
                            "enum": [False]
                        }
                    }
                },
                "deathPlace": {
                    "properties": {
                        "isAlive": {
                            "enum": [False]
                        }
                    }
                }
            }
        }
    },
    "type": "object",
    "patternProperties": {
        "^[0-9]+$": {"$ref": "#/definitions/person"}
    },
    "additionalProperties": False
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

    try:
        image_dict: Dict[str, str]
        gedcom_string, image_dict, _ = handler(family_tree_json)
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
                       content)

    if send_email.send_zip(
            zip_file_name,
            create_zip_with_gedcom_and_images(
                file_name,
                gedcom_string.encode(),
                {key: base64.b64decode(value) for (key, value) in image_dict.items()})):

        logger.info("Gedcom zip sent to email successfully")

        with DatabaseConnection(DATABASE_URL) as db_connection:
            if not db_connection:
                logger.error("Could not get connection to database")
                return abort(500, description="Failed to connect to database")

            log_family_tree_submission(db_connection, family_tree_json)

        logger.info("Family tree submission log saved to database")
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
