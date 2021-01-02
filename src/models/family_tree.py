from __future__ import annotations
from dataclasses import dataclass
from .submitter import Submitter


@dataclass
class FamilyTree:
    submitter_email: str
    submitter: Submitter
    language: str

