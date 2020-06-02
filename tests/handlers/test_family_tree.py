import copy
import os
import unittest

from flask import Response


from src.server import application

application.config['TESTING'] = True

blank_image = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigD/2Q=="

test_family_tree: dict = {
    "submitterEmail": "email@server.com",
    "familyTree": {
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
            "image": blank_image,
            "siblings": ["1000", "2000", "3000"]
        }
    },
    "language": "he"
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
        family_tree["familyTree"]["1"]["firstName"] = 123

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_bad_birth_date(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["familyTree"]["1"]["birthDate"] = "18-12-1983"

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_missing_value(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["familyTree"]["1"]["gender"] = ""

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_incorrect_gender_choice(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["familyTree"]["1"]["gender"] = "animal"

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)

    def test_family_tree_missing_required_field(self):
        family_tree = copy.deepcopy(test_family_tree)
        family_tree["familyTree"]["1"] = ""

        with application.test_client() as client:
            response: Response = client.post("/api/family-tree/", json=family_tree)

            self.assertNotEqual(200, response.status_code)
