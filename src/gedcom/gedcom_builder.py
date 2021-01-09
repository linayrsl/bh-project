from typing import Tuple, Dict, List, Optional, Union
from datetime import datetime

from src.models.family_tree import FamilyTree
from src.models.person_details import PersonDetails
from src.models.person_node import PersonNode
from src.models.submitter import Submitter


class GedcomBuilder:
    def __init__(self, family_tree_model: FamilyTree):
        self.family_tree_model = family_tree_model

    def get_gedcom_string(self) -> Tuple[str, Dict[str, str]]:
        images = {}
        gedcom_string = self._create_gedcom_header()
        gedcom_string += self._create_individual_record(self.family_tree_model.submitter, None, None, images)
        gedcom_string += self._create_children_records(self.family_tree_model.submitter, images)
        gedcom_string += "\n0 TRLR"
        return gedcom_string, images

    def _create_gedcom_header(self) -> str:
        # set date and time of creating Gedcom file
        now = datetime.now()
        day = now.day
        month = now.strftime("%b")
        year = now.year
        time = now.strftime("%H:%M:%S")
        date = "{} {} {}".format(day, month.upper(), year)

        # create the HEAD_RECORD
        lines_header = """
0 HEAD
1 CHAR UTF-8
1 SUBM @{}@
1 SOUR "Family Tree"
2 VERS 1.0
2 CORP Beit_Hatfutsot
1 DATE {}
2 TIME {}
1 GEDC
2 VERS 5.5.1""".format(self.family_tree_model.submitter.id, date, time)
        return lines_header

    def _generate_record(self, level, tag, *params):
        if len([param for param in params if param]) == 0:
            return ""

        record_template = "\n{} {}".format(level, tag)
        return record_template.format(*params)

    def _create_individual_record(self, person: PersonNode, fams, famc, images: Dict[str, str]):
        if not person:
            return ""
        indi_record_mother = ""
        indi_record_father = ""
        family_record = ""
        indi_record = "\n0 @{}@ INDI".format(person.id)
        indi_record += self._generate_record(1, "NAME {} /{}/", person.first_name, person.last_name)
        indi_record += self._generate_record(2, "GIVN {}", person.first_name)
        indi_record += self._generate_record(2, "SURN {}", person.last_name)
        indi_record += self._generate_record(1, "SEX {}", person.gender)
        indi_record += "\n1 BIRT"
        indi_record += self._generate_record(2, "DATE {}", self._format_date(person.birth_date))
        indi_record += self._generate_record(2, "PLAC {}", person.birth_place)
        family_id = famc
        if person.mother or person.father:
            family_id = self._generate_family_record_id(person.mother, person.father)
            indi_record_mother = self._create_individual_record(person.mother, family_id, None, images)
            indi_record_father = self._create_individual_record(person.father, family_id, None, images)
            family_record = self._create_family_record(
                family_id,
                person.mother,
                person.father,
                ([sibling.id for sibling in person.siblings] if person.siblings else []) + [person.id])
        indi_record += self._generate_record(1, "FAMC @{}@", family_id)
        indi_record_sibling = ""
        if person.siblings:
            for sibling in person.siblings:
                indi_record_sibling += self._create_individual_record(sibling, None, family_id, images)

        if fams:
            indi_record += self._generate_record(1, "FAMS @{}@", fams)
        if not person.is_alive:
            indi_record += "\n1 DEAT"
            indi_record += self._generate_record(2, "DATE {}", self._format_date(person.death_date))
            indi_record += self._generate_record(2, "PLAC {}", person.death_place)
        if person.image:
            image_file_name = "{}.jpg".format(person.id)
            images[image_file_name] = person.image
            indi_record += "\n1 OBJE"
            indi_record += self._generate_record(2, "FILE {}".format(person.image))
        return indi_record + indi_record_mother + indi_record_father + indi_record_sibling + family_record

    def _generate_family_record_id(self, mother: Union[PersonNode, PersonDetails], father: Union[PersonNode, PersonDetails]):
        return "M{}F{}".format(mother.id if mother else 0, father.id if father else 0)

    def _create_family_record(self, family_id, mother, father, children_ids: List[int]):
        family_record = self._generate_record(0, "@{}@ FAM", family_id)
        if father:
            family_record += self._generate_record(1, "HUSB @{}@", father.id)
        if mother:
            family_record += self._generate_record(1, "WIFE @{}@", mother.id)
        for child_id in children_ids:
            family_record += self._generate_record(1, "CHIL @{}@", child_id)
        return family_record

    def _create_children_records(self, submitter: Submitter, images: Dict[str, str]) -> str:
        if not submitter or not submitter.children:
            return ""
        family_id = ""
        children_record = ""
        children_to_family_relation: Dict[str, List[int]] = {}
        for child in submitter.children:
            if child.related_person:
                if submitter.gender == "female":
                    family_id = self._generate_family_record_id(submitter, child.related_person)
                else:
                    family_id = self._generate_family_record_id(child.related_person, submitter)
            else:
                family_id = self._generate_family_record_id(submitter, None)
            if family_id not in children_to_family_relation:
                children_to_family_relation[family_id] = []
            children_to_family_relation[family_id].append(child.id)

            children_record += self._create_individual_record(child, None, family_id, images)

        for key, value in children_to_family_relation.items():
            if submitter.gender == "female":
                children_record += self._create_family_record(family_id, submitter, None, value)
            else:

                children_record += self._create_family_record(family_id, None, submitter, value)
        return children_record

    def _format_date(self, string_date):
        if string_date:
            if len(string_date) == 10:
                temp_date = datetime.strptime(string_date, "%d/%m/%Y")
                new_format_date = datetime.strftime(temp_date, "%d %b %Y").upper()
            else:
                temp_date = datetime.strptime(string_date, "%Y")
                new_format_date = datetime.strftime(temp_date, "%Y")
        else:
            return string_date
        return new_format_date
