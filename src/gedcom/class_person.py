""" Class Person """


class Person(object):
    def __init__(self, details):
        for k, item in details.items():
            setattr(self, k, item)
