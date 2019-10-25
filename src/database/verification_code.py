import logging
from typing import Tuple

from src.exceptions.verification_code_not_found import VerificationCodeNotFound

logger = logging.getLogger(__name__)


def store_verification_code(db_connection, email: str, verification_code: str) -> bool:
    with db_connection.cursor() as cursor:
        try:
            cursor.execute(
                '''INSERT INTO verification_codes
                    (email, verification_code) VALUES (%s, %s)
                   ON CONFLICT (email)
                   DO UPDATE
                   SET verification_code = %s, attempts = 0, created_at = now() at time zone 'utc'
                ''',
                (email, verification_code, verification_code))
        except Exception:
            logger.exception("Verification code insert query failed")
            return False

        logger.info("Record inserted successfully")
        return True


def check_verification_code(db_connection,
                            email: str,
                            verification_code: str,
                            expiration_seconds: int) -> Tuple[bool, bool]:
    """
    This function return a tuple of 2 booleans.
    The first boolean will be True if the verification code is correct,
    the second boolean is True if the verification code is expired.
    :param expiration_seconds:
    :param db_connection:
    :param email:
    :param verification_code:
    :return:
    """
    with db_connection.cursor() as cursor:
        try:
            cursor.execute("""SELECT verification_code,
                          (EXTRACT(epoch FROM now() - vc.created_at)::int > %s):: boolean as is_expired 
                          FROM verification_codes AS vc WHERE email=%s""", (expiration_seconds, email))
        except Exception:
            logger.exception("Failed to fetch verification code from database for email: {}".format(email))
            return False, False

        row = cursor.fetchone()
        if not row:
            raise VerificationCodeNotFound("There is no verification code for this user")
        return row[0] == verification_code, row[1]


def update_attempts(db_connection, email: str) -> bool:
    with db_connection.cursor() as cursor:
        try:
            cursor.execute("UPDATE verification_codes SET attempts = attempts + 1 WHERE email=%s", (email,))
        except Exception:
            logger.exception("Failed to update attempts")
            return False

        logger.info("Record inserted successfully")
        return True


def verification_attempts_exceeded(db_connection, email) -> bool:
    with db_connection.cursor() as cursor:
        try:
            cursor.execute("SELECT attempts FROM verification_codes WHERE email=%s", (email, ))
        except Exception:
            logger.exception("Failed to fetch verification code from database for email: {}".format(email))
            return False

        row = cursor.fetchone()
        if not row:
            return False
        return row[0] == 3


def delete_verification_code(db_connection, email) -> bool:
    with db_connection.cursor() as cursor:
        try:
            cursor.execute("DELETE FROM verification_codes WHERE email=%s", (email, ))
        except Exception:
            logger.exception("Failed to delete verification code from database for email: {}".format(email))
            return False

        logger.info("The verification code was deleted successfully")
        return True
