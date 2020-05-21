import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_log_request_id import RequestID
from flask_talisman import Talisman, GOOGLE_CSP_POLICY

from src.handlers.auth import auth
from src.handlers.family_tree import family_tree
from src.logging.logging_setup import logging_setup
from src.settings import CI

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

extended_csp = GOOGLE_CSP_POLICY.copy()
extended_csp["script-src"] += " 'unsafe-inline'"
extended_csp["img-src"] = "'self' data:"

if not CI:
    CORS(application)
    Talisman(application, content_security_policy=extended_csp)

RequestID(application)


@application.route('/')
def root():
    return application.send_static_file("index.html")


@application.route('/manifest.json')
def manifest():
    return application.send_static_file("manifest.json")


application.register_blueprint(
    family_tree,
    url_prefix="/api/family-tree")

application.register_blueprint(
    auth,
    url_prefix="/api/auth")


@application.route('/<string:path_part1>')
@application.route('/<string:path_part1>/<string:path_part2>')
@application.route('/<string:path_part1>/<string:path_part2>/<string:path_part3>')
def client_path_handler(path_part1: str, path_part2: str = None, path_part3: str = None):
    return application.send_static_file("index.html")


if __name__ == "__main__":
    application.run(debug=True, use_reloader=False)
