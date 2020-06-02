from random import randrange

from flask import Blueprint, make_response, request
from werkzeug.exceptions import abort

from src.activetrail.activetrail_client import ActiveTrailClient
from src.database.database_connection import DatabaseConnection
from src.database.verification_code import store_verification_code, check_verification_code, update_attempts, \
    verification_attempts_exceeded, delete_verification_code
from src.exceptions.verification_code_not_found import VerificationCodeNotFound
from src.mail.email import Email
from src.settings import DATABASE_URL, ACTIVETRAIL_API_BASE_URL, ACTIVETRAIL_API_KEY, SENDGRID_API_KEY, \
    GEDCOM_EMAIL_FROM, VERIFICATION_CODE_EXPIRATION_SECONDS

import logging

logger = logging.getLogger(__name__)

auth = Blueprint('auth', __name__)


@auth.route("/verification-code/<email>", methods=["POST"])
def verification_code_post(email: str):
    verification_code_json = request.get_json(silent=True)
    if not verification_code_json:
        logger.info("Received invalid request. Request is missing body")
        return abort(400, description="Request is missing a valid JSON body")

    verification_code = verification_code_json.get("verificationCode")
    if not verification_code:
        logger.info("Missing field -'verificationCode'")
        return abort(400, description="Missing field -'verificationCode'")

    verification_code = str(verification_code)

    with DatabaseConnection(DATABASE_URL) as db_connection:
        if not db_connection:
            logger.error("Could not get connection to database")
            return abort(500, description="Failed to connect to database")

        try:
            is_correct_code, is_code_expired = check_verification_code(
                db_connection,
                email,
                verification_code,
                VERIFICATION_CODE_EXPIRATION_SECONDS)

        except VerificationCodeNotFound:
            logger.exception("There is no verification code for this user")
            return abort(404, description="Verification code does not exist")

        if is_code_expired:
            logger.error("The verification code for user {} was expired".format(email))
            delete_verification_code(db_connection, email)
            return abort(404)

        if not is_correct_code:
            logger.info("Invalid verification code was submitted")

            if verification_attempts_exceeded(db_connection, email):
                delete_verification_code(db_connection, email)
                logger.info("Verification code for user {} did not check and was deleted".format(email))
                return abort(404)

            update_attempts(db_connection, email)

            return abort(401, description="Invalid verification code")

        logger.info("Request was processed successfully and response was sent")
        return make_response()


@auth.route("/register/", methods=["POST"])
def register_post():
    register_info_json = request.get_json(silent=True)
    if not register_info_json:
        logger.info("Received invalid request. Request is missing body")
        return abort(400, description="Request is missing a valid JSON body")
    if not register_info_json["email"] or \
       not register_info_json["phone"] or \
       not register_info_json["firstName"] or \
       not register_info_json["lastName"] or \
       not register_info_json["language"]:
        logger.info("Request missing one or more of the following values: email, phone, first name or last name")
        return abort(400, description="Request missing one or more values")

    verification_code = generate_verification_code()
    first_name = register_info_json["firstName"]
    last_name = register_info_json["lastName"]
    email = register_info_json["email"]
    phone = register_info_json["phone"]
    language = register_info_json["language"]
    logger.info("Generated verification code")

    if not send_verification_code_to_mail(verification_code, email, language):
        logger.error("Failed to send email with verification code: {}".format(email))
        return abort(500, description="Wasn't able to send email to {}".format(email))

    activetrail_api_client = ActiveTrailClient(ACTIVETRAIL_API_BASE_URL,
                                               ACTIVETRAIL_API_KEY)

    try:
        activetrail_api_client.create_contact(first_name, last_name, email, phone)
    except Exception:
        logger.exception("Failed to create contact in ActiveTrail "
                         "(first_name: '{}', last_name: '{}', email: '{}', phone: '{}')"
                         .format(first_name, last_name, email, phone))

    with DatabaseConnection(DATABASE_URL) as db_connection:
        if not db_connection:
            logger.error("Could not get connection to database")
            return abort(500, description="Failed to connect to database")
        logger.info("Got connection to database")

        if not store_verification_code(db_connection, email, verification_code):
            logger.error("Failed to store verification code in database")
            return abort(500, "Failed to generate verification code")

        logger.info("Verification code stored in database")

        logger.info("Request was processed successfully and response was sent")
        return make_response()


def generate_verification_code() -> str:
    verification_code: str = str(randrange(10000, 100000))
    return verification_code


def send_verification_code_to_mail(verification_code: str, to_email: str, language: str) -> bool:
    email = Email(SENDGRID_API_KEY,
                  GEDCOM_EMAIL_FROM,
                  None,
                  None,
                  None,
                  language=language)

    return email.send_verification_code(to_email, verification_code)

