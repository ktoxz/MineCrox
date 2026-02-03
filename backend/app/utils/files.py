from __future__ import annotations

import hashlib
import os
import zipfile

from fastapi import HTTPException


ALLOWED_EXTENSIONS = {".zip"}

BLOCKED_IN_ZIP_EXTENSIONS = {
    ".exe",
    ".dll",
    ".bat",
    ".cmd",
    ".ps1",
    ".sh",
    ".jar",
    ".msi",
}


def allowed_extension(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def sha1_of_file(path: str) -> str:
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def detect_zip_file_type(path: str) -> str:
    try:
        with zipfile.ZipFile(path, "r") as z:
            names = z.namelist()
    except zipfile.BadZipFile as e:
        raise HTTPException(status_code=400, detail="Invalid zip file") from e

    norm = [_normalize_zip_name(n) for n in names]
    _validate_zip_safe(norm)

    has_pack_mcmeta = any(n.endswith("pack.mcmeta") for n in norm)
    has_data = any(n.startswith("data/") for n in norm)
    has_assets = any(n.startswith("assets/") for n in norm)

    # Datapack: pack.mcmeta + data/
    if has_pack_mcmeta and has_data:
        return "datapack"

    # Resource pack: pack.mcmeta + assets/
    if has_pack_mcmeta and has_assets:
        return "resource_pack"

    raise HTTPException(status_code=400, detail="Zip must be a resource pack or datapack")


def _normalize_zip_name(name: str) -> str:
    # Normalize slashes and remove any leading slashes.
    name = name.replace("\\", "/").lstrip("/")
    return name


def _validate_zip_safe(names: list[str]) -> None:
    for n in names:
        # Block absolute paths, drive letters, traversal.
        if not n:
            continue
        if n.startswith("/"):
            raise HTTPException(status_code=400, detail="Unsafe zip entry")
        if ":" in n.split("/")[0]:
            raise HTTPException(status_code=400, detail="Unsafe zip entry")
        if ".." in n.split("/"):
            raise HTTPException(status_code=400, detail="Unsafe zip entry")

        _, ext = os.path.splitext(n.lower())
        if ext in BLOCKED_IN_ZIP_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Zip contains blocked executable content")
