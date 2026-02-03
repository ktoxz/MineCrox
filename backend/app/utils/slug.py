from __future__ import annotations

import re
import secrets
import string


_slug_re = re.compile(r"[^a-z0-9]+")


def make_slug_base(filename: str) -> str:
    base = filename.rsplit(".", 1)[0].lower()
    base = _slug_re.sub("-", base).strip("-")
    return base or "file"


_SLUG_ALPHABET = string.ascii_lowercase + string.digits


def generate_random_slug(length: int = 16) -> str:
    # 16 chars of base36 ~= 82.7 bits of entropy.
    if length < 8:
        raise ValueError("length must be >= 8")
    return "".join(secrets.choice(_SLUG_ALPHABET) for _ in range(length))
