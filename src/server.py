import os
import logging
import json

from flask import Flask, render_template
from flask_cors import CORS
from flask_log_request_id import RequestID
from flask_talisman import Talisman, GOOGLE_CSP_POLICY

from src.client_config import client_config
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
    template_folder=client_files_directory_path,
    static_folder=client_files_directory_path,
    static_url_path='')

application.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

extended_csp = GOOGLE_CSP_POLICY.copy()
extended_csp["script-src"] += " 'unsafe-inline' *.google-analytics.com"
extended_csp["style-src"] += " 'unsafe-inline'"
extended_csp["img-src"] = "'self' blob: data: *.google-analytics.com"
extended_csp["connect-src"] = "'self' *.google-analytics.com"

if not CI:
    CORS(application)
    # Talisman(application, content_security_policy=extended_csp)

RequestID(application)


@application.route("/")
def root():
    return render_template(
        "index.html",
        clientConfigOverride=json.dumps(client_config()).replace('"', '\\"'))


@application.route("/manifest.json")
def manifest():
    return application.send_static_file("manifest.json")


@application.route("/favicon.ico")
def favicon():
    return application.send_static_file("favicon.ico")


@application.route("/logo192.png")
def logo192():
    return application.send_static_file("logo192.png")


@application.route("/logo512.png")
def logo512():
    return application.send_static_file("logo512.png")


@application.route("/robots.txt")
def robots():
    return application.send_static_file("robots.txt")


application.register_blueprint(
    family_tree,
    url_prefix="/api/family-tree")

application.register_blueprint(
    auth,
    url_prefix="/api/auth")


@application.route('/<string:path_part1>')
@application.route('/<string:path_part1>/<string:path_part2>')
@application.route('/en/<string:path_part1>/<string:path_part2>')
def client_path_handler(path_part1: str, path_part2: str = None):
    return render_template(
        "index.html",
        clientConfigOverride=json.dumps(client_config()).replace('"', '\\"'))


if __name__ == "__main__":
    application.run(debug=True, use_reloader=False)
