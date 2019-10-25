import base64
import copy
import os
import unittest

import cv2
from flask import Response
import numpy as np


from src.server import application

application.config['TESTING'] = True

blank_image = np.zeros(shape=[1, 1, 3], dtype=np.uint8)
_, image_text = cv2.imencode(".jpg", blank_image)

test_family_tree: dict = {
  "1": {
    "ID": "1",
    "firstName": "Alex",
    "lastName": "Smith",
    "maidenName": None,
    "birthDate": "10/02/1955",
    "birthPlace": "New York",
    "gender": "male",
    "motherID": "10",
    "fatherID": "20",
    "isAlive": False,
    "deathPlace": "Boston",
    "deathDate": "07/07/2015",
    "image": base64.b64encode(image_text).decode("ascii"),
    "siblings": ["1000", "2000", "3000"]
  }
}


class TestFamilyTree(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()
        os.environ["SENDGRID_TEST"] = "True"

    def test_family_tree_valid(self):
        family_tree = copy.deepcopy(test_family_tree)
        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertEqual(200, response.status_code)

    def test_family_tree_bad_first_name(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["1"]["firstName"] = 123

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_bad_birth_date(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["1"]["birthDate"] = "18-12-1983"

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_missing_value(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["1"]["gender"] = ""

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_incorrect_gender_choice(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["1"]["gender"] = "animal"

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_missing_required_field(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["1"] = ""

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)
