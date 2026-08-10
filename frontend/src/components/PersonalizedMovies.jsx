import { useEffect, useState } from "react";
import { getPersonalizedRecommendations } from "../services/movies";
import RecommendedSection from "./RecommendationSection";

export default function PersonalizedMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId || userId === "undefined") {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getPersonalizedRecommendations(userId);
        setMovies(data || []);
      } catch (error) {
        console.error(
          "Failed to load personalized recommendations:",
          error
        );
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (!movies.length && !loading) {
    return null;
  }

  return (
    <RecommendedSection
      movies={movies}
      loading={loading}
      title="✨ Recommended For You"
    />
  );
}