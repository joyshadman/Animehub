/* eslint-disable react-hooks/exhaustive-deps */
import { FaArrowCircleRight, FaSearch, FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import background from "../assets/background.jpg";
import Navbar from "../components/Navbar";
import LightPillar from "../components/LightPillar";

const Root = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/search?keyword=${value}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden font-['Inter',_sans-serif] selection:bg-primary selection:text-black text-white">

      {/* 🌌 IMMERSIVE BACKGROUND SYSTEM */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 2.3 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        />

        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={0.8}
          rotationSpeed={0.2}
          glowAmount={0.005}
          pillarWidth={4.0}
          pillarHeight={0.3}
          noiseIntensity={0.2}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {/* 🧩 UI CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow flex flex-col items-center justify-center p-6 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl flex flex-col items-center text-center"
          >
            {/* 🏷️ BRANDING */}
            <motion.div variants={itemVariants} className="mb-6 font-extrabold">
              <h1 className="text-[12vw] md:text-[6rem] italic leading-[0.85] select-none uppercase">
                <span className="text-white drop-shadow-2xl">ANI</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-primary via-primary to-primary/40">
                  STORM
                </span>
              </h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 0.6, duration: 0.8, ease: "circOut" }}
                className="h-1 bg-primary mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
              />

              <p className="mt-6 text-white text-[10px] md:text-sm uppercase tracking-[1.2em] font-bold opacity-70">
                The vortex awaits
              </p>
            </motion.div>

            {/* 🔍 SEARCH BOX */}
            <motion.div variants={itemVariants} className="w-full max-w-xl mb-12">
              <form
                onSubmit={handleSubmit}
                className="group relative flex h-16 items-center p-1.5 
                           bg-black/70 backdrop-blur-xl 
                           border-2 border-white/20 
                           rounded-2xl transition-all duration-300 
                           hover:border-primary/60 focus-within:border-primary 
                           shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <div className="pl-5 text-white/50 group-focus-within:text-primary transition-colors">
                  <FaSearch size={20} />
                </div>

                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="text"
                  placeholder="SEARCH THE STORM..."
                  className="w-full h-full px-4 bg-transparent text-white outline-none 
                             text-base md:text-lg placeholder:text-gray-500 font-bold tracking-widest"
                />

                <button
                  type="submit"
                  className="h-full px-8 bg-primary text-black rounded-xl 
                             font-[900] uppercase text-[10px] tracking-widest 
                             transition-all hover:bg-white hover:scale-[0.98] 
                             active:scale-95 shadow-lg"
                >
                  Search
                </button>
              </form>
            </motion.div>

            {/* 🚀 CTA */}
            <motion.div variants={itemVariants} className="mb-16">
              <Link
                to="/home"
                className="group relative inline-flex items-center gap-4 bg-white/5 border border-white/10 px-10 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30"
              >
                <span className="relative z-10 text-white font-[700] text-lg uppercase tracking-tight">
                  Enter Archives
                </span>
                <FaArrowCircleRight className="relative z-10 text-white text-lg transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </motion.div>

            {/* 📝 PROJECT DISCLAIMER SECTION */}
            <motion.div 
              variants={itemVariants}
              className="max-w-2xl px-8 py-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-3 mb-3 text-primary/80">
                <FaInfoCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Project Intelligence</span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium tracking-wide">
                <span className="text-white font-bold">AniStorm</span> is a non-commercial cinematic platform designed for the anime community. We provide a high-performance interface to explore and stream your favorite titles. All media content is indexed from external third-party services.
              </p>
            </motion.div>

          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Root;