/* eslint-disable react/prop-types */
import SoundsInfo from "../components/SoundsInfo";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// We add 'isLink' prop. Default is true. 
// When used in MainLayout, we will pass isLink={false} to avoid nesting <a> tags.
const Image = ({ data, isLink = true }) => {
  // Safe image path fallback
  const posterSrc = data.poster || data.image || data.imageUrl || data.banner;

  // This internal component prevents repeating the poster UI code
  const PosterContent = (
    <div className="film-poster relative w-full pb-[145%] mb-3 overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5 group-hover:border-primary/30">
      
      {/* BADGES LAYER (Bottom Left) */}
      <div className="absolute bottom-3 left-2 z-50 transition-transform duration-500 group-hover:scale-105 origin-bottom-left">
        <SoundsInfo episodes={data.episodes} />
      </div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* THE IMAGE */}
      <LazyLoadImage
        className="absolute h-full w-full inset-0 object-cover object-center transition-transform duration-700 group-hover:scale-110"
        wrapperClassName="h-full w-full absolute inset-0"
        effect="blur"
        src={posterSrc}
        alt={data.title || data.name}
        // Fallback for broken links
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/600x900/1a1a1a/ffffff?text=No+Poster";
        }}
      />
    </div>
  );

  return (
    <div className="group relative">
      {/* 🔥 FIX 1: Only wrap in Link if isLink is true */}
      {isLink ? (
        <Link to={`/anime/${data.id}`}>
          {PosterContent}
        </Link>
      ) : (
        PosterContent
      )}

      {/* 📝 TEXT CONTENT */}
      <div className="px-1">
        {isLink ? (
          <Link to={`/anime/${data.id}`}>
            <h1
              title={data.title || data.name}
              className="title line-clamp-1 text-sm md:text-[15px] font-black italic tracking-tighter transition-colors group-hover:text-primary uppercase"
            >
              {data.title || data.name}
            </h1>
          </Link>
        ) : (
          <h1
            title={data.title || data.name}
            className="title line-clamp-1 text-sm md:text-[15px] font-black italic tracking-tighter transition-colors group-hover:text-primary uppercase"
          >
            {data.title || data.name}
          </h1>
        )}

        {(data.type || data.duration) && (
          <div className="type flex items-center gap-2 mt-1 text-[11px] font-bold text-white/40 uppercase tracking-widest">
            <span>{data.type}</span>
            {data.duration && (
              <>
                <div className="h-1 w-1 bg-primary/40 rounded-full" />
                <span>{data.duration}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Image;