import time
import base64
import json

SECRET_KEY = "pragma_secret_key_governance_platform_2026"

def create_access_token(data: dict, expires_delta: int = 86400) -> str:
    payload = data.copy()
    payload["exp"] = int(time.time()) + expires_delta
    payload_str = json.dumps(payload)
    encoded = base64.b64encode(payload_str.encode('utf-8')).decode('utf-8')
    return f"bearer.{encoded}"

def decode_access_token(token: str) -> dict:
    try:
        if token.startswith("bearer."):
            token = token.split(".")[1]
        decoded_bytes = base64.b64decode(token)
        return json.loads(decoded_bytes.decode('utf-8'))
    except Exception:
        return {}
