import { Play, Info, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const isComingSoon = movie.release_date && new Date(movie.release_date) > new Date();

  return (
    <div className="group/card relative w-full max-w-[240px] flex-shrink-0 transition-all duration-300 hover:z-50">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#12121a] shadow-[0_20px_60px_rgba(15,23,42,0.35)] transition-all duration-500 group-hover/card:scale-105 group-hover/card:-translate-y-3 group-hover/card:shadow-[0_24px_80px_rgba(139,92,246,0.35)]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-400/10 opacity-70" />

        <img
          src={movie.poster_url || movie.poster_path}
          alt={movie.title}
          className="h-[330px] w-full object-cover transition duration-500 group-hover/card:scale-110"
        />

        <div className="absolute inset-x-3 top-3 z-30 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 backdrop-blur">
            <Star size={14} fill="#FACC15" className="text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200 backdrop-blur">
  {movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A"}
</div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-all duration-300 group-hover/card:opacity-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-lg shadow-purple-500/30 transition hover:scale-110"
            >
              <Play fill="white" className="ml-1 text-white" />
            </button>
          </div>

          <div className="absolute bottom-0 w-full p-4">
            <h3 className="line-clamp-2 text-lg font-bold text-white">{movie.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{movie.overview?.slice(0, 80) || "A cinematic pick curated for your vibe."}</p>

            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-white transition hover:bg-white/20"
            >
              <Info size={18} />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}