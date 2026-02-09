import React from "react";
import { Link } from "react-router-dom";

const MoreSeasons = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-1 h-5 bg-primary/50 rounded-full" />
        <h3 className="text-sm font-black tracking-[0.2em] text-white/50 uppercase">
          More Seasons
        </h3>
      </div>

      {/* Seasons Grid */}
      <div className="flex gap-4 flex-wrap">
        {data.map((item) => {
          // Robust title selection
          const displayTitle = item.title?.english || item.title?.romaji || item.title || item.name || "Next Season";
          
          return (
            <Link
              to={`/watch/${item.id}`} // Changed to /watch/ so it loads the player for that season
              key={item.id}
              className="w-[calc(50%-0.5rem)] sm:w-[180px] h-20 group relative"
            >
              <div
                className={`relative overflow-hidden rounded-2xl w-full h-full flex justify-center items-center transition-all duration-500 border ${
                  item.isActive
                    ? "border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] scale-[0.98]"
                    : "border-white/5 hover:border-white/20 group-hover:scale-[1.02]"
                } bg-[#0a0a0a]`}
              >
                {/* 📝 Season Title */}
                <h1 className={`z-20 px-3 text-center line-clamp-2 text-[11px] font-black uppercase tracking-tighter transition-colors duration-300 ${
                  item.isActive ? "text-primary" : "text-white/80 group-hover:text-white"
                }`}>
                  {displayTitle}
                </h1>

                {/* 🖼️ Background Poster with Glass Blur */}
                <div
                  className={`absolute inset-0 z-10 bg-cover bg-center bg-no-repeat transition-all duration-700 ${
                    item.isActive ? "opacity-40 blur-[1px]" : "opacity-20 blur-[3px] group-hover:opacity-30 group-hover:blur-[1px]"
                  }`}
                  style={{ backgroundImage: `url(${item.poster || item.image})` }}
                />
                
                {/* 🌑 Overlay Gradient */}
                <div className="absolute inset-0 bg-black/40 z-[15]" />

                {/* ✨ Active Glow */}
                {item.isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full blur-sm" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MoreSeasons;