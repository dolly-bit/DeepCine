from app.database.connection import SessionLocal
from app.models.movie import Movie
from app.models.genre import Genre
from app.models.movie_genre import MovieGenre
from app.services.tmdb.details import get_movie_details


db = SessionLocal()

try:
    movies = db.query(Movie).all()

    print(f"Total movies found: {len(movies)}")

    if not movies:
        print("ERROR: No movies found in the database.")
        print("You need to import movies before creating movie-genre relationships.")
        raise SystemExit

    count = 0
    skipped_no_tmdb = 0
    skipped_no_genres = 0
    failed = 0

    for index, movie in enumerate(movies, start=1):

        print(
            f"[{index}/{len(movies)}] "
            f"{movie.title} | TMDB ID: {movie.tmdb_id}"
        )

        # Movie must have a TMDB ID
        if not movie.tmdb_id:
            skipped_no_tmdb += 1
            print("   -> SKIPPED: No TMDB ID")
            continue

        try:
            details = get_movie_details(movie.tmdb_id)

            if not details:
                skipped_no_genres += 1
                print("   -> SKIPPED: No TMDB details")
                continue

            tmdb_genres = details.get("genres", [])

            if not tmdb_genres:
                skipped_no_genres += 1
                print("   -> SKIPPED: No genres returned")
                continue

            for g in tmdb_genres:

                tmdb_genre_id = g.get("id")
                genre_name = g.get("name")

                if not tmdb_genre_id:
                    continue

                # Find genre using TMDB genre ID
                genre = (
                    db.query(Genre)
                    .filter(Genre.tmdb_id == tmdb_genre_id)
                    .first()
                )

                # If genre doesn't exist, create it
                if not genre:

                    genre = Genre(
                        tmdb_id=tmdb_genre_id,
                        name=genre_name
                    )

                    db.add(genre)
                    db.flush()

                    print(
                        f"   -> Created genre: {genre_name}"
                    )

                # Check relationship
                existing = (
                    db.query(MovieGenre)
                    .filter(
                        MovieGenre.movie_id == movie.id,
                        MovieGenre.genre_id == genre.id
                    )
                    .first()
                )

                if existing:
                    continue

                # Create relationship
                db.add(
                    MovieGenre(
                        movie_id=movie.id,
                        genre_id=genre.id
                    )
                )

                count += 1

            # Commit every 50 movies
            if index % 50 == 0:
                db.commit()
                print(f"   -> Progress saved. Relationships: {count}")

        except Exception as e:
            failed += 1

            print(
                f"   -> FAILED: {movie.title}"
            )
            print(
                f"      {type(e).__name__}: {e}"
            )

            db.rollback()

    db.commit()

    print()
    print("========================================")
    print("MOVIE-GENRE IMPORT COMPLETE")
    print("========================================")
    print(f"Movies found:          {len(movies)}")
    print(f"Relationships created: {count}")
    print(f"No TMDB ID:            {skipped_no_tmdb}")
    print(f"No genres returned:    {skipped_no_genres}")
    print(f"Failed movies:         {failed}")
    print("========================================")

finally:
    db.close()
    