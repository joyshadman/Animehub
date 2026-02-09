/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";

const NowPlayingLayout = ({ data, onClear }) => {
  // data should now be an ARRAY: [{...}, {...}]
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const handleImgError = (e, name) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/600x338/111111/E50914?text=${encodeURIComponent(name || 'Anime')}`;
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 mb-10 group px-4 md:px-0"
    >
      <div className="flex items-center justify-between mb-6 border-l-4 border-primary pl-4">
        <div>
          <Heading>Continue Watching</Heading>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
            Resume your progress
          </p>
        </div>
        <button 
          onClick={onClear}
          className="text-[10px] text-white/20 hover:text-red-500 uppercase font-black transition-all md:opacity-0 group-hover:opacity-100"
        >
          Clear History
        </button>
      </div>

      <div className="relative">
        <Swiper
          spaceBetween={15}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.5 },
          }}
          className="rounded-2xl"
        >
          <AnimatePresence>
            {data.map((item, index) => {
              const watchId = item.episodeId || item.id;
              const posterImg = item.poster || item.imageUrl || item.image;

              return (
                <SwiperSlide key={item.id || index}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link 
                      to={`/watch/${watchId}`}
                      className="relative block aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-lg group/card"
                    >
                      <img 
                        src={posterImg} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        onError={(e) => handleImgError(e, item.name)}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      {/* Episode Badge */}
                      <div className="absolute top-2 left-2 bg-primary text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg z-10">
                        EP {item.episodeNumber || '??'}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <h3 className="text-xs font-bold text-white line-clamp-1 group-hover/card:text-primary transition-colors uppercase">
                          {item.name}
                        </h3>
                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "65%" }}
                             className="bg-primary h-full shadow-[0_0_8px_#ff9c00]" 
                           /> 
                        </div>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40">
                         <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                         </div>
                      </div>
                    </Link>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </AnimatePresence>
        </Swiper>
      </div>
    </motion.section>
  );
};

export default NowPlayingLayout;