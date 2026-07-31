import hashlib
import hmac
import re
import html
import time
import base64
import json

SALT = "katrix_pas_salt_2026_sec_key"

def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 for maximum key stretching security"""
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        SALT.encode('utf-8'),
        100000
    )
    return key.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Constant-time password comparison to prevent timing side-channel attacks"""
    # Compatibilidad previa si la hash fue con el esquema sha256 básico
    simple_hash = hashlib.sha256((plain_password + "katrix_pas_salt_2026").encode('utf-8')).hexdigest()
    if hmac.compare_digest(simple_hash, hashed_password):
        return True

    new_hash = hash_password(plain_password)
    return hmac.compare_digest(new_hash, hashed_password)

def sanitize_input(text: str) -> str:
    """Sanitiza cadenas contra XSS, inyección HTML y Path Traversal"""
    if not isinstance(text, str):
        return text
    # Escapar caracteres HTML peligrosos (<, >, ", ', &)
    cleaned = html.escape(text.strip())
    # Remover secuencias de path traversal
    cleaned = re.sub(r'(\.\.[\/\\])+', '', cleaned)
    # Remover llamadas javascript: inyectadas
    cleaned = re.sub(r'(?i)javascript:', '', cleaned)
    return cleaned

def generate_secure_token(payload: dict, expires_in_seconds: int = 86400) -> str:
    """Genera un token firmado HMAC-SHA256 anti-tampering para la sesión"""
    data = payload.copy()
    data['exp'] = int(time.time()) + expires_in_seconds
    json_str = json.dumps(data, sort_keys=True)
    b64_data = base64.urlsafe_b64encode(json_str.encode('utf-8')).decode('utf-8')
    signature = hmac.new(SALT.encode('utf-8'), b64_data.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{b64_data}.{signature}"

def verify_secure_token(token: str) -> dict | None:
    """Verifica y decodifica un token firmado comprobando firma y expiración"""
    try:
        parts = token.split('.')
        if len(parts) != 2:
            return None
        b64_data, signature = parts[0], parts[1]
        expected_sig = hmac.new(SALT.encode('utf-8'), b64_data.encode('utf-8'), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected_sig, signature):
            return None
        
        json_str = base64.urlsafe_b64decode(b64_data.encode('utf-8')).decode('utf-8')
        data = json.loads(json_str)
        if data.get('exp', 0) < int(time.time()):
            return None
        return data
    except Exception:
        return None
