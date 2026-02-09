/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion
import SoundsInfo from "../components/SoundsInfo";
import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import CircleRatting from "../components/CircleRatting";

const InfoLayout = ({ data, showBigPoster }) => {
  const [showFull, setShowFull] = useState(false);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden selection:bg-primary selection:text-black">
      
      {/* 🖼️ DYNAMIC AMBIENT BACKDROP */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <img
          src={data.poster}
          alt=""
          className="object-cover object-center h-full w-full blur-[100px] brightness-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#050505]" />
      </motion.div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1300px] mx-auto pt-24 pb-20 px-4 md:px-10"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* 📱 LEFT COLUMN: POSTER & CALL TO ACTION */}
          <motion.div variants={itemVars} className="w-full lg:w-[340px] shrink-0 group">
            <div 
              className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-pointer"
              onClick={() => showBigPoster(data.poster)}
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 to-transparent" />
              
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                src={data.poster}
                alt={data.title}
                className="h-full w-full object-cover"
              />
            </div>

            {data.id && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
                <Link to={`/watch/${data.id}`} className="block">
                  <button className="w-full flex justify-center items-center gap-3 py-5 rounded-[1.8rem] text-sm font-black text-black bg-primary shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/50 transition-all uppercase tracking-[0.2em]">
                    <FaCirclePlay size={20} />
                    <span>Start Watching</span>
                  </button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* 📝 RIGHT COLUMN: CONTENT */}
          <div className="flex-1 flex flex-col gap-10 pt-4">
            
            {/* TITLES & BREADCRUMBS */}
            <motion.div variants={itemVars} className="space-y-4">
              <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="text-white/60 truncate max-w-[200px]">{data.title}</span>
              </nav>

              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.85] italic">
                {data.title}
              </h1>
              
              <div className="text-base font-bold text-white/30 italic">
                {data.alternativeTitle} <span className="mx-2 text-white/10">•</span> {data.japanese}
              </div>
            </motion.div>

            {/* 🛠️ GLASS METADATA BLOCK */}
            <motion.div 
              variants={itemVars}
              className="w-full max-w-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-1 rounded-[2.2rem] overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Score Section */}
                <div className="flex items-center gap-5 p-6 md:border-r border-white/5">
                  <div className="w-14 h-14 shrink-0 ">
                    <CircleRatting rating={data.MAL_score} />
                  </div>
                  <div className="flex flex-col mt-10">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">MAL Score</span>
                  </div>
                </div>

                {/* Sub/Dub Section */}
                <div className="flex-1 flex items-center px-8 py-6 bg-white/[0.02]">
                  <SoundsInfo episodes={{ rating: data.rating, ...data.episodes }} />
                </div>

                {/* Duration Section */}
                <div className="flex flex-col justify-center px-8 py-6 border-l border-white/5">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Duration</span>
                  <span className="text-xs font-bold text-white/70">{data.duration}</span>
                </div>
              </div>
            </motion.div>

            {/* GENRES */}
            <motion.div variants={itemVars} className="flex flex-wrap gap-2">
              {data.genres.map((genre) => (
                <Link 
                  to={`/animes/genre/${genre.toLowerCase()}`} 
                  key={genre}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-primary hover:text-black hover:border-primary transition-all duration-500"
                >
                  {genre}
                </Link>
              ))}
            </motion.div>

            {/* SYNOPSIS */}
            <motion.div variants={itemVars} className="max-w-3xl space-y-4">
              <div className="flex items-center gap-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Synopsis</h4>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <div className="relative">
                <p className={`text-base md:text-lg leading-relaxed text-white/50 font-medium ${showFull ? "" : "line-clamp-4 text-transparent bg-clip-text bg-gradient-to-b from-white/50 to-white/10"}`}>
                  {data.synopsis}
                </p>
              </div>

              <button 
                onClick={() => setShowFull(!showFull)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors flex items-center gap-2"
              >
                {showFull ? "[-] Collapse" : "[+] Read Story"}
              </button>
            </motion.div>

            {/* STATS CARDS */}
            <motion.div variants={itemVars} className="flex flex-wrap gap-4 pt-4">
                <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <div>
                      <span className="block text-[9px] font-black text-white/20 uppercase tracking-widest">Status</span>
                      <span className="text-xs font-black text-white uppercase">{data.status}</span>
                    </div>
                </div>
                <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="block text-[9px] font-black text-white/20 uppercase tracking-widest">Airing Date</span>
                    <span className="text-xs font-black text-white/70 uppercase">{data.aired.from}</span>
                </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoLayout;