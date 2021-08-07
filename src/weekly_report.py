import io

import logging
import csv
from io import StringIO
from typing import Optional

import xlsxwriter

from src.database.database_connection import DatabaseConnection
from src.logging.logging_setup import logging_setup
from src.mail.email import Email
from src.settings import DATABASE_URL, SENDGRID_API_KEY, REPORT_EMAIL_FROM, \
    REPORT_EMAIL_TO, REPORT_CSV_ENCODING

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


def create_xlsx_bytes(db_connection) -> Optional[bytes]:
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
                                creation_time BETWEEN CURRENT_DATE - interval '4 months' AND CURRENT_DATE
                            ORDER BY
                                creation_time ASC;""")
        except Exception:
            logger.exception("Failed to fetch database report")
            return None

        rows = cursor.fetchall()

        xlsx_file = io.BytesIO()
        workbook = xlsxwriter.Workbook(xlsx_file, {'in_memory': True, 'remove_timezone': True})
        worksheet = workbook.add_worksheet()

        for col_index, col in enumerate(["email"] + relevant_columns):
            worksheet.write(0, col_index, col)

        for row_index, row in enumerate(rows):
            for col_index, col in enumerate(row):
                worksheet.write(row_index + 1, col_index, col)
        workbook.close()
        xlsx_file.seek(0)
        return xlsx_file.read()


with DatabaseConnection(DATABASE_URL) as connection:
    if connection:
        xlsx_bytes: bytes = create_xlsx_bytes(connection)
        if xlsx_bytes is not None:
            send_email = Email(SENDGRID_API_KEY,
                               REPORT_EMAIL_FROM,
                               REPORT_EMAIL_TO,
                               "Family Tree Submitter Weekly Report",
                               "Family Tree Submitter Weekly Report",
                               language=None)
            sent_successfully = send_email.send_report(
                "weekly-report.xlsx",
                xlsx_bytes,
                file_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            if not sent_successfully:
                logger.error("Failed to send weekly report by mail")
            logger.info("Report was sent successfully")
