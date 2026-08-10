import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import DashboardHero from "../components/home/DashboardHero";
import MovieSlider from "../components/home/MovieSlider";
import RecommendedSection from "../components/RecommendationSection";
import PersonalizedMovies from "../components/PersonalizedMovies";

import {
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../services/movies";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const filterFutureMovies = (movies) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return movies
      .filter((movie) => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        return !Number.isNaN(releaseDate.getTime()) && releaseDate >= today;
      })
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  };

  async function loadMovies() {
    try {
      const [trend, top, up] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
      ]);

      setTrending(trend || []);
      setTopRated(top || []);
      setUpcoming(filterFutureMovies(up || []));
    } catch (err) {
      console.error(err);
      setTrending([]);
      setTopRated([]);
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08070C] text-white">
      <Navbar />

      <DashboardHero movies={trending} />

      <PersonalizedMovies />

      <div id="trending">
        <MovieSlider
          title="🔥 Trending Movies"
          movies={trending}
          loading={loading}
        />
      </div>

      <div id="top-rated">
        <MovieSlider
          title="⭐ Top Rated Movies"
          movies={topRated}
          loading={loading}
        />
      </div>

      <div id="upcoming">
        <MovieSlider
          title="📅 Upcoming Movies"
          movies={upcoming}
          loading={loading}
        />
      </div>
    </div>
  );
}