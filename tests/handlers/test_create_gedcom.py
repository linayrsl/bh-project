import os
import random
import unittest

from freezegun import freeze_time

from src.gedcom.gedcom_builder import GedcomBuilder
from src.handlers.family_tree import map_family_tree_json_to_model, count_family_tree_individuals


def read_expectations_file(file_name: str) -> str:
    current_directory = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(current_directory, "expectations", file_name), mode="r") as file:
        expected_gedcom_string = file.read()
        return expected_gedcom_string


blank_image = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigD/2Q=="


class TestCreateGedcom(unittest.TestCase):
    def test_create_gedcom_simple(self):
        self.maxDiff = None
        # Setup test
        data_dict = {
                              "language": "he",
                              "submitter": {
                                "image": None,
                                "firstName": "Monica",
                                "lastName": "Geller",
                                "maidenName": None,
                                "gender": "female",
                                "birthDate": "1980",
                                "birthPlace": "New York",
                                "isAlive": True,
                                "deathDate": None,
                                "deathPlace": None,
                                "isSubmitter": True,
                                "mother": {
                                  "image": None,
                                  "firstName": "Judy",
                                  "lastName": "Geller",
                                  "maidenName": None,
                                  "gender": "female",
                                  "birthDate": "1964",
                                  "birthPlace": "New York",
                                  "isAlive": True,
                                  "deathDate": None,
                                  "deathPlace": None,
                                  "isSubmitter": False,
                                  "mother": {
                                    "image": None,
                                    "firstName": None,
                                    "lastName": None,
                                    "maidenName": None,
                                    "gender": None,
                                    "birthDate": None,
                                    "birthPlace": None,
                                    "isAlive": True,
                                    "deathDate": None,
                                    "deathPlace": None,
                                    "isSubmitter": False,
                                    "mother": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "father": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "siblings": None
                                  },
                                  "father": {
                                    "image": None,
                                    "firstName": None,
                                    "lastName": None,
                                    "maidenName": None,
                                    "gender":None,
                                    "birthDate": None,
                                    "birthPlace": None,
                                    "isAlive": True,
                                    "deathDate": None,
                                    "deathPlace": None,
                                    "isSubmitter": False,
                                    "mother": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "father": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "siblings": None
                                  },
                                  "siblings": []
                                },
                                "father": {
                                  "image": None,
                                  "firstName": "Jack",
                                  "lastName": "Geller",
                                  "maidenName": None,
                                  "gender": "male",
                                  "birthDate": "1962",
                                  "birthPlace": "New York",
                                  "isAlive": True,
                                  "deathDate": None,
                                  "deathPlace": None,
                                  "isSubmitter": False,
                                  "mother": {
                                    "image": None,
                                    "firstName": None,
                                    "lastName": None,
                                    "maidenName": None,
                                    "gender": None,
                                    "birthDate": None,
                                    "birthPlace": None,
                                    "isAlive": True,
                                    "deathDate": None,
                                    "deathPlace": None,
                                    "isSubmitter": False,
                                    "mother": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "father": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "siblings": None
                                  },
                                  "father": {
                                    "image": None,
                                    "firstName": None,
                                    "lastName": None,
                                    "maidenName": None,
                                    "gender": None,
                                    "birthDate": None,
                                    "birthPlace": None,
                                    "isAlive": True,
                                    "deathDate": None,
                                    "deathPlace": None,
                                    "isSubmitter": False,
                                    "mother": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "father": {
                                      "image": None,
                                      "firstName": None,
                                      "lastName": None,
                                      "maidenName": None,
                                      "gender": None,
                                      "birthDate": None,
                                      "birthPlace": None,
                                      "isAlive": True,
                                      "deathDate": None,
                                      "deathPlace": None,
                                      "isSubmitter": False,
                                      "mother": None,
                                      "father": None,
                                      "siblings": None
                                    },
                                    "siblings": None
                                  },
                                  "siblings": []
                                },
                                "siblings": [
                                  {
                                    "image": None,
                                    "firstName": "Ross",
                                    "lastName": "Geller",
                                    "maidenName": None,
                                    "gender": "male",
                                    "birthDate": "1985",
                                    "birthPlace": "NewYork",
                                    "isAlive": True,
                                    "deathDate": None,
                                    "deathPlace": None,
                                    "isSubmitter": False,
                                    "mother": None,
                                    "father": None,
                                    "siblings": None
                                  },
                                ],
                                # "children": [
                                #     {
                                #         "image": None,
                                #         "firstName": "ben",
                                #         "lastName": "Geller",
                                #         "maidenName": None,
                                #         "gender": "male",
                                #         "birthDate": "1985",
                                #         "birthPlace": "NewYork",
                                #         "isAlive": True,
                                #         "deathDate": None,
                                #         "deathPlace": None,
                                #         "isSubmitter": False,
                                #         "relatedPerson": {
                                #             "image": None,
                                #             "firstName": "Chandler",
                                #             "lastName": "Bing",
                                #             "maidenName": None,
                                #             "gender": "male",
                                #             "birthDate": "1985",
                                #             "birthPlace": "NewYork",
                                #             "isAlive": True,
                                #             "deathDate": None,
                                #             "deathPlace": None,
                                #             "isSubmitter": False
                                #           }
                                #     },
                                #     {
                                #         "image": None,
                                #         "firstName": "ben",
                                #         "lastName": "Geller",
                                #         "maidenName": None,
                                #         "gender": "male",
                                #         "birthDate": "1985",
                                #         "birthPlace": "NewYork",
                                #         "isAlive": True,
                                #         "deathDate": None,
                                #         "deathPlace": None,
                                #         "isSubmitter": False,
                                #         "relatedPerson": {
                                #             "image": None,
                                #             "firstName": "Chandler",
                                #             "lastName": "Bing",
                                #             "maidenName": None,
                                #             "gender": "male",
                                #             "birthDate": "1985",
                                #             "birthPlace": "NewYork",
                                #             "isAlive": True,
                                #             "deathDate": None,
                                #             "deathPlace": None,
                                #             "isSubmitter": False
                                #           }
                                #     }
                                # ]
                              },
                              "submitterEmail": "friends@gmail.com"
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
            family_tree_model = map_family_tree_json_to_model(data_dict)
            gedcom_data = GedcomBuilder(family_tree_model)
            gedcom_string, _ = gedcom_data.get_gedcom_string()
        # Verify results
        # Comparing "real time" gedcom string with a expected "example" gedcom string from a file.
        self.assertEquals(gedcom_string.strip(), read_expectations_file("create_gedcom_simple.ged").strip())
