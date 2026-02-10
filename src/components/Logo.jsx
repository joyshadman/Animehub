import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LogoImg from "../assets/lgo.png"; // Renamed from Logo to LogoImg

const Logo = () => {
  return (
    <Link to="/home" className="group flex items-center space-x-3 no-underline">
      {/* 🌪️ LOGO IMAGE/ICON WRAPPER */}
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Glow behind the icon */}
        <div className="absolute -inset-1 blur-lg rounded-full group-hover:bg-[#cc00cc]/60 transition-all duration-500" />
        
        <img 
          src={LogoImg} // Using the renamed variable here
          alt="AniStorm Logo" 
          className="relative w-full h-full object-contain transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Fallback Icon (SVG) */}
        <div className="absolute text-orange-500 group-hover:text-white transition-colors duration-300 pointer-events-none">
           <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-0 group-hover:opacity-0">
             <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
           </svg>
        </div>
      </div>

      {/* 🏷️ BRAND NAME */}
      <div className="flex flex-col leading-none">
        <h1 className="relative select-none text-2xl font-[900] italic tracking-tighter flex items-center uppercase">
          <span className="text-white group-hover:text-orange-500 transition-colors duration-300">
            ANI
          </span>
          
          <span className="ml-1 bg-gradient-to-r from-orange-500 via-amber-300 to-orange-600 bg-[length:200%_auto] animate-gradient-flow bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,149,0,0.3)]">
            STORM
          </span>

          <motion.span 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="ml-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_#ff9500]"
          />
        </h1>
        
      </div>

      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 3s ease infinite;
        }
      `}</style>
    </Link>
  );
};

export default Logo;