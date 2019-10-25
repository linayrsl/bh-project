import base64
import logging

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import abort

from src.image_utils.resize_image import transform_image as resize_image_util

logger = logging.getLogger(__name__)

resize_image = Blueprint('resize_image', __name__)


@resize_image.route("/", methods=["POST"])
def resize_image_post():
    image_bytes = request.get_data()
    if not image_bytes:
        logger.info("Received invalid request. Request is missing body")
        abort(400, description="Expected binary data in request body")
    logging.info("request was processed and response was sent back")

    try:
        resized_image_b64 = base64.b64encode(
                resize_image_util(image_bytes)
            ).decode()
    except Exception:
        logger.exception("Failed to resize image")
        return abort(500, description="Failed to resize image")
    return jsonify(
        dict(resizedImageB64=resized_image_b64))
