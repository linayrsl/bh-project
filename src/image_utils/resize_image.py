import cv2
import numpy as np

dsize = (480, 167)


def transform_image(binary_string_image):
    if len(binary_string_image) != 0:
        img = cv2.imdecode(np.frombuffer(binary_string_image, np.uint8), cv2.IMREAD_COLOR)
        img = cv2.resize(img, dsize)
    else:
        return print("The string is empty")

    _result, image_text = cv2.imencode(".jpg", img)

    return image_text
