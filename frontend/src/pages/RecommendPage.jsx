import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar";
import HeroCarousel from "../components/HeroCarousel";
import FilterBar from "../components/FilterBar";
import MovieRow from "../components/MovieRow";

import {
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getRecommendations,
  getCollaborativeRecommendations,
  getPersonalizedRecommendations,
} from "../services/movies";

export default function RecommendPage({ username = "Guest" }) {
  const location = useLocation();
  const movieName = location.state?.search || "Avengers";
  const userId = localStorage.getItem("user_id");

  const [recommended, setRecommended] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [collaborative, setCollaborative] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  loadMovies();
}, [movieName, userId]);

  const filterFutureMovies = (movies) => {
    const today = new Date().toISOString().slice(0, 10);
    return movies
      .filter((movie) => movie.release_date && movie.release_date >= today)
      .sort((a, b) => a.release_date.localeCompare(b.release_date));
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const [
  recommend,
  personalizedMovies,
  collaborativeMovies,
  trendingMovies,
  topRatedMovies,
  upcomingMovies,
] = await Promise.all([
  getRecommendations(movieName),
  getPersonalizedRecommendations(userId),
  getCollaborativeRecommendations(userId),
  getTrendingMovies(),
  getTopRatedMovies(),
  getUpcomingMovies(),
]);

      setRecommended(recommend || []);
setPersonalized(personalizedMovies || []);
setCollaborative(collaborativeMovies || []);
setTrending(trendingMovies || []);
setTopRated(topRatedMovies || []);
setUpcoming(filterFutureMovies(upcomingMovies || []));
    } catch (err) {
      console.error(err);
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cm-bg text-white">
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cm-bg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-cm-bg min-h-screen font-sans">
      <TopBar username={username} />

      <HeroCarousel slides={recommended.slice(0, 5)} />

      <FilterBar username={username} />

      <MovieRow
  title="Recommended For You"
  subtitle="Personalized for your taste"
  movies={personalized}
/>
      <MovieRow
     title="Because You Searched"
    subtitle={`Movies similar to ${movieName}`}
    movies={recommended}
/>
     {collaborative.length > 0 && (
       <MovieRow
        title="Because Viewers Like You Watched These"
        subtitle="Based on similar users' watch patterns"
        movies={collaborative}
  />
)}

      <MovieRow
        title="Trending Movies"
        subtitle="Trending this week"
        movies={trending}
      />

      <MovieRow
        title="Upcoming Movies"
        subtitle="Coming soon"
        movies={upcoming}
      />

      <MovieRow
        title="Top Rated Movies"
        subtitle="Highest rated by users"
        movies={topRated}
      />

      <footer className="px-6 py-6 text-center text-xs text-cm-muted">
        © 2026 DeepCine
      </footer>
    </div>
  );
}