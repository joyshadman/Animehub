/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import SoundsInfo from "./SoundsInfo";

const MiniPoster = ({ item }) => {
  return (
    <div 
      key={item.id} 
      className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 backdrop-blur-md transition-all duration-500 ease-out mb-2 shadow-sm hover:shadow-xl"
    >
      {/* 🖼️ MINI POSTER IMAGE */}
      <Link className="shrink-0" to={`/anime/${item.id}`}>
        <div className="relative w-14 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg">
          <img
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            src={item.poster}
            alt={item.title}
            loading="lazy"
          />
          {/* Subtle overlay to prevent bright posters from breaking the dark theme */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
      </Link>

      {/* 📝 TEXT CONTENT */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <Link to={`/anime/${item.id}`}>
          <h2 className="title text-sm font-bold text-neutral-200 group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-wide leading-snug">
            {item.title}
          </h2>
        </Link>
        
        <div className="flex items-center mt-1.5 flex-wrap gap-1">
          {/* Component for Sub/Dub info */}
          <div className="scale-90 origin-left opacity-80 group-hover:opacity-100 transition-opacity">
            <SoundsInfo episodes={item.episodes} />
          </div>

          {item.type && (
            <div className="flex items-center">
              <span className="block mx-2 h-1 w-1 bg-white/20 rounded-full group-hover:bg-primary transition-colors"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
                {item.type}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniPoster;