from fastapi import APIRouter, Depends
from ai.recommender import recommend_movies
from app.services.ai_recommendation_services import (
    get_personalized_recommendations)
from sqlalchemy.orm import Session
from app.database.connection import get_db

router = APIRouter(
    prefix="/recommend",
    tags=["Recommendations"],
)


@router.get("/content")
def content_recommendation(movie_name: str):
    return recommend_movies(movie_name)


@router.get("/collaborative")
def collaborative_recommendation(movie_name: str):
    # Temporary: return the same recommendations
    # Later you can replace this with a true collaborative model.
    
    return recommend_movies(movie_name)

@router.get("/personalized/{user_id}")
def personalized_recommendations(
    user_id: int,
    db: Session = Depends(get_db),
):
    movies = get_personalized_recommendations(
        user_id,
        db,
    )

    return [
        {
            "id": movie.tmdb_id,
            "tmdb_id": movie.tmdb_id,
            "title": movie.title,
            "poster_url": (
                f"https://image.tmdb.org/t/p/w500{movie.poster_path}"
                if movie.poster_path
                else None
            ),
            "overview":movie.overview,
            "vote_average": movie.vote_average or 0,
            "release_date": movie.release_date,
        }
        for movie in movies
    ]