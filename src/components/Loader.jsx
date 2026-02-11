/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const Loader = ({ className }) => {
  return (
    <div className={`flex flex-col justify-center items-center gap-8 select-none perspective-1000 ${className}`}>
      
      {/* 🔮 THE CORE ORB ASSEMBLY */}
      <div className="relative flex items-center justify-center w-32 h-32">
        
        {/* 1. Ambient Primary Aura (The "Breathe" effect) */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 bg-primary/20 blur-[40px] rounded-full"
        />

        {/* 2. Outer Kinetic Ring (Fast & Thin) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-20 h-20 border-[1px] border-t-primary border-r-transparent border-b-primary/5 border-l-transparent rounded-full shadow-[0_0_15px_rgba(249,115,22,0.1)]"
        />

        {/* 3. Middle Frosted Glass Ring (Slow Counter-Rotate) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-16 h-16 border-[3px] border-white/5 border-t-white/20 rounded-full backdrop-blur-[2px]"
        />

        {/* 4. The Glass Center Piece */}
        <div className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Inner Gloss Streak */}
          <motion.div 
            animate={{
                x: [-40, 40],
                opacity: [0, 1, 0]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute w-full h-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45"
          />
          
          {/* Pulsing Primary Core */}
          <motion.div 
            animate={{ 
                scale: [0.8, 1.2, 0.8],
                backgroundColor: ["#f97316", "#fdba74", "#f97316"] 
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full shadow-[0_0_15px_#f97316]"
          />
        </div>
      </div>

      {/* ⌨️ TYPOGRAPHY ASSEMBLY */}
      <div className="flex flex-col items-center gap-1">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-1"
        >
          {["L", "O", "A", "D", "I", "N", "G"].map((char, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -5, 0],
                opacity: [0.3, 1, 0.3],
                color: ["#ffffff", "#f97316", "#ffffff"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              className="text-[10px] md:text-xs font-black italic tracking-tighter"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Dynamic Status Subtext */}
        <motion.span 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[7px] uppercase tracking-[0.5em] text-white font-medium"
        >
          Initializing Secure Stream
        </motion.span>
      </div>

      {/* GLOBAL CSS FOR PERSPECTIVE */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Loader;