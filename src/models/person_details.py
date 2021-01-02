from dataclasses import dataclass
from typing import Optional


@dataclass
class PersonDetails:
    id: int
    image: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    maiden_name: Optional[str]
    birth_date: Optional[str]
    birth_place: Optional[str]
    gender: Optional[str]
    is_alive: Optional[bool]
    death_place: Optional[str]
    death_date: Optional[str]
    related_person: Optional['PersonDetails']
