/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Episodes = ({ episode, currentEp, layout }) => {
  const isCurrent = episode.id === currentEp.id;

  // Clean the ID for the URL - handling your specific replace logic
  const cleanId = episode.id.replaceAll("::", "?");

  return (
    <Link
      to={`/watch/${cleanId}`}
      title={episode.title}
      className={`group relative flex items-center transition-all duration-500 overflow-hidden ${
        layout === "row"
          ? "p-4 rounded-[1.5rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:translate-x-1"
          : "aspect-square justify-center rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.1] hover:scale-105"
      } ${
        isCurrent 
          ? "bg-primary !border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" 
          : episode.isFiller 
          ? "border-red-500/50 bg-red-500/10" 
          : ""
      }`}
    >
      {/* 🔮 Active Glass Overlay */}
      {isCurrent && (
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
      )}

      <div className={`flex items-center gap-4 z-10 ${layout === "column" ? "flex-col gap-0" : "w-full"}`}>
        {/* Episode Number */}
        <span className={`font-black tracking-tighter ${
          layout === "row" ? "text-xl italic" : "text-base"
        } ${isCurrent ? "text-primary" : "text-white/80 group-hover:text-white"}`}>
          {episode.episodeNumber < 10 ? `0${episode.episodeNumber}` : episode.episodeNumber}
        </span>

        {/* Title & Filler Badge (Only in Row) */}
        {layout === "row" && (
          <div className="flex flex-1 items-center justify-between min-w-0">
            <span className={`text-[13px] font-bold uppercase tracking-tight truncate ${
              isCurrent ? "text-primary" : "text-white/80 group-hover:text-white"
            }`}>
              {episode.title || `Episode ${episode.episodeNumber}`}
            </span>
            
            {episode.isFiller && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500 text-white font-black ml-2">
                FILLER
              </span>
            )}
          </div>
        )}
      </div>

      {/* "Now Playing" Indicator */}
      {isCurrent && layout === "row" && (
        <div className="absolute right-4 w-1.5 h-1.5 bg-black rounded-full shadow-xl" />
      )}
    </Link>
  );
};

export default Episodes;