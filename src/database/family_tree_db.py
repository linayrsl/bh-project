from datetime import datetime
import logging
from typing import Dict

from psycopg2 import sql

from src.models.family_tree import FamilyTree

logger = logging.getLogger(__name__)


def log_family_tree_submission(
        db_connection,
        family_tree_model: FamilyTree,
        num_of_persons,
        num_of_images,
        uploaded_file_name: str) -> bool:
    with db_connection.cursor() as cursor:

        if not family_tree_model:
            logger.info("Family tree model is empty")
            return False

        try:
            upload_log_record: Dict = {"email": family_tree_model.submitter_email,
                                       "gedcom_language": family_tree_model.language,
                                       "creation_time": datetime.now(),
                                       "num_of_people": num_of_persons,
                                       "num_of_photos": num_of_images,
                                       "is_new_tree": True,
                                       "file_name": uploaded_file_name}
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







