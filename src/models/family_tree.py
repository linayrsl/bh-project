from __future__ import annotations
from dataclasses import dataclass
from typing import List
from .person import Person


@dataclass
class FamilyTree:
    person: Person
    parents: List[FamilyTree]
    siblings: List[Person]
