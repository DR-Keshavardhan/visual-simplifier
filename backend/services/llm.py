# backend/services/llm.py
import os
import httpx
from dotenv import load_dotenv
load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions"

async def call_chatgpt(system_prompt: str, user_prompt: str, model: str = "gpt-4o-mini", temperature: float = 0.2, max_tokens: int = 800):
    if not OPENAI_KEY:
        raise RuntimeError("OPENAI_API_KEY not set in environment")
    headers = {"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(CHAT_COMPLETIONS_URL, json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]
