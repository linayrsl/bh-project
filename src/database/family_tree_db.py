import datetime
import logging
from typing import Dict

from psycopg2 import sql
logger = logging.getLogger(__name__)


def log_family_tree_submission(db_connection, family_tree: Dict) -> bool:
    with db_connection.cursor() as cursor:

        if not family_tree:
            logger.info("Family tree dict is empty")
            return False

        submitter = list(family_tree.values())[0]

        try:
            upload_log_record: Dict = {"email": '',
                                       "first_name": submitter['firstName'],
                                       "last_name": submitter['lastName'], "gender": submitter['gender'][0],
                                       "gedcom_language": "HE", "date_of_birth": submitter['birthDate'],
                                       "address": '', "country": '',
                                       "creation_time": datetime.datetime.now(), "num_of_people": 1,
                                       "num_of_photos": 0, "is_new_tree": True}
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



