from dataclasses import dataclass
from typing import Optional
from typing import List

from src.models.person_node import PersonNode
from src.models.co_parent import CoParent


@dataclass
class Submitter(PersonNode):
    co_parents: Optional[List[CoParent]]


def make_submitter_from_person_node(person_node: PersonNode) -> Submitter:
    return Submitter(
        co_parents=[],
        **person_node.__dict__)
