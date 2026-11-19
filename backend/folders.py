from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Card, Folder, User, get_db

router = APIRouter(tags=["folders"])


class FolderIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    parent_id: Optional[int] = None


class FolderPatch(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    public: Optional[bool] = None


class CopyIn(BaseModel):
    parent_id: Optional[int] = None


def get_own_folder(db: Session, folder_id: int, user: User) -> Folder:
    folder = db.get(Folder, folder_id)
    if folder is None or folder.user_id != user.id:
        raise HTTPException(404, "nie znaleziono folderu")
    return folder


def subtree(folder: Folder) -> list:
    """folder razem ze wszystkimi podfolderami"""
    result = [folder]
    for sub in folder.subfolders:
        result.extend(subtree(sub))
    return result


def folder_to_dict(f: Folder) -> dict:
    """Kształt z folder.ts"""
    now = datetime.now()
    return {
        "id": str(f.id),
        "name": f.name,
        "public": f.public,
        "subfolders": [folder_to_dict(s) for s in f.subfolders] or None,
        "new": sum(1 for c in f.cards if c.state == "new"),
        "learn": sum(1 for c in f.cards if c.state == "learn"),
        "due": sum(
            1
            for c in f.cards
            if c.state == "review" and c.due_date and c.due_date <= now
        ),
    }


def copy_tree(src: Folder, user: User, parent: Optional[Folder]) -> Folder:
    """kopiuje folder publiczny"""
    new = Folder(name=src.name, user=user, parent=parent, public=False)
    new.cards = [
        Card(
            type=c.type,
            question=c.question,
            answer=c.answer,
            question_img=c.question_img,
            answer_img=c.answer_img,
        )
        for c in src.cards
    ]
    for sub in src.subfolders:
        copy_tree(sub, user, new)
    return new


@router.get("/folders")
def list_folders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roots = (
        db.query(Folder)
        .filter(Folder.user_id == user.id, Folder.parent_id.is_(None))
        .all()
    )
    return [folder_to_dict(f) for f in roots]


@router.get("/folders/public")
def list_public_folders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """wyswietla publiczne foldery"""
    folders = (
        db.query(Folder)
        .filter(Folder.public.is_(True), Folder.user_id != user.id)
        .all()
    )
    top = [f for f in folders if f.parent is None or not f.parent.public]
    return [
        {
            "id": str(f.id),
            "name": f.name,
            "cards_count": sum(len(s.cards) for s in subtree(f)),
        }
        for f in top
    ]


@router.post("/folders", status_code=201)
def create_folder(
    body: FolderIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """dodaje folder"""
    name = body.name.strip()
    if not name:
        raise HTTPException(422, "nazwa folderu nie może być pusta")
    parent = get_own_folder(db, body.parent_id, user) if body.parent_id is not None else None
    folder = Folder(
        name=name,
        user=user,
        parent=parent,
        public=parent.public if parent else False,  # podfolder dziedziczy status od rodzica
    )
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder_to_dict(folder)


@router.patch("/folders/{folder_id}")
def update_folder(
    folder_id: int,
    body: FolderPatch,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """zmiana nazwy albo statusu public"""
    folder = get_own_folder(db, folder_id, user)
    if body.name is not None:
        name = body.name.strip()
        if not name:
            raise HTTPException(422, "nazwa folderu nie może być pusta")
        folder.name = name
    if body.public is not None:
        for f in subtree(folder):
            f.public = body.public
    db.commit()
    db.refresh(folder)
    return folder_to_dict(folder)


@router.delete("/folders/{folder_id}")
def delete_folder(
    folder_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    folder = get_own_folder(db, folder_id, user)
    db.delete(folder)
    db.commit()
    return {"ok": True}


@router.post("/folders/{folder_id}/copy", status_code=201)
def copy_folder(
    folder_id: int,
    body: Optional[CopyIn] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """koopiuje publiczny folder (i sprawdza czy jest publiczny)"""
    src = db.get(Folder, folder_id)
    if src is None or not src.public:
        raise HTTPException(404, "nie znaleziono publicznego folderu")

    parent = None
    if body is not None and body.parent_id is not None:
        parent = get_own_folder(db, body.parent_id, user)

    new = copy_tree(src, user, parent)
    db.add(new)
    db.commit()
    db.refresh(new)
    return folder_to_dict(new)