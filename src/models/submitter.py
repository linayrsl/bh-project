from dataclasses import dataclass
from typing import Optional
from typing import List

from src.models.person_node import PersonNode


@dataclass
class Submitter(PersonNode):
    children: Optional[List['PersonNode']]


