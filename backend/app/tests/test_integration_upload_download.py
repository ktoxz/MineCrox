from __future__ import annotations

import io
import zipfile


def _resource_pack_zip_bytes() -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("pack.mcmeta", "{}")
        z.writestr("assets/minecraft/lang/en_us.json", "{}")
    return buf.getvalue()


async def test_upload_then_download_then_delete(client) -> None:
    zip_bytes = _resource_pack_zip_bytes()

    files = {
        "upload": ("cool-pack.zip", zip_bytes, "application/zip"),
    }
    data = {
        # minimal form: only the file is required
    }

    r = await client.post("/api/v1/uploads", files=files, data=data)
    assert r.status_code == 200, r.text
    payload = r.json()
    assert payload["slug"]
    assert payload["landing_page_url"].endswith(f"/files/{payload['slug']}")
    assert payload["delete_token"]
    assert payload.get("resource_pack") is not None

    slug = payload["slug"]
    delete_token = payload["delete_token"]

    r2 = await client.get(f"/api/v1/files/{slug}")
    assert r2.status_code == 200
    file_public = r2.json()
    assert file_public["file_type"] == "resource_pack"
    assert file_public["download_count"] == 0

    r3 = await client.get(f"/api/v1/download/{slug}", follow_redirects=False)
    assert r3.status_code == 302
    assert r3.headers["location"].startswith("https://cdn.test.local/")

    # Public stable download route
    r3b = await client.get(f"/download/{slug}", follow_redirects=False)
    assert r3b.status_code == 302

    r4 = await client.get(f"/api/v1/files/{slug}")
    assert r4.status_code == 200
    assert r4.json()["download_count"] == 2

    r5 = await client.get(f"/api/v1/analytics/files/{slug}")
    assert r5.status_code == 200
    analytics = r5.json()
    assert analytics["slug"] == slug
    assert analytics["download_count"] == 2

    r6 = await client.delete(
        f"/api/v1/files/{slug}",
        headers={"X-Delete-Token": delete_token},
    )
    assert r6.status_code == 204

    r7 = await client.get(f"/api/v1/files/{slug}")
    assert r7.status_code == 404
