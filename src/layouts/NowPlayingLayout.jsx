/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";
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
      className="mt-12 mb-10 px-4 md:px-0"
    >
      <div className="flex items-center justify-between mb-6 border-l-4 border-primary pl-4">
        <div>
          <Heading>Continue Watching</Heading>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Jump back in</p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem("now_playing"); setHistory([]); }}
          className="text-[10px] text-white/20 hover:text-red-500 uppercase font-black transition-colors"
        >
          Clear All
        </button>
      </div>

      <Swiper 
        spaceBetween={12} 
        slidesPerView={1.2} 
        breakpoints={{ 
          480: { slidesPerView: 2.2 }, 
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.5 } 
        }}
      >
        <AnimatePresence mode="popLayout">
          {history.map((item) => (
            <SwiperSlide key={item.id}>
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="group relative"
              >
                {/* REMOVE BUTTON */}
                <button 
                  onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                  className="absolute -top-1 -right-1 z-50 text-white/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <IoCloseCircle size={20} />
                </button>

                <Link to={`/watch/${item.id}?ep=${item.episodeId?.split("ep=").pop()}`}>
                  {/* TEXT BOX LAYOUT - NO IMAGE */}
                  <div className="relative flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.07] group-hover:border-primary/40 transition-all duration-300">
                    
                    {/* INDICATOR ICON */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-[13px] font-black italic uppercase text-white truncate group-hover:text-primary transition-colors tracking-tighter">
                        {item.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">
                          EP {item.episodeNumber}
                        </span>
                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
                          RESUME
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </AnimatePresence>
      </Swiper>
    </motion.section>
  );
};

export default NowPlayingLayout;