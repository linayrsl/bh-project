from src.settings import CLIENT_API_BASE_URL, CLIENT_GOOGLE_ANALYTICS_ID


def client_config():
    config = {}
    if CLIENT_API_BASE_URL is not None:
        config["apiBaseUrl"] = CLIENT_API_BASE_URL
    if CLIENT_GOOGLE_ANALYTICS_ID is not None:
        config["googleAnalyticsId"] = CLIENT_GOOGLE_ANALYTICS_ID
    return config
