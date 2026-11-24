from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Answer, Card, Folder, User, get_db
from folders import get_own_folder, subtree
from scheduler import apply_answer

router = APIRouter(tags=["cards"])


class CardIn(BaseModel):
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)
    type: str = "basic"


class AnswerIn(BaseModel):
    rating: int = Field(ge=-1, le=3)  # -1 forgot, 0 bad, 1 again, 2 good, 3 easy
    time_spent_ms: int = Field(default=0, ge=0)


class FavouriteIn(BaseModel):
    favourite: bool


class CardPatch(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    type: Optional[str] = None
    folder_id: Optional[int] = None


class ResetIn(BaseModel):
    delete_history: bool = False


def get_own_card(db: Session, card_id: int, user: User) -> Card:
    card = db.get(Card, card_id)
    if card is None or card.folder.user_id != user.id:
        raise HTTPException(404, "nie znaleziono fiszki")
    return card


def card_to_dict(c: Card) -> dict:
    """kształt z card.ts"""
    history = sorted(c.answers, key=lambda a: a.date)
    return {
        "id": str(c.id),
        "type": c.type,
        "question": {"text": c.question, "img": c.question_img},
        "answer": {"text": c.answer, "img": c.answer_img},
        "favourite": c.favourite,
        "state": c.state,
        "due_date": c.due_date.isoformat() if c.due_date else None,
        "answerHistory": [
            {
                "date": a.date.isoformat(),
                "answer": a.rating,
                "timeSpentAnswaring": a.time_spent_ms, 
            }
            for a in history
        ],
    }



def card_to_dict_reversed(c: Card) -> dict:
    """to samo co card_to_dict, ale strony zamienione"""
    d = card_to_dict(c)
    d["question"], d["answer"] = d["answer"], d["question"]
    d["reversed"] = True
    return d


@router.post("/folders/{folder_id}/cards", status_code=201)
def create_card(
    folder_id: int,
    body: CardIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    folder = get_own_folder(db, folder_id, user)
    card = Card(folder=folder, type=body.type, question=body.question, answer=body.answer)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card_to_dict(card)


@router.get("/folders/{folder_id}/cards")
def list_cards(
    folder_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    folder = get_own_folder(db, folder_id, user)
    return [card_to_dict(c) for c in folder.cards]


@router.delete("/cards/{card_id}")
def delete_card(
    card_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = get_own_card(db, card_id, user)
    db.delete(card)
    db.commit()
    return {"ok": True}



@router.get("/cards/favourites")
def list_favourites(
    folder_id: Optional[int] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """fav fiszki"""
    query = (
        db.query(Card)
        .join(Folder, Card.folder_id == Folder.id)
        .filter(Folder.user_id == user.id, Card.favourite.is_(True))
    )
    if folder_id is not None:
        folder = get_own_folder(db, folder_id, user)
        query = query.filter(Card.folder_id.in_([f.id for f in subtree(folder)]))
    return [card_to_dict(c) for c in query.all()]


@router.put("/cards/{card_id}/favourite")
def set_favourite(
    card_id: int,
    body: FavouriteIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = get_own_card(db, card_id, user)
    card.favourite = body.favourite
    db.commit()
    return {"id": str(card.id), "favourite": card.favourite}


@router.get("/cards/{card_id}")
def get_card(
    card_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return card_to_dict(get_own_card(db, card_id, user))


@router.patch("/cards/{card_id}")
def update_card(
    card_id: int,
    body: CardPatch,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """edycja fiszki (tresc, typ, przeniesienie do innego folderu)"""
    card = get_own_card(db, card_id, user)
    if body.question is not None:
        if not body.question.strip():
            raise HTTPException(422, "pytanie nie moze byc puste")
        card.question = body.question
    if body.answer is not None:
        if not body.answer.strip():
            raise HTTPException(422, "odpowiedz nie moze byc pusta")
        card.answer = body.answer
    if body.type is not None:
        card.type = body.type
    if body.folder_id is not None:
        card.folder = get_own_folder(db, body.folder_id, user)
    db.commit()
    db.refresh(card)
    return card_to_dict(card)


#learning
@router.get("/folders/{folder_id}/next-card")
def next_card(
    folder_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Następna fiszka do nauki Kolejność: learn po terminie, review po terminie, potem nowe."""
    folder = get_own_folder(db, folder_id, user)
    cards = [c for f in subtree(folder) for c in f.cards]
    now = datetime.now()

    learn = [c for c in cards if c.state == "learn" and c.due_date and c.due_date <= now]
    review = [c for c in cards if c.state == "review" and c.due_date and c.due_date <= now]
    new = [c for c in cards if c.state == "new"]

    for group in (learn, review):
        if group:
            return card_to_dict(min(group, key=lambda c: c.due_date))
    if new:
        return card_to_dict(min(new, key=lambda c: c.id))
    return None


def pick_next_card(cards: list) -> Optional[Card]:
    """wybiera nastepna fiszke z listy: learn, review po terminie, potem nowe"""
    now = datetime.now()

    learn = [c for c in cards if c.state == "learn" and c.due_date and c.due_date <= now]
    review = [c for c in cards if c.state == "review" and c.due_date and c.due_date <= now]
    new = [c for c in cards if c.state == "new"]

    for group in (learn, review):
        if group:
            return min(group, key=lambda c: c.due_date)
    if new:
        return min(new, key=lambda c: c.id)
    return None


@router.get("/folders/{folder_id}/next-card/reverse")
def next_card_reverse(
    folder_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """nauka na odwrot"""
    folder = get_own_folder(db, folder_id, user)
    card = pick_next_card([c for f in subtree(folder) for c in f.cards])
    return card_to_dict_reversed(card) if card else None


def favourite_cards(db: Session, user: User, folder_id: Optional[int]) -> list:
    query = (
        db.query(Card)
        .join(Folder, Card.folder_id == Folder.id)
        .filter(Folder.user_id == user.id, Card.favourite.is_(True))
    )
    if folder_id is not None:
        folder = get_own_folder(db, folder_id, user)
        query = query.filter(Card.folder_id.in_([f.id for f in subtree(folder)]))
    return query.all()


@router.get("/cards/favourites/next-card")
def next_favourite_card(
    folder_id: Optional[int] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """nauka tylko z ulubionych"""
    card = pick_next_card(favourite_cards(db, user, folder_id))
    return card_to_dict(card) if card else None


@router.get("/cards/favourites/next-card/reverse")
def next_favourite_card_reverse(
    folder_id: Optional[int] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """nauka tylko z ulubionych (na odwrot)"""
    card = pick_next_card(favourite_cards(db, user, folder_id))
    return card_to_dict_reversed(card) if card else None


@router.post("/folders/{folder_id}/reset")
def reset_progress(
    folder_id: int,
    body: Optional[ResetIn] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """reset postepu w folderze i podfolderach"""
    folder = get_own_folder(db, folder_id, user)
    cards = [c for f in subtree(folder) for c in f.cards]
    for c in cards:
        c.state = "new"
        c.due_date = None
        c.interval_days = 0
        c.ease = 2.5
    if body is not None and body.delete_history and cards:
        db.query(Answer).filter(Answer.card_id.in_([c.id for c in cards])).delete(
            synchronize_session=False
        )
    db.commit()
    return {"reset": len(cards)}


@router.post("/cards/{card_id}/answers")
def answer_card(
    card_id: int,
    body: AnswerIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """zapisuje ocene (-1 <> 3)"""
    card = get_own_card(db, card_id, user)
    db.add(Answer(card_id=card.id, rating=body.rating, time_spent_ms=body.time_spent_ms))
    apply_answer(card, body.rating)
    db.commit()
    return {
        "state": card.state,
        "due_date": card.due_date.isoformat() if card.due_date else None,
        "interval_days": card.interval_days,
        "ease": card.ease,
    }
