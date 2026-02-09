/* eslint-disable react/prop-types */
import {
  FaAngleRight,
  FaCalendarDay,
  FaCirclePlay,
  FaClock,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion"; // 🔥 Added
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import "./hero.css";
import SoundsInfo from "./SoundsInfo";
import { Link } from "react-router-dom";

const HeroBanner = ({ slides }) => {
  // Animation Variants for that "Pop" feel
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1, 
        ease: [0.16, 1, 0.3, 1] // Apple-style custom cubic bezier
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Swiper
      speed={1000} // Slower speed makes the pop feel more premium
      grabCursor={true}
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      className="slider h-[65vh] md:h-[75vh] xl:h-[85vh] w-full"
    >
      {slides &&
        slides.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative h-full overflow-hidden bg-[#050505]"
          >
            {({ isActive }) => ( // 💡 Using isActive to trigger animation
              <div className="content relative w-full h-full">
                
                {/* IMAGE LAYER */}
                <div className="absolute inset-0 md:left-[30%] overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.2 }}
                    animate={isActive ? { scale: 1 } : { scale: 1.2 }}
                    transition={{ duration: 6 }} // Slow zoom out effect
                    className="h-full w-full object-cover object-top md:object-center"
                    src={item.poster}
                    alt={item.title}
                  />
                  <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
                </div>

                {/* ANIMATED TEXT CONTENT */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="z-10 px-5 md:ml-16 w-full md:max-w-xl lg:max-w-2xl absolute bottom-12 md:top-1/2 md:-translate-y-1/2"
                    >
                      <motion.div variants={itemVariants} className="text-primary text-xs md:text-sm font-black uppercase tracking-widest mb-2">
                        #{item.rank} Spotlight
                      </motion.div>

                      <motion.div 
                        variants={itemVariants} 
                        className="text-2xl md:text-4xl lg:text-6xl font-black mb-4 uppercase italic tracking-tighter leading-[1.1] text-white line-clamp-2"
                      >
                        {item.title}
                      </motion.div>

                      {/* INFO BARS */}
                      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-xs md:text-sm text-white font-bold backdrop-blur-md">
                          <FaCirclePlay className="text-primary" /> {item.type}
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-xs md:text-sm text-white font-bold backdrop-blur-md">
                          <FaClock className="text-primary" /> {item.duration}
                        </div>
                        <div className="bg-primary text-black font-black px-3 py-1.5 rounded-lg text-xs md:text-sm">
                          {item.quality}
                        </div>
                        <SoundsInfo episodes={item.episodes} />
                      </motion.div>

                      {/* DESCRIPTION */}
                      <motion.div variants={itemVariants} className="description-container mb-8 max-w-lg hidden sm:block">
                        <p className="synopsis text-white/50 text-sm md:text-base leading-relaxed">
                          {item.synopsis}
                        </p>
                      </motion.div>

                      {/* BUTTONS */}
                      <motion.div variants={itemVariants} className="flex items-center gap-3">
                        <Link
                          to={`/watch/${item.id}`}
                          className="bg-primary px-8 py-3.5 rounded-full text-black font-black flex items-center gap-2 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                          <FaCirclePlay size={22} /> <span>WATCH NOW</span>
                        </Link>
                        <Link
                          to={`/anime/${item.id}`}
                          className="bg-white/10 backdrop-blur-md border border-white/10 px-8 py-3.5 rounded-full text-white font-black flex items-center gap-2 hover:bg-white/20 active:scale-95 transition-all"
                        >
                          <span>DETAIL</span> <FaAngleRight />
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default HeroBanner;