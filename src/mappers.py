from typing import Dict
from .models.family_tree import FamilyTree
from .models.person import Person
from datetime import date


def create_person_from_json(person_info: Dict) -> Person:
    """
    Not validating input here because we are assuming
    that it was validated before calling this function.
    :param person_info:
    :return:
    """
    return Person(first_name=person_info["firstName"],
                  last_name=person_info["lastName"],
                  maiden_name=person_info["maidenName"] if "maidenName" in person_info else None,
                  gender=person_info["gender"],
                  birth_date=date.fromisoformat(person_info["birthDate"]),
                  birth_place=person_info["birthPlace"],
                  is_alive=person_info["isAlive"],
                  death_date=date.fromisoformat(person_info["deathDate"]) if "deathDate" in person_info else None,
                  death_place=person_info["deathPlace"] if "deathPlace" in person_info else None,
                  image=person_info["image"] if "image" in person_info else None)


def create_family_tree_from_json(family_tree_info: Dict) -> FamilyTree:
    """
    Not validating input here because we are assuming
    that it was validated before calling this function.
    :param family_tree_info:
    :return:
    """
    person = create_person_from_json(family_tree_info["person"])
    siblings = [create_person_from_json(sibling_info) for sibling_info in family_tree_info["siblings"]] \
        if "siblings" in family_tree_info else []
    parents = [create_family_tree_from_json(parent_info) for parent_info in family_tree_info["parents"]] \
        if "parents" in family_tree_info else []

    return FamilyTree(parents=parents, person=person, siblings=siblings)
