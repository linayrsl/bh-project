""" Handler for all_to_one Gedcom files"""

from .class_person import Person
from .class_family import Family
from .create_gedcom import *


def handler(data_dictionary):
    list_appended_strings = []
    families = []  # list of family IDs
    list_families = []  # list of families data
    the_end = "\n0 TRLR"
    names = []  # list of last names
    dict_image = {}  # collect images
    dict_for_csv = {}  # collect data dictionary for csv

    # pulling user data
    for k in data_dictionary:
        user_ID = data_dictionary[k]["ID"]
        user_firstname = data_dictionary[k]["firstName"]
        user_lastname = data_dictionary[k]["lastName"]
        break

    # creating lastname list for define language
    number_of_person = 0
    for k in data_dictionary:
        names.append(data_dictionary[k]["lastName"])
        names_string = "".join(names)
        # counting family persons
        number_of_person += 1

    # create dictionary for csv use
    dict_for_csv["firstName"] = user_firstname
    dict_for_csv["lastName"] = user_lastname
    dict_for_csv["numPerson"] = number_of_person
    dict_for_csv["filenameGedcom"] = "{}.jpg".format(user_ID)

    # writing the HEAD Record
    list_appended_strings.append(create_head_record(dict_for_csv["filenameGedcom"]))
    # writing the language data to the HEAD Record
    list_appended_strings.append(create_language_record("HE"))

    # creating persons
    for _key, details in data_dictionary.items():
        my_person = Person(details=details)

        # creating filename for image
        image_filename = "{}.jpg".format(my_person.ID)

        # saving personal images
        dict_image[image_filename] = my_person.image
        my_person.image = image_filename

        # creating families
        my_parent_family = Family()  # create default object of Family class
        my_parent_family.create_parent_family(my_person)

        if my_parent_family.ID != None and my_parent_family.ID not in families:
            list_families.append(create_family_record(my_person, my_parent_family))
            families.append(my_parent_family.ID)

        # writing the INDIs data to the INDI data's list
        list_appended_strings.append(create_individual_record(my_person, my_parent_family))

        # writing the FAMCs data to list and transforming it to string
    lines_families = "".join(list_families)
    list_appended_strings.append(lines_families)
    # transforming INDI data's list to string
    gedcom_string = "".join(list_appended_strings)

    return (gedcom_string + the_end).encode('utf-8').decode('utf-8'), dict_image, dict_for_csv
