from __future__ import annotations
from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class Person:
    first_name: str
    last_name: str
    maiden_name: Optional[str]
    gender: str
    birth_date: date
    birth_place: str
    is_alive: bool
    death_date: Optional[date]
    death_place: Optional[str]
    image: str
