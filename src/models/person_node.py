from dataclasses import dataclass
from typing import Optional
from typing import List

from src.models.person_details import PersonDetails


@dataclass
class PersonNode(PersonDetails):
    mother: Optional['PersonNode']
    father: Optional['PersonNode']
    siblings: Optional[List['PersonNode']]




