import logging
import csv
from io import StringIO
from typing import Optional

from src.database.database_connection import DatabaseConnection
from src.logging.logging_setup import logging_setup
from src.mail.email import Email
from src.settings import DATABASE_URL, SENDGRID_API_KEY, REPORT_EMAIL_FROM, \
    REPORT_EMAIL_TO


logging_setup()
logger = logging.getLogger(__name__)


def create_csv_string(db_connection) -> Optional[str]:
    relevant_columns = ["first_name",
                        "last_name",
                        "gedcom_language",
                        "address",
                        "city",
                        "phone",
                        "zip",
                        "country",
                        "gedcom_url",
                        "creation_time",
                        "num_of_people",
                        "num_of_photos",
                        "is_new_tree"]
    with db_connection.cursor() as cursor:
        try:
            cursor.execute(f"""SELECT {",".join(["family_tree_upload_log.email"] + relevant_columns)}
                            FROM family_tree_upload_log
                            LEFT JOIN users ON family_tree_upload_log.email=users.email
                            WHERE 
                                creation_time BETWEEN CURRENT_DATE - interval '7 days' AND CURRENT_DATE
                            ORDER BY
                                creation_time ASC;""")
        except Exception:
            logger.exception("Failed to fetch database report")
            return None

        rows = cursor.fetchall()

        csv_file = StringIO()
        csv.writer(csv_file).writerow(["email"] + relevant_columns)
        csv.writer(csv_file).writerows(rows)
        return csv_file.getvalue()


with DatabaseConnection(DATABASE_URL) as connection:
    if connection:
        csv_str: str = create_csv_string(connection)
        if csv_str is not None:
            send_email = Email(SENDGRID_API_KEY,
                               REPORT_EMAIL_FROM,
                               REPORT_EMAIL_TO,
                               "Family Tree Submitter Weekly CSV Report",
                               "Family Tree Submitter Weekly CSV Report",
                               language=None)
            sent_successfully = send_email.send_csv("weekly-csv-report.csv", csv_str.encode("utf-8"))
            if not sent_successfully:
                logger.error("Failed to send CSV weekly report by mail")
            logger.info("CSV report was sent successfully")
