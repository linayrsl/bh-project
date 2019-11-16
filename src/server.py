import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_log_request_id import RequestID
from flask_talisman import Talisman, GOOGLE_CSP_POLICY

from src.handlers.auth import auth
from src.handlers.family_tree import family_tree
from src.handlers.resize_image import resize_image
from src.logging.logging_setup import logging_setup

logging_setup()
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
Talisman(application, content_security_policy=GOOGLE_CSP_POLICY)
RequestID(application)


@application.route('/')
def root():
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


@application.route('/<string:path_part1>')
@application.route('/<string:path_part1>/<string:path_part2>')
def client_page2(path_part1: str, path_part2: str = None):
    return application.send_static_file("index.html")


if __name__ == "__main__":
    application.run(debug=True, use_reloader=False)
