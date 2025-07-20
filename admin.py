from fastapi import APIRouter, HTTPException, Form
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Dict
import json
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS_FILE = "users.json"
INVESTMENTS_FILE = "investments.json"

def read_data(filename):
    if not os.path.exists(filename):
        return {}
    with open(filename, "r") as f:
        return json.load(f)

def write_data(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

@router.get("/admin/view_users")
def view_users():
    users = read_data(USERS_FILE)
    return users

@router.get("/admin/view_investments")
def view_investments():
    return read_data(INVESTMENTS_FILE)

@router.post("/admin/approve_user")
def approve_user(username: str = Form(...), admin_password: str = Form(...)):
    users = read_data(USERS_FILE)
    admin = users.get("admin")

    if not admin or not pwd_context.verify(admin_password, admin["password_hash"]):
        raise HTTPException(status_code=403, detail="Unauthorized access")

    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")

    users[username]["approved"] = True
    write_data(USERS_FILE, users)
    return {"message": f"User '{username}' approved successfully"}
