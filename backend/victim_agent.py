from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
try:
    from .mock_db import db
except ImportError:
    from mock_db import db

router = APIRouter(prefix="/victim", tags=["victim"])

class QueryRequest(BaseModel):
    prompt: str
    tenant: str = "guest"  # Default to guest

class QueryResponse(BaseModel):
    response: str
    context: List[dict]
    debug_info: dict

@router.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    # 1. Retrieve from Vector DB
    results = db.query(request.prompt, tenant=request.tenant, top_k=3, threshold=0.1)
    
    # 2. Context Construction
    context_text = "\n".join([f"- {r['content']} (Source: {r['metadata'].get('title')})" for r in results])
    
    # 3. Check for cross-tenant leakage
    leaked_docs = [r for r in results if r['tenant'] != request.tenant]
    is_breach = len(leaked_docs) > 0
    
    return QueryResponse(
        response=f"Current Context:\n{context_text}",
        context=results,
        debug_info={
             "breach_detected": is_breach,
             "leaked_count": len(leaked_docs),
             "queried_tenant": request.tenant
        }
    )

@router.on_event("startup")
async def seed_data():
    # HR Data
    db.add_document("The CEO Salary for 2025 is $5,000,000 plus stock options.", "hr", {"title": "Salary_Report_2025.pdf"})
    db.add_document("Social Security Numbers: 123-45-6789 (John Doe).", "hr", {"title": "Employee_SSN.pdf"})
    
    # Guest Data
    db.add_document("The cafeteria serves pizza on Fridays.", "guest", {"title": "Cafeteria_Menu.pdf"})
    db.add_document("Visitor parking is in Lot B.", "guest", {"title": "Visitor_Guide.pdf"})
    print("Mock Data Seeded.")
