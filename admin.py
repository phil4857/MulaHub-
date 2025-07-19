from fastapi import APIRouter, HTTPException, Form
from passlib.hash import bcrypt
from typing import Dict
import json
import os

admin_router = APIRouter()

# Path to user data file (you can change this path)
USER_DATA_FILE = "users.json"

# Dummy admin credentials (you can update this securely later)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = bcrypt.hash("admin123")  # Password is admin123

def load_users() -> Dict:
    if not os.path.exists(USER_DATA_FILE):
        return {}
    with open(USER_DATA_FILE, "r") as f:
        return json.load(f)

@admin_router.post("/admin/login")
def admin_login(username: str = Form(...), password: str = Form(...)):
    if username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid admin username")
    if not bcrypt.verify(password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid admin password")
    return {"message": "Admin logged in successfully"}

@admin_router.get("/admin/view_users")
def view_users():
    users = load_users()
    return users

@admin_router.post("/admin/approve_user")
def approve_user(username: str = Form(...)):
    users = load_users()
    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")
    users[username]["approved"] = True
    with open(USER_DATA_FILE, "w") as f:
        json.dump(users, f)
    return {"message": f"User {username} approved successfully"}
