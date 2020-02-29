from dataclasses import dataclass, asdict
from enum import Enum

import requests


class UnexpectedApiResponseError(Exception):
    pass


class ApiStatusTypes(Enum):
    Subscribed = 1
    Unsubscribed = 2
    Pending = 3


@dataclass
class ActiveTrailContact:
    status: str
    sms_status: str
    first_name: str
    last_name: str
    email: str
    sms: str
    is_do_not_mail: bool
    is_deleted: bool


class ActiveTrailClient:
    def __init__(self, base_url: str, auth_token: str):
        self.base_url = base_url
        self.auth_token = auth_token

    def create_contact(self, first_name: str, last_name: str, email: str, phone: str) -> int:
        full_url = "{}/api/contacts".format(self.base_url)
        headers = {"Authorization": "{}".format(self.auth_token),
                   "content-type": "application/json"}
        contact = ActiveTrailContact(status=ApiStatusTypes.Pending.name,
                                     sms_status=ApiStatusTypes.Pending.name,
                                     first_name=first_name,
                                     last_name=last_name,
                                     email=email,
                                     sms=phone,
                                     is_do_not_mail=False,
                                     is_deleted=False)
        response = requests.post(full_url, headers=headers, json=asdict(contact))

        if not response.ok:
            raise UnexpectedApiResponseError
        response_json = response.json()
        if not response_json or "id" not in response_json:
            raise UnexpectedApiResponseError
        return int(response_json["id"])


