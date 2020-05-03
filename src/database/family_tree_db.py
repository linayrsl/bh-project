from datetime import datetime
import logging
from typing import Dict

from psycopg2 import sql
logger = logging.getLogger(__name__)


def log_family_tree_submission(db_connection, family_tree: Dict, submitter_email: str) -> bool:
    with db_connection.cursor() as cursor:

        if not family_tree:
            logger.info("Family tree dict is empty")
            return False

        list_of_people = list(family_tree.values())
        submitter = list_of_people[0]

        try:
            birth_date = None
            try:
                birth_date = datetime.strptime(submitter['birthDate'], "%d/%m/%Y") if submitter['birthDate'] else None
            except ValueError:
                try:
                    birth_date = datetime.strptime(submitter['birthDate'], "%Y") if submitter['birthDate'] else None
                except ValueError:
                    logger.error(f"Unsupported date format {submitter['birthDate']}")

            upload_log_record: Dict = {"email": submitter_email,
                                       "first_name": submitter['firstName'],
                                       "last_name": submitter['lastName'],
                                       "gender": submitter['gender'][0],
                                       "gedcom_language": "HE",
                                       "date_of_birth": birth_date,
                                       "address": '',
                                       "country": '',
                                       "creation_time": datetime.now(),
                                       "num_of_people": len(list_of_people),
                                       "num_of_photos":
                                           sum(1 for item in list_of_people if "image" in item and item["image"]),
                                       "is_new_tree": True}
        except Exception:
            logger.exception("Failed to generate upload log record")
            return False

        columns = list(upload_log_record.keys())
        values = list(upload_log_record.values())

        try:
            number_of_values_to_insert = len(values)

            insert_query = sql.SQL("INSERT INTO family_tree_upload_log ({}) values ({})").format(
                sql.SQL(', ').join(map(sql.Identifier, columns)),
                sql.SQL(', ').join(sql.Placeholder() * number_of_values_to_insert))

            cursor.execute(insert_query, values)

        except Exception:
            logger.exception("Failed to insert upload log record into database")
            return False

        return True



