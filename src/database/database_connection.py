import psycopg2
import logging

logger = logging.getLogger(__name__)


class DatabaseConnection:
    def __init__(self, database_url):
        self.database_url = database_url
        self.connection = None

    def __enter__(self):
        try:
            self.connection = psycopg2.connect(self.database_url)
            self.connection.autocommit = True
        except Exception:
            logger.exception("Failed to connect to database")

        return self.connection

    def __exit__(self, exc_type, exc_value, exc_traceback):
        if self.connection:
            self.connection.close()
