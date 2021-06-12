import os
from typing import Optional
from datetime import datetime, timedelta
from azure.storage.blob import BlobProperties, BlobServiceClient, BlobClient
from azure.storage.blob import BlobSasPermissions, generate_blob_sas
from src.settings import AZURE_CONNECTION_STRING, AZURE_CONTAINER_NAME

import logging

logger = logging.getLogger(__name__)


def upload_file(file_name: str, data: bytes) -> Optional[str]:
    if os.environ.get("MOCK_GEDCOM_UPLOAD_RESULT") is not None:
        return os.environ.get("MOCK_GEDCOM_UPLOAD_RESULT")

    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
        blob: BlobClient = blob_service_client \
            .get_container_client(AZURE_CONTAINER_NAME) \
            .upload_blob(BlobProperties(name=file_name, blob_type="BlockBlob"), data)
        sas_token = generate_blob_sas(
            blob_service_client.account_name,
            AZURE_CONTAINER_NAME,
            file_name,
            account_key=blob_service_client.credential.account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.utcnow() + timedelta(hours=1))

        return blob.url + "?" + sas_token
    except Exception as e:
        logger.exception("Failed to upload to Azure storage: {}".format(e))
        return None
