/* eslint-disable react/prop-types */
const Loader = ({ className }) => {
  return (
    <div className={`flex flex-col justify-center items-center gap-4 select-none ${className}`}>
      {/* 🍎 MODERN CSS SPINNER (Replaces GIF) */}
      <div className="relative flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-primary/20 animate-pulse"></div>
        
        {/* Rotating Glassy Spinner */}
        <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-primary/10 border-l-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"></div>
        
        {/* Center Dot */}
        <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping"></div>
      </div>

      {/* Optional Glassy Text */}
      <span className="text-primary font-black italic uppercase tracking-[0.3em] text-[10px] md:text-xs drop-shadow-md">
        Loading
      </span>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;