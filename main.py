from fastapi import FastAPI, Form, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict
from hashlib import sha256

app = FastAPI()

# In-memory databases
users: Dict[str, dict] = {}
investments: Dict[str, dict] = {}
login_attempts: Dict[str, int] = {}
blocked_users: Dict[str, datetime] = {}

MPESA_NUMBER = "0737734533"

class User(BaseModel):
    username: str
    password_hash: str
    approved: bool = False
    referral: str = None
    referred_users: list = []
    balance: float = 0.0
    earnings: float = 0.0

class Investment(BaseModel):
    username: str
    amount: float
    transaction_ref: str
    approved: bool = False
    timestamp: datetime
    last_earning_time: datetime = None

def hash_password(password: str) -> str:
    return sha256(password.encode()).hexdigest()

def is_sunday():
    return datetime.utcnow().strftime("%A") == "Sunday"

def user_blocked(username: str) -> bool:
    if username in blocked_users:
        if datetime.utcnow() < blocked_users[username]:
            return True
        else:
            del blocked_users[username]
    return False

@app.get("/")
def root():
    return {"message": "Welcome to Jipate Bonus Investment Platform"}

@app.post("/register")
def register(username: str = Form(...), password: str = Form(...), referral: str = Form(None)):
    if username in users:
        raise HTTPException(status_code=400, detail="Username already exists")
    password_hash = hash_password(password)
    user = User(username=username, password_hash=password_hash, referral=referral)
    users[username] = user.dict()
    if referral and referral in users:
        users[referral]["referred_users"].append(username)
    return {"message": "User registered successfully. Await admin approval."}

@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")

    if user_blocked(username):
        raise HTTPException(status_code=403, detail="Account blocked. Contact admin to reset.")

    if users[username]["password_hash"] != hash_password(password):
        login_attempts[username] = login_attempts.get(username, 0) + 1
        if login_attempts[username] >= 3:
            blocked_users[username] = datetime.utcnow() + timedelta(hours=24)
            raise HTTPException(status_code=403, detail="Too many failed attempts. Account blocked.")
        raise HTTPException(status_code=401, detail="Invalid password")
    
    if not users[username]["approved"]:
        raise HTTPException(status_code=403, detail="Account pending admin approval")
    
    login_attempts[username] = 0
    return {"message": f"Welcome {username}, login successful."}

@app.post("/invest")
def invest(username: str = Form(...), amount: float = Form(...), transaction_ref: str = Form(...)):
    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")
    if not users[username]["approved"]:
        raise HTTPException(status_code=403, detail="User not approved")

    if username in investments and not investments[username]["approved"]:
        raise HTTPException(status_code=400, detail="Previous investment pending approval")

    if is_sunday():
        amount *= 0.95  # 5% discount

    investment = Investment(
        username=username,
        amount=amount,
        transaction_ref=transaction_ref,
        timestamp=datetime.utcnow(),
        last_earning_time=datetime.utcnow()
    )
    investments[username] = investment.dict()

    return {
        "message": "Investment submitted successfully. Await admin approval.",
        "mpesa": f"Send payment to MPESA number: {MPESA_NUMBER}",
        "note": "Use your transaction reference for approval."
    }

@app.post("/withdraw")
def withdraw(username: str = Form(...), amount: float = Form(...)):
    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")

    if users[username]["balance"] < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    users[username]["balance"] -= amount
    return {
        "message": f"{amount} withdrawn successfully. Manual confirmation will be sent.",
        "note": f"Admin will confirm your withdrawal shortly via {MPESA_NUMBER}"
    }

@app.post("/admin/approve_user")
def approve_user(username: str = Form(...)):
    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")
    users[username]["approved"] = True
    return {"message": f"{username} approved"}

@app.post("/admin/reset_login")
def reset_login(username: str = Form(...)):
    blocked_users.pop(username, None)
    login_attempts[username] = 0
    return {"message": f"{username}'s login reset"}

@app.post("/admin/approve_investment")
def approve_investment(username: str = Form(...)):
    if username not in investments:
        raise HTTPException(status_code=404, detail="No investment found")
    if investments[username]["approved"]:
        return {"message": "Already approved"}

    investments[username]["approved"] = True
    amount = investments[username]["amount"]
    users[username]["balance"] += amount

    referrer = users[username].get("referral")
    if referrer and referrer in users:
        bonus = amount * 0.05
        users[referrer]["balance"] += bonus

    return {"message": f"{username}'s investment approved"}

@app.post("/earnings/daily")
def daily_earnings():
    now = datetime.utcnow()
    updated = 0
    for username, inv in investments.items():
        if inv["approved"]:
            last_time = inv.get("last_earning_time")
            if last_time is None or (now - datetime.fromisoformat(str(last_time))).total_seconds() >= 86400:
                earning = inv["amount"] * 0.10
                users[username]["earnings"] += earning
                users[username]["balance"] += earning
                investments[username]["last_earning_time"] = now
                updated += 1
    return {"message": f"Daily earnings added for {updated} users"}

@app.get("/admin/view_users")
def view_users():
    return users

@app.get("/admin/view_investments")
def view_investments():
    return investments
