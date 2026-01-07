"""
Test Groq API Connection
Run: python test_groq.py
"""
from dotenv import load_dotenv
load_dotenv()

import os
from groq import Groq

key = os.getenv("GROQ_API_KEY")
print(f"[1] GROQ_API_KEY: {'Found (' + key[:15] + '...)' if key else 'NOT FOUND!'}")

if not key:
    print("[ERROR] No GROQ_API_KEY in .env file!")
    exit(1)

try:
    client = Groq(api_key=key)
    print("[2] Groq client created successfully")
    
    print("[3] Making test API call...")
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Say 'Hello' and nothing else"}],
        max_tokens=10,
        timeout=30
    )
    
    print(f"[4] Response: {response.choices[0].message.content}")
    print("\n✅ GROQ API IS WORKING!")
    
except Exception as e:
    print(f"[ERROR] Groq API failed: {e}")
