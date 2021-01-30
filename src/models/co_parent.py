from typing import List

from src.models.person_details import PersonDetails
from src.models.person_node import PersonNode
from dataclasses import dataclass


@dataclass
class CoParent(PersonDetails):
    shared_children: List[PersonNode]

