from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="AXIVAI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AXIVAI API is running", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "AXIVAI Backend"}

@app.post("/api/auth/login")
async def login(credentials: dict):
    # Simple demo login
    if credentials.get("email") == "test@example.com" and credentials.get("password") == "testpassword":
        return {"access_token": "demo-token", "token_type": "bearer", "user": {"email": "test@example.com"}}
    return {"error": "Invalid credentials"}

@app.get("/api/user/profile")
async def get_profile():
    return {"email": "test@example.com", "name": "Demo User"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)