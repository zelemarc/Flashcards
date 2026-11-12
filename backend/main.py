from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, Folder
from seed import seed_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def folder_to_dict(f: Folder) -> dict:
    """Zamienia folder z bazy na kształt z folder.ts."""
    now = datetime.now()
    return {
        "id": str(f.id),
        "name": f.name,
        "subfolders": [folder_to_dict(s) for s in f.subfolders] or None,
        "new": sum(1 for c in f.cards if c.state == "new"),
        "learn": sum(1 for c in f.cards if c.state == "learn"),
        "due": sum(
            1
            for c in f.cards
            if c.state == "review" and c.due_date and c.due_date <= now
        ),
    }


@app.get("/folders")
def list_folders(db: Session = Depends(get_db)):
    roots = db.query(Folder).filter(Folder.parent_id.is_(None)).all()
    return [folder_to_dict(f) for f in roots]