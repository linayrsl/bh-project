from datetime import datetime
import logging
from typing import Dict

from psycopg2 import sql

from src.models.family_tree import FamilyTree

logger = logging.getLogger(__name__)


def log_family_tree_submission(db_connection, family_tree_model: FamilyTree, num_of_persons, num_of_images) -> bool:
    with db_connection.cursor() as cursor:

        if not family_tree_model:
            logger.info("Family tree model is empty")
            return False

        submitter = family_tree_model.submitter

        try:
            birth_date = None
            try:
                birth_date = datetime.strptime(submitter.birth_date, "%d/%m/%Y") if submitter.birth_date else None
            except ValueError:
                try:
                    birth_date = datetime.strptime(submitter.birth_date, "%Y") if submitter.birth_date else None
                except ValueError:
                    logger.error(f"Unsupported date format {submitter.birth_date}")

            upload_log_record: Dict = {"email": family_tree_model.submitter_email,
                                       "first_name": submitter.first_name,
                                       "last_name": submitter.last_name,
                                       "gender": submitter.gender[0],
                                       "gedcom_language": family_tree_model.language,
                                       "date_of_birth": birth_date,
                                       "address": '',
                                       "country": '',
                                       "creation_time": datetime.now(),
                                       "num_of_people": num_of_persons,
                                       "num_of_photos": num_of_images,
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







