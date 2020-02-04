import os
import random
import unittest

from freezegun import freeze_time

from src.gedcom.handler import handler


def read_expectations_file(file_name: str) -> str:
    current_directory = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(current_directory, "expectations", file_name), mode="r") as file:
        expected_gedcom_string = file.read()
        return expected_gedcom_string


blank_image = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigD/2Q=="


class TestCreateGedcom(unittest.TestCase):
    def test_create_gedcom_simple(self):
        # Setup test
        data_dict: dict = {
            "1": {
                "ID": "1",
                "firstName": "Alex",
                "lastName": "Smith",
                "maidenName": "none",
                "birthDate": "10/02/1974",
                "birthPlace": "New York",
                "gender": "male",
                "motherID": "10",
                "fatherID": "20",
                "isAlive": False,
                "deathPlace": "Boston",
                "deathDate": "07/07/2000",
                "image": blank_image,
                "siblings": ["2"]
            },
            "2": {
                "ID": "2",
                "firstName": "Mary",
                "lastName": "Smith",
                "maidenName": "none",
                "birthDate": "10/02/1975",
                "birthPlace": "New York",
                "gender": "female",
                "motherID": "10",
                "fatherID": "20",
                "isAlive": True,
                "image": blank_image,
                "siblings": ["1"]
            },
            "3": {
                "ID": "3",
                "firstName": "Ben",
                "lastName": "Gur",
                "maidenName": "none",
                "birthDate": "10/02/1975",
                "birthPlace": "New York",
                "gender": "male",
                "motherID": None,
                "fatherID": None,
                "isAlive": True,
                "image": blank_image,
                "siblings": []
            },
            "4": {
                "ID": "4",
                "firstName": "Elizabeth",
                "lastName": "Gur",
                "maidenName": "none",
                "birthDate": "10/02/2000",
                "birthPlace": "New York",
                "gender": "female",
                "motherID": "2",
                "fatherID": "3",
                "isAlive": True,
                "image": blank_image,
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
                "isAlive": False,
                "deathPlace": "Boston",
                "deathDate": "07/07/2000",
                "image": blank_image,
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
                "isAlive": False,
                "deathPlace": "Boston",
                "deathDate": "07/07/2000",
                "image": blank_image,
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
