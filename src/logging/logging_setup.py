import logging

from flask_log_request_id import RequestIDLogFilter

from src.logging.loggly_handler import LogglyHandler
from src.settings import LOGGLY_CUSTOMER_TOKEN


def logging_setup():
    stream_handler = logging.StreamHandler()
    stream_handler.addFilter(RequestIDLogFilter())

    loggly_handler = LogglyHandler("https://logs-01.loggly.com/inputs/{}/tag/python".format(LOGGLY_CUSTOMER_TOKEN))
    loggly_handler.addFilter(RequestIDLogFilter())

    logging.basicConfig(
        handlers=[stream_handler, loggly_handler],
        level=logging.INFO,
        format="[%(request_id)s] [%(asctime)s] [%(name)s] [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S %z")
