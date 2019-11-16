""" Gedcom all_to_one"""

from datetime import datetime
from langdetect import detect


def format_date(string_date):
    if string_date != None:
        if len(string_date) == 10:
            temp_date = datetime.strptime(string_date, "%d/%m/%Y")
            new_format_date = datetime.strftime(temp_date, "%d %b %Y").upper()
        else:
            temp_date = datetime.strptime(string_date, "%Y")
            new_format_date = datetime.strftime(temp_date, "%Y")
    else:
        return string_date
    return new_format_date


def create_head_record(file_name):
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
1 SOUR "Family Tree"
2 VERS 1.0
2 CORP Beit_Hatfutsot
1 DATE {} 
2 TIME {}
1 FILE {}
1 GEDC
2 VERS 5.5.1""".format(date, time, file_name)
    return lines_header


def define_language(words):
    return detect(words)


def create_language_record(language):
    line_language = "\n1 LANG {}".format(language.upper())
    return line_language


def check_no_empty_data(data, data_str):
    if data is None:
        data_str = ""
        return False, data_str
    else:
        return True, data_str


def create_individual_record(Person, Family):
    # create the INDIVIDUAL_RECORD
    # set INDI data (person name, id)
    lines_person = "\n0 @I{}@ INDI\n1 NAME {} /{}/".format(Person.ID, Person.firstName, Person.lastName)

    # set SURN data (maiden name)
    # _result, lines_person_maidenName = check_no_empty_data(Person.maidenName, "\n1 SURN {}".format(Person.maidenName))

    # set SEX data
    lines_person_sex = "\n1 SEX {}".format(Person.gender[0].upper())

    # set BIRTh data
    result_date, lines_person_birth_date = check_no_empty_data(Person.birthDate,
                                                               "\n2 DATE {}".format(format_date(Person.birthDate)))
    result_place, lines_person_birth_place = check_no_empty_data(Person.birthPlace,
                                                                 "\n2 PLAC {}".format(Person.birthPlace))
    if result_date or result_place:
        lines_birth = "\n1 BIRT"
    else:
        lines_birth = ""
    lines_person_birth = lines_birth + lines_person_birth_date + lines_person_birth_place

    # set FAMC data (parent family)
    _result, lines_person_family = check_no_empty_data(Family.ID, "\n1 FAMC @F{}".format(Family.ID))

    # set DEATh data
    if Person.isAlive is True:
        lines_person_death = ""
    else:
        result_date, lines_person_death_date =\
            check_no_empty_data(
                Person.deathDate,
                "\n2 DATE {}".format(format_date(Person.deathDate))) if "deathDate" in Person else (None, "")

        result_place, lines_person_death_place =\
            check_no_empty_data(
                Person.deathPlace,
                "\n2 PLAC {}".format(Person.deathPlace)) if "deathPlace" in Person else (None, "")
        lines_death = "\n1 DEAT"
        lines_person_death = lines_death + lines_person_death_date + lines_person_death_place

    # set FILE data (image)
    _result, lines_person_image =\
        check_no_empty_data(
            Person.image,
            "\n1 OBJE\n2 FILE {}".format(Person.image)) if "image" in Person else (None, "")

    # return lines_person + lines_person_maidenName + lines_person_sex + \
    return lines_person + lines_person_sex + \
           lines_person_birth + lines_person_family + \
           lines_person_death + lines_person_image


def create_family_record(Person, Family):
    # create a list of siblings, transform to type string for printing
    ls = []
    lines_siblings = ""
    for each in Person.siblings:
        ls.append("\n1 CHIL @I{}@".format(each))
        lines_siblings = "".join(ls)

        # create the family of parents, FAMC_RECORD
    lines_family = """\n0 @F{}@ FAM""".format(Family.ID)
    _result, lines_father = check_no_empty_data(Family.fatherID, "\n1 HUSB @I{}@".format(Family.fatherID))
    _result, lines_mother = check_no_empty_data(Family.motherID, "\n1 WIFE @I{}@".format(Family.motherID))
    lines_firstChild = "\n1 CHIL @I{}@".format(Family.firstChild)

    return lines_family + lines_father + lines_mother + lines_firstChild + lines_siblings