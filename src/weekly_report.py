import logging

from src.database.database_connection import DatabaseConnection
from src.settings import DATABASE_URL

logger = logging.getLogger(__name__)


def create_csv_file(db_connection) -> bool:
    with db_connection.cursor() as cursor:
        try:
            cursor.execute("""SELECT *
                            FROM family_tree_upload_log
                            WHERE creation_time >= now() - '14 days'::interval;""")
        except Exception:
            logger.exception("Failed to fetch database report")
            return False

        rows = cursor.fetchall()
        print(rows)


with DatabaseConnection(DATABASE_URL) as connection:
    create_csv_file(connection)
