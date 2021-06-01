import logging

logger = logging.getLogger(__name__)


def create_user_record(db_connection, email: str, first_name: str, last_name: str, phone: str, address: str, city: str,
                       country: str, zip_code: str):
    with db_connection.cursor() as cursor:
        try:
            cursor.execute(
            '''
                INSERT INTO users(email, first_name, last_name, phone, address, city,
                                  country, zip) 
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (email) DO UPDATE SET first_name = %s, last_name = %s, phone = %s, address = %s, city = %s, 
                                                  country = %s, zip = %s;
            ''', (email, first_name, last_name, phone, address, city, country, zip_code, first_name, last_name, phone,
                  address, city, country, zip_code))
        except Exception:
            logger.exception("User record insert query failed")
            return False
        logger.info("User record inserted successfully")
        return True
