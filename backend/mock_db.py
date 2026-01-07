import os
import math
from typing import List, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv
import weaviate
from weaviate.classes.init import Auth
from weaviate.classes.config import Configure, Property, DataType

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class HybridDB:
    def __init__(self):
        self.use_weaviate = False
        self.client = None
        self.local_data = []  # Fallback
        
        # Try Weaviate Connection
        w_url = os.getenv("WEAVIATE_URL")
        w_key = os.getenv("WEAVIATE_API_KEY")
        
        if w_url and w_key:
            try:
                self.client = weaviate.connect_to_weaviate_cloud(
                    cluster_url=w_url,
                    auth_credentials=Auth.api_key(w_key)
                )
                self.use_weaviate = True
                print("[VectorDB] Connected to Weaviate Cloud.")
                self._init_schema()
            except Exception as e:
                print(f"[VectorDB] Weaviate Connection Failed: {e}. Using Mock Mode.")
        else:
            print("[VectorDB] No Weaviate Init found. Using Mock Mode.")

    def _init_schema(self):
        if not self.use_weaviate: return
        
        try:
            # Create Schema if not exists
            if not self.client.collections.exists("Document"):
                self.client.collections.create(
                    name="Document",
                    vectorizer_config=Configure.Vectorizer.none(), # We use Gemini vectors
                    properties=[
                        Property(name="content", data_type=DataType.TEXT),
                        Property(name="tenant", data_type=DataType.TEXT),
                        Property(name="title", data_type=DataType.TEXT),
                    ]
                )
                print("[VectorDB] Created 'Document' collection.")
        except Exception as e:
            print(f"[VectorDB] Schema Init Error: {e}")

    def add_document(self, content: str, tenant: str, metadata: Dict = {}):
        # 1. Generate Vector
        vector = [0.0] * 768
        if api_key:
            try:
                result = genai.embed_content(
                    model="models/embedding-001",
                    content=content,
                    task_type="retrieval_document",
                    title=metadata.get("title", "")
                )
                vector = result['embedding']
            except Exception as e:
                print(f"[VectorDB] Embedding Error: {e}")

        # 2. Store
        if self.use_weaviate:
            try:
                collection = self.client.collections.get("Document")
                # Check for existing to avoid duplicates in this demo (naive check)
                # Actually, specialized red-team DBs usually just append.
                collection.data.insert(
                    properties={
                        "content": content,
                        "tenant": tenant,
                        "title": metadata.get("title", "")
                    },
                    vector=vector
                )
                print(f"[VectorDB] Pushed to Weaviate: {metadata.get('title')}")
            except Exception as e:
                print(f"[VectorDB] Insert Error: {e}")
        else:
            # Local Mock
            doc = {
                "id": len(self.local_data),
                "vector": vector,
                "content": content,
                "tenant": tenant,
                "metadata": metadata
            }
            self.local_data.append(doc)
            print(f"[MockDB] Added to memory: {metadata.get('title')}")

    def query(self, query_text: str, tenant: str = None, top_k: int = 3, threshold: float = 0.0):
        # 1. Embed Query
        vector = [0.0] * 768
        if api_key:
            try:
                result = genai.embed_content(
                    model="models/embedding-001",
                    content=query_text,
                    task_type="retrieval_query"
                )
                vector = result['embedding']
            except Exception as e:
                print(f"[VectorDB] Query Embedding Error: {e}")
                return []
        
        # 2. Search
        # VULNERABILITY: We perform a search WITHOUT filtering by tenant,
        # or we rely purely on vector similarity. If a prompt is semantically 
        # close to HR data, we return it regardless of user's tenant.
        
        if self.use_weaviate:
            try:
                collection = self.client.collections.get("Document")
                # Semantic Search
                response = collection.query.near_vector(
                    near_vector=vector,
                    limit=top_k,
                    return_metadata=["distance", "score"]
                    # NO TENANT FILTER HERE -> This is the vulnerability
                )
                
                results = []
                for obj in response.objects:
                    # distance is 0..2 (cosine). Score? Weaviate returns distance.
                    # Convert distance to similarity roughly (1 - distance/2) or just use distance.
                    # Weaviate certainty = 1 - distance/2.
                    results.append({
                        "content": obj.properties["content"],
                        "tenant": obj.properties["tenant"],
                        "metadata": {"title": obj.properties["title"]},
                        "score": 1.0 # Placeholder or calculate from distance
                    })
                return results
            except Exception as e:
                print(f"[VectorDB] Search Error: {e}")
                return []
        else:
            # Local Mock Logic
            results = []
            for doc in self.local_data:
                score = self._cosine_similarity(vector, doc['vector'])
                if score >= threshold:
                    results.append({**doc, "score": score})
            results.sort(key=lambda x: x['score'], reverse=True)
            return results[:top_k]

    def _cosine_similarity(self, v1, v2):
        dot_product = sum(a*b for a,b in zip(v1, v2))
        magnitude_v1 = math.sqrt(sum(a*a for a in v1))
        magnitude_v2 = math.sqrt(sum(b*b for b in v2))
        if magnitude_v1 == 0 or magnitude_v2 == 0: return 0.0
        return dot_product / (magnitude_v1 * magnitude_v2)

# Global instance
db = HybridDB()
