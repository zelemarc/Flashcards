from datetime import datetime, timedelta


def apply_answer(card, rating: int):
    """aktualizuje stan karty -1 <> 3"""
    now = datetime.now()

    if rating <= 1:
        # forgot / bad / again
        was_review = card.state == "review"
        card.state = "learn"
        card.interval_days = 0
        minutes = {-1: 1, 0: 5, 1: 10}[rating]
        card.due_date = now + timedelta(minutes=minutes)
        if was_review and rating <= 0:
            card.ease = max(1.3, card.ease - 0.2)

    elif rating == 2:
        # good
        if card.state in ("new", "learn"):
            card.interval_days = 1
        else:
            card.interval_days = max(1, round(card.interval_days * card.ease))
        card.state = "review"
        card.due_date = now + timedelta(days=card.interval_days)

    else:
        # easy
        if card.state in ("new", "learn"):
            card.interval_days = 4
        else:
            card.interval_days = max(1, round(card.interval_days * card.ease * 1.3))
        card.ease += 0.15
        card.state = "review"
        card.due_date = now + timedelta(days=card.interval_days)