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
                "image": blank_image,
                "firstName": "לינה",
                "lastName": "ירוסלבסקי",
                "maidenName": None,
                "gender": "female",
                "birthDate": "18/12/1983",
                "birthPlace": "טשקנט",
                "motherID": "2",
                "fatherID": "5",
                "isAlive": True,
                "isSubmitter": True,
                "ID": "1",
                "siblings": [
                    "8",
                    "9"
                ]
            },
            "2": {
                "image": None,
                "firstName": "גלית",
                "lastName": "ירוסלבסקי",
                "maidenName": None,
                "gender": "female",
                "birthDate": "1964",
                "birthPlace": "טשקנט",
                "motherID": "3",
                "fatherID": "4",
                "isAlive": True,
                "isSubmitter": False,
                "ID": "2",
                "siblings": []
            },
            "3": {
                "image": None,
                "firstName": "אלבטינה",
                "lastName": "לרנמן",
                "maidenName": None,
                "gender": "female",
                "birthDate": "1930",
                "birthPlace": "טשקנט",
                "motherID": None,
                "fatherID": None,
                "isAlive": True,
                "isSubmitter": False,
                "ID": "3",
                "siblings": []
            },
            "4": {
                "image": None,
                "firstName": "מרק",
                "lastName": "לרנמן",
                "maidenName": None,
                "gender": "male",
                "birthDate": "1931",
                "birthPlace": "טשקנט",
                "motherID": None,
                "fatherID": None,
                "isAlive": False,
                "deathDate": "2013",
                "deathPlace": "ישראל",
                "isSubmitter": False,
                "ID": "4",
                "siblings": []
            },
            "5": {
                "image": None,
                "firstName": "בוריס",
                "lastName": "ירוסלבסקי",
                "maidenName": None,
                "gender": "male",
                "birthDate": "1964",
                "birthPlace": "טשקנט",
                "motherID": "6",
                "fatherID": "7",
                "isAlive": True,
                "isSubmitter": False,
                "ID": "5",
                "siblings": []
            },
            "6": {
                "image": None,
                "firstName": "בלה",
                "lastName": "ירוסלבסקי",
                "maidenName": None,
                "gender": "female",
                "birthDate": "1935",
                "birthPlace": "טשקנט",
                "motherID": None,
                "fatherID": None,
                "isAlive": False,
                "deathDate": "1960",
                "deathPlace": "טשקנט",
                "isSubmitter": False,
                "ID": "6",
                "siblings": []
            },
            "7": {
                "image": None,
                "firstName": "איליה",
                "lastName": "ירוסלבסקי",
                "maidenName": None,
                "gender": "male",
                "birthDate": "1936",
                "birthPlace": None,
                "motherID": None,
                "fatherID": None,
                "isAlive": False,
                "deathDate": "2001",
                "deathPlace": "ישראל",
                "isSubmitter": False,
                "ID": "7",
                "siblings": []
            },
            "8": {
                "image": None,
                "firstName": "לנה",
                "lastName": "מגדל",
                "maidenName": None,
                "gender": "female",
                "birthDate": "18/12/1983",
                "birthPlace": "טשקנט",
                "motherID": "2",
                "fatherID": "5",
                "isAlive": True,
                "isSubmitter": False,
                "ID": "8",
                "siblings": [
                    "1",
                    "9"]
            },
            "9": {
                "image": None,
                "firstName": "יגאל",
                "lastName": "ירוסלבסקי",
                "maidenName": None,
                "gender": "male",
                "birthDate": "1978",
                "birthPlace": "טשקנט",
                "motherID": "2",
                "fatherID": "5",
                "isAlive": True,
                "isSubmitter": False,
                "ID": "9",
                "siblings": [
                    "8",
                    "1"]
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
