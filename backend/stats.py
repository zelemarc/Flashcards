from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Answer, Card, Folder, User, get_db
from folders import get_own_folder, subtree

router = APIRouter(tags=["statistics"])

RATING_NAMES = {-1: "forgot", 0: "bad", 1: "again", 2: "good", 3: "easy"}


@router.get("/statistics")
def statistics(
    days: int = Query(30, ge=1, le=365),
    folder_id: Optional[int] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Card)
        .join(Folder, Card.folder_id == Folder.id)
        .filter(Folder.user_id == user.id)
    )
    if folder_id is not None:
        folder = get_own_folder(db, folder_id, user)
        query = query.filter(Card.folder_id.in_([f.id for f in subtree(folder)]))
    cards = query.all()

    card_ids = [c.id for c in cards]
    answers = db.query(Answer).filter(Answer.card_id.in_(card_ids)).all() if card_ids else []

    now = datetime.now()
    today = date.today()

    cards_stats = {
        "total": len(cards),
        "new": sum(1 for c in cards if c.state == "new"),
        "learn": sum(1 for c in cards if c.state == "learn"),
        "review": sum(1 for c in cards if c.state == "review"),
        "due_now": sum(
            1 for c in cards if c.state in ("learn", "review") and c.due_date and c.due_date <= now
        ),
        "favourites": sum(1 for c in cards if c.favourite),
    }

    total = len(answers)
    correct = sum(1 for a in answers if a.rating >= 2)
    total_time = sum(a.time_spent_ms for a in answers)
    answers_stats = {
        "total": total,
        "today": sum(1 for a in answers if a.date.date() == today),
        "correct": correct,
        "accuracy": round(correct / total, 3) if total else None,
        "total_time_ms": total_time,
        "avg_time_ms": round(total_time / total) if total else None,
    }

    by_rating = {name: 0 for name in RATING_NAMES.values()}
    for a in answers:
        by_rating[RATING_NAMES[a.rating]] += 1

    daily_map = {}
    for a in answers:
        d = a.date.date()
        row = daily_map.setdefault(d, {"answers": 0, "correct": 0, "time_ms": 0})
        row["answers"] += 1
        row["correct"] += 1 if a.rating >= 2 else 0
        row["time_ms"] += a.time_spent_ms
    daily = []
    for i in range(days - 1, -1, -1):
        d = today - timedelta(days=i)
        row = daily_map.get(d, {"answers": 0, "correct": 0, "time_ms": 0})
        daily.append({"date": d.isoformat(), **row})

    #seria dni z nauka
    days_with_answers = {a.date.date() for a in answers}
    cursor = today if today in days_with_answers else today - timedelta(days=1)
    streak = 0
    while cursor in days_with_answers:
        streak += 1
        cursor -= timedelta(days=1)

    return {
        "cards": cards_stats,
        "answers": answers_stats,
        "by_rating": by_rating,
        "daily": daily,
        "streak_days": streak,
    }