from PIL import Image
from resizeimage import resizeimage
import io


def resize_image(image: bytes, image_size: int) -> bytes:
    image_file_object = Image.open(io.BytesIO(image))
    resized_image: Image = resizeimage.resize_width(image_file_object, image_size, validate=False)
    resized_image_bytes = image_to_byte_array(resized_image)
    return resized_image_bytes


def image_to_byte_array(image: Image) -> bytes:
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format="png")
    img_byte_arr = img_byte_arr.getvalue()
    return img_byte_arr
