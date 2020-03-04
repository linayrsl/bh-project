"""sends Gedcom string as attachment via SendGrid service"""
import logging
import os

from sendgrid import SendGridAPIClient
import base64
from sendgrid.helpers.mail import (
    Mail, Attachment, FileContent,
    FileType, Disposition, ContentId)

logger = logging.getLogger(__name__)


class Email:
    def __init__(self, api_key: str, from_email, to_email, subject, content):
        self.api_key = api_key
        self.from_email = from_email
        self.to_email = to_email
        self.subject = subject
        self.content = content

    def send_zip(self, file_name: str, data: bytes) -> bool:
        # create message
        message = Mail(self.from_email, self.to_email, self.subject, self.content)

        # create attachment
        file_type = 'GED file'
        encoded = base64.b64encode(data).decode()
        attachment = Attachment()
        attachment.file_content = FileContent(encoded)
        attachment.file_type = FileType(file_type)
        attachment.file_name = file_name
        attachment.disposition = Disposition('attachment')
        attachment.content_id = ContentId('Example Content ID')
        message.attachment = attachment

        # This code is for testing purposes.
        # Allows to test the class above without sending mail.
        # If a value in "SENDGRID_TEST" environment equals to "True" this function will return boolean True
        # otherwise this function will return boolean False.
        if os.environ.get("SENDGRID_TEST") is not None:
            return os.environ.get("SENDGRID_TEST") == "True"

        # send
        try:
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            logger.info("Sent gedcom successfully with response code: {}".format(response.status_code))
            return True
        except Exception:
            logger.exception("Failed to sent gedcom")
            return False

    def send_verification_code(self, to_email: str, verification_code: str):
        subject = "קוד הזיהוי עבור בניית עץ המשפחה"
        content = "קוד הזיהוי עבור בניית עץ המשפחה: {}".format(verification_code)
        message = Mail(self.from_email, to_email, subject, content)

        # This code is for testing purposes.
        # Allows to test the class above without sending mail.
        # If a value in "SENDGRID_TEST" environment equals to "True" this function will return boolean True
        # otherwise this function will return boolean False.
        if os.environ.get("SENDGRID_TEST") is not None:
            return os.environ.get("SENDGRID_TEST") == "True"

        # send
        try:
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            logger.info("Sent verification code successfully with response code: {}".format(response.status_code))
            return True
        except Exception:
            logger.exception("Failed to sent verification code")
            return False

    def send_csv(self, file_name: str, data: bytes) -> bool:
        # create message
        message = Mail(self.from_email, self.to_email, self.subject, self.content)

        # create attachment
        file_type = "text/csv"
        encoded = base64.b64encode(data).decode()
        attachment = Attachment()
        attachment.file_content = FileContent(encoded)
        attachment.file_type = FileType(file_type)
        attachment.file_name = file_name
        # attachment.disposition = Disposition('attachment')
        # attachment.content_id = ContentId('Example Content ID')
        message.attachment = attachment

        # This code is for testing purposes.
        # Allows to test the class above without sending mail.
        # If a value in "SENDGRID_TEST" environment equals to "True" this function will return boolean True
        # otherwise this function will return boolean False.
        if os.environ.get("SENDGRID_TEST") is not None:
            return os.environ.get("SENDGRID_TEST") == "True"

        # send
        try:
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            logger.info("Sent gedcom successfully with response code: {}".format(response.status_code))
            return True
        except Exception as error:
            logger.exception(f"Failed to sent csv {error}")
            return False
