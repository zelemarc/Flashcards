from datetime import datetime
from typing import Optional

from sqlalchemy import (
    create_engine,
    ForeignKey,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    event,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
    sessionmaker,
)

DATABASE_URL = "sqlite:///./flashcards.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def enable_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255))

    folders: Mapped[list["Folder"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Folder(Base):
    __tablename__ = "folders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("folders.id"), nullable=True
    )
    public: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship(back_populates="folders")
    parent: Mapped[Optional["Folder"]] = relationship(
        back_populates="subfolders",
        remote_side="Folder.id",
    )
    subfolders: Mapped[list["Folder"]] = relationship(
        back_populates="parent",
        cascade="all, delete-orphan",
    )
    cards: Mapped[list["Card"]] = relationship(
        back_populates="folder",
        cascade="all, delete-orphan",
    )


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    folder_id: Mapped[int] = mapped_column(ForeignKey("folders.id"))
    type: Mapped[str] = mapped_column(String(20), default="basic")
    question: Mapped[str] = mapped_column(String)
    answer: Mapped[str] = mapped_column(String)
    question_img: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    answer_img: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # reviews
    state: Mapped[str] = mapped_column(String(10), default="new")  #new / learn / review
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    interval_days: Mapped[int] = mapped_column(Integer, default=0)
    ease: Mapped[float] = mapped_column(Float, default=2.5)

    folder: Mapped["Folder"] = relationship(back_populates="cards")
    answers: Mapped[list["Answer"]] = relationship(
        back_populates="card",
        cascade="all, delete-orphan",
    )


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"))
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    rating: Mapped[int] = mapped_column(Integer)
    time_spent_ms: Mapped[int] = mapped_column(Integer, default=0)

    card: Mapped["Card"] = relationship(back_populates="answers")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)