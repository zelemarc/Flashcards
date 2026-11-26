import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import User, get_db

KEY_FILE = Path(os.getenv("SECRET_KEY_FILE", Path(__file__).parent / ".secret_key"))


def load_secret_key() -> str:
    key = os.getenv("SECRET_KEY")
    if key:
        return key
    if not KEY_FILE.exists():
        KEY_FILE.write_text(secrets.token_hex(32))
    return KEY_FILE.read_text().strip()


SECRET_KEY = load_secret_key()

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()


class Credentials(BaseModel):
    email: str
    password: str


class ChangePassword(BaseModel):
    old_password: str
    new_password: str


class DeleteAccount(BaseModel):
    password: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def make_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(401, "nieprawidlowy token")
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(401, "nieprawidlowy token")
    return user


@router.post("/register")
def register(body: Credentials, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(409, "email zajety")
    user = User(email=email, password=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": make_token(user.id)}


@router.post("/login")
def login(body: Credentials, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=body.email.strip().lower()).first()
    if user is None or not bcrypt.checkpw(body.password.encode(), user.password.encode()):
        raise HTTPException(401, "nieprawidlowy email lub haslo")
    return {"access_token": make_token(user.id)}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email}


@router.post("/change-password")
def change_password(
    body: ChangePassword,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not bcrypt.checkpw(body.old_password.encode(), user.password.encode()):
        raise HTTPException(401, "stare haslo jest nieprawidlowe")
    user.password = hash_password(body.new_password)
    db.commit()
    return {"ok": True}


@router.delete("/me")
def delete_account(
    body: DeleteAccount,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not bcrypt.checkpw(body.password.encode(), user.password.encode()):
        raise HTTPException(401, "haslo jest nieprawidlowe")
    db.delete(user)
    db.commit()
    return {"ok": True}
