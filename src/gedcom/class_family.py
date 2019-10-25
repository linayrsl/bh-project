""" Class Family """

import random


family_with_children_list = []


class Family(object):
    def __init__(self, ID=None, motherID=None, fatherID=None,
                 firstChild=None, children=None):
        self.ID = id
        self.motherID = motherID
        self.fatherID = fatherID
        self.firstChild = firstChild
        self.children = children

    def create_parent_family(self, Person):
        if Person.motherID == None and Person.fatherID == None:
            self.ID = None  # don't create parent family
        else:
            self.ID = random.randint(100, 1000)
            self.firstChild = Person.ID
            self.children = Person.siblings

            if Person.motherID != None:  # only mom
                self.motherID = Person.motherID
                if Person.fatherID != None:
                    self.fatherID = Person.fatherID
            else:
                self.fatherID = Person.fatherID  # only dad

        if Person.siblings != []:
            family_with_children_list.append(self)
            for each in family_with_children_list:
                if (self.motherID == each.motherID) and (self.fatherID == each.fatherID):
                    self.ID = each.ID
                    # object replacement
                    family_with_children_list.remove(self)
                    family_with_children_list.append(self)
