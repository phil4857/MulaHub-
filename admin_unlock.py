from fastapi import FastAPI, HTTPException, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import bcrypt

app = FastAPI()

# Allow CORS from Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jipate-bonus-v1-bcti.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated database
users = {
    "admin": {
        "username": "admin",
        "password_hash": bcrypt.hashpw("adminpass".encode(), bcrypt.gensalt()).decode(),
        "approved": True,
        "role": "admin"
    },
    # You can add more users here if needed
}

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/admin/login")
def admin_login(data: LoginRequest):
    user = users.get(data.username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Incorrect password")

    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "message": "Admin login successful",
        "username": data.username,
        "role": "admin",
        "access": "granted"
    }
