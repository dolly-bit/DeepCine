import api from "./api";

const normalizeMovie = (movie) => ({
  id: movie.id ?? movie.tmdb_id,
  title: movie.title || "Untitled movie",
  overview: movie.overview || "A great pick for your next watch.",
  poster_url: movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null),
  poster_path: movie.poster_path,
  release_date: movie.release_date || null,
  vote_average: movie.vote_average ?? 0,
  ...movie,
});

const safeRequest = async (request) => {
  try {
    const res = await request();
    return Array.isArray(res?.data) ? res.data.map(normalizeMovie) : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Trending Movies
export const getTrendingMovies = async () => {
  const res = await api.get("/movies/trending");
  return (res.data || []).map(normalizeMovie);
};

// Top Rated Movies
export const getTopRatedMovies = async () => {
  const res = await api.get("/movies/top-rated");
  return (res.data || []).map(normalizeMovie);
};

// Upcoming Movies
export const getUpcomingMovies = async () => {
  const res = await api.get("/movies/upcoming");
  return (res.data || []).map(normalizeMovie);
};

// Search Movies
export const searchMovies = async (query) => {
  const res = await api.get(`/movies/search?query=${query}`);
  return (res.data || []).map(normalizeMovie);
};

// AI Recommendations
export const getRecommendations = async (movieName) => {
  const res = await api.get(
    `/recommend/content?movie_name=${encodeURIComponent(movieName)}`
  );
  return (res.data || []).map(normalizeMovie);
};

// Content-Based Recommendations
export const getContentRecommendations = async (movieName) => {
  const res = await api.get(
    `/recommend/content?movie_name=${encodeURIComponent(movieName)}`
  );
  return (res.data || []).map(normalizeMovie);
};

// Collaborative Filtering
export const getCollaborativeRecommendations = async (movieName) => {
  const res = await api.get(
    `/recommend/collaborative?movie_name=${encodeURIComponent(movieName)}`
  );
  return (res.data || []).map(normalizeMovie);
};

export const getMovieDetails = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};

export const getMovieTrailer = async (id) => {
  const response = await api.get(`/movies/${id}/trailer`);
  return response.data;
};

export const getMovieCast = async (id) => {
  const response = await api.get(`/movies/${id}/cast`);
  return response.data;
};

export const getSimilarMovies = async (id) => {
  const response = await api.get(`/movies/${id}/similar`);
  return response.data;
};


export const saveWatchHistory = async (userId, tmdbId) => {
  const res = await api.post("/watch-history", null, {
    params: {
      user_id: userId,
      tmdb_id: tmdbId,
    },
  });

  return res.data;
};

export const saveSearchHistory = async (userId, query) => {
  const res = await api.post("/search-history/", null, {
    params: {
      user_id: userId,
      query: query,
    },
  });

  return res.data;
};

// Personalized AI Recommendations
export const getPersonalizedRecommendations = async (userId) => {
  const res = await api.get(`/recommended/personalized/${userId}`);
  return (res.data || []).map(normalizeMovie);
};
