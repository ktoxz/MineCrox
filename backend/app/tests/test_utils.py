from __future__ import annotations

import io
import zipfile

import pytest

from app.utils.files import allowed_extension, detect_zip_file_type
from app.utils.slug import generate_random_slug, make_slug_base


def test_allowed_extension_whitelist() -> None:
    assert allowed_extension("a.zip")
    assert not allowed_extension("a.json")
    assert not allowed_extension("a.toml")
    assert not allowed_extension("a.yml")
    assert not allowed_extension("a.cfg")

    assert not allowed_extension("a.exe")
    assert not allowed_extension("a.png")


def test_slug_generation() -> None:
    assert make_slug_base("My Pack.zip") == "my-pack"
    assert make_slug_base("---.zip") == "file"

    slug = generate_random_slug(16)
    assert len(slug) == 16
    assert slug.isalnum()
    assert slug == slug.lower()


def _zip_bytes(entries: dict[str, str]) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for name, content in entries.items():
            z.writestr(name, content)
    return buf.getvalue()


def test_detect_resource_pack(tmp_path) -> None:
    p = tmp_path / "rp.zip"
    p.write_bytes(
        _zip_bytes(
            {
                "pack.mcmeta": "{}",
                "assets/minecraft/textures/test.txt": "x",
            }
        )
    )
    assert detect_zip_file_type(str(p)) == "resource_pack"


def test_detect_datapack(tmp_path) -> None:
    p = tmp_path / "dp.zip"
    p.write_bytes(
        _zip_bytes(
            {
                "pack.mcmeta": "{}",
                "data/minecraft/tags/functions/load.json": "{}",
            }
        )
    )
    assert detect_zip_file_type(str(p)) == "datapack"


def test_reject_executable_in_zip(tmp_path) -> None:
    p = tmp_path / "bad.zip"
    p.write_bytes(
        _zip_bytes(
            {
                "pack.mcmeta": "{}",
                "assets/a.exe": "x",
            }
        )
    )
    with pytest.raises(Exception):
        detect_zip_file_type(str(p))
