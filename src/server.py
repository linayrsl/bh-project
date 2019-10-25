import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_log_request_id import RequestIDLogFilter, RequestID

from src.handlers.auth import auth
from src.handlers.family_tree import family_tree
from src.handlers.resize_image import resize_image
from src.logging.loggly_handler import LogglyHandler
from src.settings import LOGGLY_CUSTOMER_TOKEN


stream_handler = logging.StreamHandler()
stream_handler.addFilter(RequestIDLogFilter())

loggly_handler = LogglyHandler("https://logs-01.loggly.com/inputs/{}/tag/python".format(LOGGLY_CUSTOMER_TOKEN))
loggly_handler.addFilter(RequestIDLogFilter())

logging.basicConfig(
    handlers=[stream_handler, loggly_handler],
    level=logging.INFO,
    format="[%(request_id)s] [%(asctime)s] [%(name)s] [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S %z")

logger = logging.getLogger(__name__)

root_path =\
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)))

client_files_directory_path = os.path.join(root_path, "static")

logger.info("Serving static files from {}".format(client_files_directory_path))

application = Flask(
    __name__,
    static_folder=client_files_directory_path,
    static_url_path='')

application.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

CORS(application)
RequestID(application)


@application.route('/', defaults={'path': ''})
@application.route('/<path:path>')
def root(path: str):
    return application.send_static_file("index.html")


application.register_blueprint(
    family_tree,
    url_prefix="/api/family-tree")

application.register_blueprint(
    auth,
    url_prefix="/api/auth")

application.register_blueprint(
    resize_image,
    url_prefix="/api/resize-image")


if __name__ == "__main__":
    application.run(debug=True, use_reloader=False)
