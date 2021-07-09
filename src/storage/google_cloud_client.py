import binascii
import collections
import datetime
import hashlib
import io
import json
import os
from typing import Optional
from urllib.parse import quote

from google.cloud import storage
from google.oauth2 import service_account

from src.settings import GOOGLE_CLOUD_CREDENTIALS, GOOGLE_CLOUD_BUCKET
import logging

logger = logging.getLogger(__name__)


def upload_file(file_name: str, data: bytes) -> Optional[str]:
    if os.environ.get("MOCK_GEDCOM_UPLOAD_RESULT") is not None:
        return os.environ.get("MOCK_GEDCOM_UPLOAD_RESULT")

    try:
        json_account_info = json.loads(GOOGLE_CLOUD_CREDENTIALS)  # convert JSON to dictionary
        credentials = service_account.Credentials.from_service_account_info(
            json_account_info)

        storage_client = storage.Client(credentials=credentials)
        bucket = storage_client.get_bucket(GOOGLE_CLOUD_BUCKET)
        blob = bucket.blob(file_name)
        with io.BytesIO(data) as data_file:
            blob.upload_from_file(data_file)
        return generate_signed_url(credentials, GOOGLE_CLOUD_BUCKET, file_name)
    except Exception as e:
        logger.exception("Failed to upload to Google Cloud storage: {}".format(e))
        return None


def generate_signed_url(google_credentials, bucket_name, object_name,
                        subresource=None, expiration=604800, http_method='GET',
                        query_parameters=None, headers=None):

    if expiration > 604800:
        raise Exception('Expiration time parameter for google cloud storage blob signed url can\'t be longer than 604800 seconds (7 days).')

    canonical_uri = '/{}'.format(quote(object_name))

    datetime_now = datetime.datetime.utcnow()
    request_timestamp = datetime_now.strftime('%Y%m%dT%H%M%SZ')
    datestamp = datetime_now.strftime('%Y%m%d')

    client_email = google_credentials.service_account_email
    credential_scope = '{}/auto/storage/goog4_request'.format(datestamp)
    credential = '{}/{}'.format(client_email, credential_scope)

    if headers is None:
        headers = dict()
    host = '{}.storage.googleapis.com'.format(bucket_name)
    headers['host'] = host

    canonical_headers = ''
    ordered_headers = collections.OrderedDict(sorted(headers.items()))
    for k, v in ordered_headers.items():
        lower_k = str(k).lower()
        strip_v = str(v).lower()
        canonical_headers += '{}:{}\n'.format(lower_k, strip_v)

    signed_headers = ''
    for k, _ in ordered_headers.items():
        lower_k = str(k).lower()
        signed_headers += '{};'.format(lower_k)
    signed_headers = signed_headers[:-1]  # remove trailing ';'

    if query_parameters is None:
        query_parameters = dict()
    query_parameters['X-Goog-Algorithm'] = 'GOOG4-RSA-SHA256'
    query_parameters['X-Goog-Credential'] = credential
    query_parameters['X-Goog-Date'] = request_timestamp
    query_parameters['X-Goog-Expires'] = expiration
    query_parameters['X-Goog-SignedHeaders'] = signed_headers
    if subresource:
        query_parameters[subresource] = ''

    canonical_query_string = ''
    ordered_query_parameters = collections.OrderedDict(
        sorted(query_parameters.items()))
    for k, v in ordered_query_parameters.items():
        encoded_k = quote(str(k), safe='')
        encoded_v = quote(str(v), safe='')
        canonical_query_string += '{}={}&'.format(encoded_k, encoded_v)
    canonical_query_string = canonical_query_string[:-1]  # remove trailing '&'

    canonical_request = '\n'.join([http_method,
                                   canonical_uri,
                                   canonical_query_string,
                                   canonical_headers,
                                   signed_headers,
                                   'UNSIGNED-PAYLOAD'])

    canonical_request_hash = hashlib.sha256(
        canonical_request.encode()).hexdigest()

    string_to_sign = '\n'.join(['GOOG4-RSA-SHA256',
                                request_timestamp,
                                credential_scope,
                                canonical_request_hash])

    # signer.sign() signs using RSA-SHA256 with PKCS1v15 padding
    signature = binascii.hexlify(
        google_credentials.signer.sign(string_to_sign)
    ).decode()

    scheme_and_host = '{}://{}'.format('https', host)
    signed_url = '{}{}?{}&x-goog-signature={}'.format(
        scheme_and_host, canonical_uri, canonical_query_string, signature)

    return signed_url

