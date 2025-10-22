# backend/services/images.py
import os
import base64
import httpx
from dotenv import load_dotenv
load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
IMAGES_API_URL = "https://api.openai.com/v1/images/generations"

async def generate_image(prompt: str, out_dir: str = "./static/images", size: str = "1024x1024"):
    os.makedirs(out_dir, exist_ok=True)
    if not OPENAI_KEY:
        raise RuntimeError("OPENAI_API_KEY not set")
    headers = {"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-image-1", "prompt": prompt, "size": size}
    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post(IMAGES_API_URL, json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        # support base64 payload
        if "data" in data and len(data["data"])>0:
            entry = data["data"][0]
            if "b64_json" in entry:
                b64 = entry["b64_json"]
                img_bytes = base64.b64decode(b64)
                fname = f"img_{os.urandom(6).hex()}.png"
                fpath = os.path.join(out_dir, fname)
                with open(fpath, "wb") as fh:
                    fh.write(img_bytes)
                return fpath
            if "url" in entry:
                img_url = entry["url"]
                resp = await client.get(img_url)
                fname = f"img_{os.urandom(6).hex()}.png"
                fpath = os.path.join(out_dir, fname)
                with open(fpath, "wb") as fh:
                    fh.write(resp.content)
                return fpath
        raise RuntimeError("Unexpected image generation response")
