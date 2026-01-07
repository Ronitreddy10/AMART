# CRITICAL: Load environment variables BEFORE any other imports
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.victim_agent import router as victim_router
    from backend.attacker_agent import router as attacker_router
    from backend.judge_agent import router as judge_router
except ImportError:
    from victim_agent import router as victim_router
    from attacker_agent import router as attacker_router
    from judge_agent import router as judge_router

app = FastAPI(title="AMART-RAG Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5175"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(victim_router)
app.include_router(attacker_router)
app.include_router(judge_router)

@app.get("/")
async def root():
    return {"message": "AMART-RAG Backend Online", "status": "secure"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
