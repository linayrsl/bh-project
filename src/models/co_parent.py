from typing import List

from src.models.person_details import PersonDetails
from src.models.person_node import PersonNode
from dataclasses import dataclass


@dataclass
class CoParent(PersonDetails):
    shared_children: List[PersonNode]


def make_co_parent_from_person_details(person_details: PersonDetails) -> CoParent:
    return CoParent(
        shared_children=[],
        **person_details.__dict__)
