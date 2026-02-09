import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/home" className="group">
      <div className="flex items-center space-x-2 relative">
        {/* 🍎 GLOW EFFECT (Hidden by default, glows on hover) */}
        <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h1 className="relative select-none text-3xl font-black italic tracking-tighter flex items-center">
          {/* THE LOGO TEXT WITH ANIMATED GRADIENT */}
          <span className="bg-gradient-to-r from-primary via-[#ffeb3b] to-primary bg-[length:200%_auto] animate-gradient-flow bg-clip-text text-transparent drop-shadow-sm">
            Joy
          </span>
          <span className="text-white group-hover:text-primary transition-colors duration-300">
            Nime
          </span>

          {/* ⚡ THE "DOT" INDICATOR */}
          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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