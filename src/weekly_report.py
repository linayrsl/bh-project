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
from storage.google_cloud_client import generate_signed_url

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
    relevant_columns = ["family_tree_upload_log.email",
                        "first_name",
                        "last_name",
                        "gedcom_language",
                        "address",
                        "city",
                        "phone",
                        "zip",
                        "country",
                        "file_name",
                        "creation_time",
                        "num_of_people",
                        "num_of_photos",
                        "is_new_tree"]
    with db_connection.cursor() as cursor:
        try:
            cursor.execute(f"""SELECT {",".join(relevant_columns)}
                            FROM family_tree_upload_log
                            LEFT JOIN users ON family_tree_upload_log.email=users.email
                            WHERE 
                                creation_time BETWEEN CURRENT_DATE - interval '7 days' AND CURRENT_DATE
                            ORDER BY
                                creation_time ASC;""")
        except Exception:
            logger.exception("Failed to fetch database report")
            return None

        # Column index is 10 because email is prepended to be the first column
        date_column_index = 10
        rows = cursor.fetchall()

        file_name_index: int = relevant_columns.index("file_name")
        relevant_columns[0] = "email"
        relevant_columns[file_name_index] = "gedcom_url"

        rows_for_xlsx = []
        for row in rows:
            row_for_xlsx = list(row)
            file_name: str = row_for_xlsx[file_name_index]
            row_for_xlsx[file_name_index] = generate_signed_url(file_name)
            rows_for_xlsx.append(row_for_xlsx)

        xlsx_file = io.BytesIO()
        workbook = xlsxwriter.Workbook(xlsx_file, {'in_memory': True, 'remove_timezone': True})
        date_format = workbook.add_format({'num_format': 'dd/mm/yy hh:mm'})
        worksheet = workbook.add_worksheet()

        for col_index, col in enumerate(relevant_columns):
            worksheet.write(0, col_index, col)

        for row_index, row in enumerate(rows_for_xlsx):
            for col_index, col in enumerate(row):
                if col_index == date_column_index:
                    worksheet.write(row_index + 1, col_index, col, date_format)
                else:
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
