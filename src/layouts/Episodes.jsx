/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Episodes = ({ episode, currentEp, layout }) => {
  const isCurrent = episode.id === currentEp.id;
  const cleanId = episode.id.replaceAll("::", "?");

  return (
    <Link
      to={`/watch/${cleanId}`}
      title={episode.title}
      className={`group relative flex items-center transition-all duration-500 overflow-hidden ${
        layout === "row"
          ? "p-4 rounded-[1.5rem] border bg-white/[0.03] hover:translate-x-1"
          : "aspect-square justify-center rounded-2xl border bg-white/[0.03] hover:scale-105"
      } ${
        isCurrent 
          ? "border-primary bg-primary/10 shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)] z-20" 
          : episode.isFiller 
          ? "border-red-500/30 bg-red-500/5 hover:border-red-500/60" 
          : "border-white/5 hover:border-white/20 hover:bg-white/[0.08]"
      }`}
    >
      {/* 🌊 Animated Soundwave (Primary Color) */}
      {isCurrent && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="flex items-center justify-center gap-[3px] h-full w-full">
            {[...Array(layout === "row" ? 20 : 6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ["10%", "70%", "30%", "90%", "10%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.4 + Math.random() * 0.6,
                  ease: "easeInOut",
                }}
                className="w-[2px] bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* ✨ Moving Neon Flare */}
      {isCurrent && (
        <motion.div
          initial={{ x: "-150%" }}
          animate={{ x: "250%" }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      {/* 🔮 Background Glow Pulse */}
      {isCurrent && (
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 bg-primary pointer-events-none" 
        />
      )}

      <div className={`flex items-center gap-4 z-10 relative ${layout === "column" ? "flex-col gap-0" : "w-full"}`}>
        {/* Episode Number (Active Primary) */}
        <motion.span 
          animate={isCurrent ? { scale: [1, 1.15, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`font-black tracking-tighter ${
            layout === "row" ? "text-xl italic" : "text-base"
          } ${isCurrent ? "text-primary" : "text-white/80 group-hover:text-white"}`}
        >
          {episode.episodeNumber < 10 ? `0${episode.episodeNumber}` : episode.episodeNumber}
        </motion.span>

        {/* Title & Filler Badge */}
        {layout === "row" && (
          <div className="flex flex-1 items-center justify-between min-w-0">
            <span className={`text-[13px] font-bold uppercase tracking-tight truncate transition-colors ${
              isCurrent ? "text-primary" : "text-white/80 group-hover:text-white"
            }`}>
              {episode.title || `Episode ${episode.episodeNumber}`}
            </span>
            
            {episode.isFiller && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ml-2 shadow-sm ${
                isCurrent ? "bg-primary text-black" : "bg-red-500 text-white"
              }`}>
                FILLER
              </span>
            )}
          </div>
        )}
      </div>

      {/* 🚀 Outer Neon Border Glow (Only Active) */}
      {isCurrent && (
        <div className="absolute inset-0 rounded-inherit border border-primary/50 blur-[2px] pointer-events-none" />
      )}

      {/* Animated Bottom Progress Line */}
      {isCurrent && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="absolute bottom-0 left-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
        />
      )}
    </Link>
  );
};

export default Episodes;