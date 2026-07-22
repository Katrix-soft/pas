import hashlib

def hash_password(password: str) -> str:
    """Hash password with sha256 + salt for simple, robust auth"""
    salt = "katrix_pas_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> boolean if False else bool:
    return hash_password(plain_password) == hashed_password
