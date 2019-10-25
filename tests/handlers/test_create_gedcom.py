import base64
import os
import random
import unittest
import numpy as np

import cv2
from freezegun import freeze_time

from src.gedcom.handler import handler


def read_expectations_file(file_name: str) -> str:
    current_directory = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(current_directory, "expectations", file_name), mode="r") as file:
        expected_gedcom_string = file.read()
        return expected_gedcom_string


blank_image = np.zeros(shape=[1, 1, 3], dtype=np.uint8)
_, image_text = cv2.imencode(".jpg", blank_image)


class TestCreateGedcom(unittest.TestCase):
    def test_create_gedcom_simple(self):
        # Setup test
        data_dict: dict = {
            "1": {
                "ID": "1",
                "firstName": "Alex",
                "lastName": "Smith",
                "maidenName": "none",
                "birthDate": "10/02/1955",
                "birthPlace": "New York",
                "gender": "male",
                "motherID": "10",
                "fatherID": "20",
                "isAlive": "False",
                "deathPlace": "Boston",
                "deathDate": "07/07/2000",
                "image": base64.b64encode(image_text).decode("ascii"),
                "siblings": []
            },
            "20": {
                "ID": "20",
                "firstName": "John",
                "lastName": "Smith",
                "maidenName": "none",
                "birthDate": "10/02/1930",
                "birthPlace": "New York",
                "gender": "male",
                "motherID": None,
                "fatherID": None,
                "isAlive": "False",
                "deathPlace": "Boston",
                "deathDate": "07/07/2000",
                "image": base64.b64encode(image_text).decode("ascii"),
                "siblings": []
            },
            "10": {
                "ID": "10",
                "firstName": "Monica",
                "lastName": "Smith",
                "maidenName": "Geller",
                "birthDate": "10/02/1930",
                "birthPlace": "New York",
                "gender": "female",
                "motherID": None,
                "fatherID": None,
                "isAlive": "False",
                "deathPlace": "Boston",
                "deathDate": "07/07/2000",
                "image": base64.b64encode(image_text).decode("ascii"),
                "siblings": []
            }
        }

        # Execute test

        # In order to test (compare) gedcom strings in this function we need
        # same family id numbers.
        # This function will initialize random number generator to always return same numbers,
        # because it's using the same "seed".
        random.seed(1)
        # In order to test (compare) gedcom strings in this function we need to "freeze" the date
        # field in the gedcom string from givings us the current date & time each time we do test run.
        # This function will freeze time before test execution.
        with freeze_time("2019-08-17"):
            gedcom_string, _, _ = handler(data_dict)
        # Verify results
        # Comparing "real time" gedcom string with a expected "example" gedcom string from a file.
        self.assertEquals(gedcom_string.strip(), read_expectations_file("create_gedcom_simple.ged").strip())
