from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from cards import router as cards_router
from folders import router as folders_router
from seed import seed_db
from stats import router as statistics_router


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

app.include_router(auth_router)
app.include_router(folders_router)
app.include_router(cards_router)
app.include_router(statistics_router)