import os
from typing import List

CI = os.environ.get("CI", "False").lower() == "true"

DATABASE_URL = os.environ.get("DATABASE_URL",
                              "host=localhost dbname=bh_project user=postgres password=postgres")

ACTIVETRAIL_API_BASE_URL = os.environ.get("ACTIVETRAIL_API_BASE_URL")

ACTIVETRAIL_API_KEY = os.environ.get("ACTIVETRAIL_API_KEY")

SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")

GEDCOM_EMAIL_FROM = os.environ.get("GEDCOM_EMAIL_FROM")

GEDCOM_EMAIL_TO: List[str] = os.environ.get("GEDCOM_EMAIL_TO", "").split(",")

REPORT_EMAIL_FROM = os.environ.get("REPORT_EMAIL_FROM")

REPORT_EMAIL_TO: List[str] = os.environ.get("REPORT_EMAIL_TO", "").split(",")

REPORT_CSV_ENCODING: str = os.environ.get("REPORT_CSV_ENCODING", "windows-1255")

PERSON_PHOTO_MAX_ALLOWED_WIDTH: int = int(os.environ.get("PERSON_PHOTO_MAX_ALLOWED_WIDTH", 600))

LOGGLY_CUSTOMER_TOKEN = os.environ.get("LOGGLY_CUSTOMER_TOKEN")

VERIFICATION_CODE_EXPIRATION_SECONDS: int = int(os.environ.get("VERIFICATION_CODE_EXPIRATION_SECONDS", 36000))

CLIENT_API_BASE_URL: str = os.environ.get("CLIENT_API_BASE_URL", "")

CLIENT_GOOGLE_ANALYTICS_ID: str = os.environ.get("CLIENT_GOOGLE_ANALYTICS_ID")

CLIENT_ACCESSIBILITY_URL: str = os.environ.get("CLIENT_ACCESSIBILITY_URL")

AZURE_CONTAINER_NAME: str = os.environ.get("AZURE_CONTAINER_NAME")

AZURE_CONNECTION_STRING: str = os.environ.get("AZURE_CONNECTION_STRING")

