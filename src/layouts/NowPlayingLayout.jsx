/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircle, IoPlay } from "react-icons/io5";
import "swiper/css";

const NowPlayingLayout = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    try {
      const data = localStorage.getItem("now_playing");
      setHistory(data ? JSON.parse(data) : []);
    } catch (e) {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener("focus", loadHistory);
    return () => window.removeEventListener("focus", loadHistory);
  }, []);

  const removeItem = (id) => {
    const updated = history.filter((i) => i.id !== id);
    localStorage.setItem("now_playing", JSON.stringify(updated));
    setHistory(updated);
  };

  if (history.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      // Negative margin offsets the internal padding so sections stay tight
      className="relative mt-12 mb-4 px-4 md:px-0 z-20 -my-10"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <Heading>Continue Watching</Heading>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-10 -mt-7 mb-6">
            Pick up where you left off
          </p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem("now_playing"); setHistory([]); }}
          className="text-[10px] text-white/20 hover:text-red-500 uppercase font-black transition-colors border border-white/5 px-3 py-1.5 rounded-full"
        >
          Clear History
        </button>
      </div>

      <div className="relative w-full">
        <Swiper 
          // py-10 provides the "air" needed for hover translations and glows
          className="!overflow-visible py-10" 
          spaceBetween={16} 
          slidesPerView={1.2} 
          breakpoints={{ 
            480: { slidesPerView: 2.2 }, 
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.5 },
            1440: { slidesPerView: 5.5 }
          }}
        >
          <AnimatePresence mode="popLayout">
            {history.map((item) => (
              <SwiperSlide key={item.id} className="!h-auto">
                <motion.div 
                  layout 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} 
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  {/* REMOVE BUTTON */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(item.id); }}
                    className="absolute -top-3 -right-1 z-[70] text-white/30 hover:text-primary transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-110"
                  >
                    <IoCloseCircle size={22} />
                  </button>

                  <Link to={`/watch/${item.id}?ep=${item.episodeId?.split("ep=").pop()}`}>
                    <div className="relative flex items-center gap-4 p-5 rounded-[1.5rem] bg-[#121212]/80 border border-white/5 backdrop-blur-md group-hover:bg-white/[0.08] group-hover:border-primary/50 transition-all duration-300 shadow-xl">
                      
                      {/* ICON BOX */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-inner">
                        <IoPlay size={24} className="ml-1" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h1 className="text-[13px] font-black italic uppercase text-white truncate group-hover:text-primary transition-colors tracking-tighter">
                          {item.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                            EP {item.episodeNumber}
                          </span>
                          <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                            RESUME
                          </span>
                        </div>
                      </div>

                      {/* GLOWING PROGRESS BAR */}
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
                          <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "65%" }} 
                              className="h-full bg-gradient-to-r from-primary to-yellow-500 shadow-[0_0_10px_rgba(255,183,0,0.5)]"
                          />
                      </div>
                    </div>
                  </Link>

                  {/* HOVER GLOW AURA */}
                  <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              </SwiperSlide>
            ))}
          </AnimatePresence>
        </Swiper>
      </div>
    </motion.section>
  );
};

export default NowPlayingLayout;