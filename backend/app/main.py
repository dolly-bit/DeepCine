from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine
from app.models import User
from app.routes.auth import router as auth_router
from app.routes.movies import router as movies_router
from app.models import User, Movie , Genre, MovieGenre, WatchHistory,SearchHistory
from app.routes.recommend import router as recommend_router
from app.routes.watch_history import router as watch_history_router
from app.routes.search_history import router as search_history_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CineMind AI API",
    version="1.0.0",
    description="AI-Powered Personalized Movie Recommendation System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(movies_router)
app.include_router(recommend_router)
app.include_router(watch_history_router)
app.include_router(search_history_router)


@app.get("/")
def root():
    return {"message": "Welcome to CineMind AI 🚀"}