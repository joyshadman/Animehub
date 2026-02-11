/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarDay, 
  FaClock,
  FaChevronRight,
  FaCircleCheck 
} from "react-icons/fa6";

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Primary Accent Color Configuration
  const PRIMARY_HEX = "#ffdd95";
  const PRIMARY_RGB = "255, 221, 149"; // Used for alpha transparency effects

  // Clock sync to update "Released" status in real-time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = useMemo(() => [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      shortName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate().toString(),
      displayDate: d.getDate(),
      isToday: i === 0,
      id: i
    };
  }), []);

  const [selectedDay, setSelectedDay] = useState(days[0]);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://anime-api-itt4.onrender.com/api/v1/schedule`, {
          params: { date: selectedDay.dateNum } 
        });
        const list = res.data?.data?.response || res.data?.response || [];
        setScheduleData(Array.isArray(list) ? list : []);
      } catch (err) {
        setError("Sync Failed");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedDay]);

  const isReleased = (releaseTimeStr) => {
    if (!selectedDay.isToday) return false;
    try {
        const [hours, minutes] = releaseTimeStr.split(':').map(Number);
        const releaseTime = new Date();
        releaseTime.setHours(hours, minutes, 0);
        return currentTime > releaseTime;
    } catch (e) { return false; }
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
  };

  return (
    <div 
      className="relative group overflow-hidden bg-white/[0.01] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl h-full flex flex-col shadow-2xl text-white font-sans transition-all duration-700 hover:border-[var(--primary)]/30"
      style={{ 
        '--primary': PRIMARY_HEX, 
        '--primary-rgb': PRIMARY_RGB 
      }}
    >
      
      {/* 🔮 DYNAMIC AMBIENT GLOW */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
          x: [-20, 20, -20]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -left-[10%] w-[80%] h-[50%] bg-[var(--primary)]/15 blur-[120px] pointer-events-none" 
      />
      
      {/* HEADER SECTION */}
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
              <FaCalendarDay size={16} className="text-[var(--primary)] drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
            </div>
            <div>
              <span className="block font-black uppercase tracking-[0.3em] text-[10px] md:text-[12px] text-white/90 leading-none mb-1.5">Schedule</span>
              <span className="text-[8px] md:text-[9px] text-[var(--primary)] font-bold uppercase tracking-widest opacity-70">Airing Radar</span>
            </div>
          </div>
          
          <div className="px-4 py-2 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 backdrop-blur-xl">
            <span className="text-[11px] font-bold text-[var(--primary)] tabular-nums tracking-widest">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>

        {/* DATE SELECTOR */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 mt-5 -mx-2 px-2">
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d)}
              className={`relative flex flex-col mt-5 items-center min-w-[52px] md:min-w-[60px] py-4 rounded-2xl transition-all duration-500 border ${
                selectedDay.id === d.id 
                ? "bg-[var(--primary)]/20 border-[var(--primary)]/50 text-white shadow-[0_10px_25px_rgba(var(--primary-rgb),0.2)] scale-105" 
                : "bg-transparent border-transparent text-white/20 hover:text-white/40"
              }`}
            >
              <span className={`text-[8px] font-black uppercase mb-1.5 z-10 tracking-widest ${selectedDay.id === d.id ? "text-[var(--primary)]" : ""}`}>
                {d.shortName}
              </span>
              <span className="text-xl md:text-2xl font-light z-10 leading-none">{d.displayDate}</span>
              {selectedDay.id === d.id && (
                <motion.div layoutId="pill" className="absolute bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ANIME LIST CONTENT */}
      <div className="flex-grow px-4 md:px-6 pb-8 overflow-y-auto custom-scrollbar relative z-10 min-h-[450px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-6"
            >
              <div className="w-12 h-12 border-2 border-white/5 border-t-[var(--primary)] rounded-full animate-spin shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" />
              <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.6em] animate-pulse">Syncing</span>
            </motion.div>
          ) : scheduleData.length > 0 ? (
            <motion.div 
              key={selectedDay.id}
              variants={containerVars}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {scheduleData.map((anime, idx) => {
                const released = isReleased(anime.time);
                return (
                  <motion.div 
                    key={idx}
                    variants={itemVars}
                    whileHover={!released ? { x: 6, backgroundColor: "rgba(var(--primary-rgb),0.06)" } : {}}
                    onClick={() => navigate(`/anime/${anime.id}`)}
                    className={`group/item flex items-center justify-between p-5 md:p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer ${
                      released 
                      ? "opacity-20 border-transparent bg-transparent grayscale" 
                      : "opacity-100 border-white/5 bg-white/[0.03] hover:border-[var(--primary)]/40 shadow-xl"
                    }`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="flex flex-col items-center min-w-[50px] md:min-w-[60px]">
                        <span className={`text-[13px] md:text-[15px] tabular-nums font-semibold ${released ? "text-white/40" : "text-white"}`}>
                          {anime.time}
                        </span>
                        {released ? (
                          <FaCircleCheck size={12} className="text-[var(--primary)]/40 mt-2.5" />
                        ) : (
                          <motion.div 
                            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2.5 shadow-[0_0_12px_var(--primary)]" 
                          />
                        )}
                      </div>
                      
                      <div className="w-[1px] h-10 md:h-12 bg-white/10" />
                      
                      <div className="flex flex-col min-w-0 pr-4">
                        <span className={`text-[14px] md:text-[16px] line-clamp-1 tracking-tight font-bold transition-colors ${released ? "text-white/30" : "text-white group-hover/item:text-[var(--primary)]"}`}>
                          {anime.title}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[9px] md:text-[10px] text-white/30 font-black uppercase tracking-widest">Episode {anime.episode}</span>
                          {!released && (
                            <span className="text-[8px] md:text-[9px] px-2 py-0.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-black uppercase tracking-tighter border border-[var(--primary)]/30 shadow-[0_4px_12px_rgba(var(--primary-rgb),0.15)]">
                              Airing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <FaChevronRight className={`text-[12px] transition-all duration-300 ${released ? "text-white/5" : "text-white/20 group-hover/item:text-[var(--primary)] group-hover/item:translate-x-1.5"}`} />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 opacity-10">
              <FaClock size={32} className="mb-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">No Broadcasts</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(var(--primary-rgb), 0.15); 
          border-radius: 20px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(var(--primary-rgb), 0.4); 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Schedule;