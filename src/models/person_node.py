from dataclasses import dataclass
from typing import Optional
from typing import List

from src.models.person_details import PersonDetails


@dataclass
class PersonNode(PersonDetails):
    mother: Optional['PersonNode']
    father: Optional['PersonNode']
    siblings: Optional[List['PersonNode']]


def make_person_node_from_person_details(person_details: PersonDetails) -> PersonNode:
    return PersonNode(
        mother=None,
        father=None,
        siblings=[],
        **person_details.__dict__)
