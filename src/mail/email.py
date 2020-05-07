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

    def send_zip_to_user(self, file_name: str, data: bytes, to_email: str) -> bool:
        text_to_user = '''
                <!DOCTYPE html>
                <html dir="rtl" lang="he">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                </head>
                <body>
                    <div dir="rtl">
                        <p>
                            שמחים שהצטרפת למאגר עצי המשפחה המאובטח של מוזיאון העם היהודי.
                        </p>
                        <p>
                            העץ נשלח למרכז לגנאלוגיה יהודית ע"ש דגלס א. גולדמן. כשהעץ שלך ייכנס למאגר, תישלח הודעה בדואר
                            אלקטרוני ובו מספר הרישום של העץ.
                        </p>
                        <p>
                            מצורף קובץ העץ שיצרת ותמונות במידה וצירפת.
                        כדי לקרוא את הפרטים יש להשתמש בתוכנה גנאלוגית שמפעילה קבצי GEDCOM.
                        </p>
                        <p>
                            <a target="_blank" href="https://www.bh.org.il/he/%D7%9E%D7%90%D7%92%D7%A8%D7%99%D7%9D-%D7%95%D7%90%D7%95%D7%A1%D7%A4%D7%99%D7%9D/%D7%92%D7%A0%D7%90%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%99%D7%94%D7%95%D7%93%D7%99%D7%AA/%D7%90%D7%A8%D7%92%D7%96-%D7%94%D7%9B%D7%9C%D7%99%D7%9D-%D7%A9%D7%9C%D7%9B%D7%9D/">
                        לשאלות נוספות באתר המאגרים >     
                            </a>
                        </p>
                    </div>
                </body>
                
                
                </html>
            '''
        # create message
        message = Mail(
            self.from_email,
            to_email,
            "קובץ עץ המשפחה", html_content=text_to_user)

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
