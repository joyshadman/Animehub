/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
  TbChevronsRight,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import MoreSeasons from "../layouts/MoreSeasons";
const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("vidWish");
  
  // Visibility states
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);

  useEffect(() => {
    // Reset buttons when episode changes
    setShowSkipIntro(false);
    setShowSkipOutro(false);

    // Show "Skip Intro" after 30 seconds (standard cold open)
    const introTimer = setTimeout(() => setShowSkipIntro(true), 30000);
    
    // Show "Skip Outro" after 5 minutes (available for most of the ep)
    const outroTimer = setTimeout(() => setShowSkipOutro(true), 300000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(outroTimer);
    };
  }, [episodeId]);

  const handleSkip = (seconds) => {
    const iframe = document.getElementById("anime-player");
    if (iframe) {
      const currentSrc = iframe.src;
      // Using URL object to cleanly handle parameters
      const url = new URL(currentSrc);
      url.searchParams.set("start", seconds);
      
      iframe.src = url.toString();
      
      // Hide the button that was clicked
      if (seconds < 500) setShowSkipIntro(false);
      else setShowSkipOutro(false);
    }
  };

  return (
    <>
      <div className="w-full bg-background aspect-video relative rounded-sm max-w-screen-xl overflow-hidden group">
        <iframe
          id="anime-player"
          key={`${episodeId}-${server}-${category}`} // Key forces refresh on source change
          src={`https://${
            server === "vidWish" ? "vidwish.live" : "megaplay.buzz"
          }/stream/s-2/${episodeId.split("ep=").pop()}/${category}`}
          width="100%"
          height="100%"
          allowFullScreen
          title="Video Player"
          className="z-10"
        ></iframe>

        {/* Skip Controls Overlay */}
        <div className="absolute bottom-16 left-4 md:left-8 flex flex-col gap-3 z-20">
          {showSkipIntro && (
            <button
              onClick={() => handleSkip(90)} 
              className="flex items-center gap-2 bg-black/80 hover:bg-primary hover:text-black text-white px-4 py-2 rounded border border-primary/50 transition-all backdrop-blur-md font-bold text-xs md:text-sm"
            >
              <TbChevronsRight size={18} />
              SKIP INTRO
            </button>
          )}

          {showSkipOutro && (
            <button
              onClick={() => handleSkip(1260)} // Skips to roughly 21:00
              className="flex items-center gap-2 bg-black/80 hover:bg-red-600 hover:text-white text-white px-4 py-2 rounded border border-red-500/50 transition-all backdrop-blur-md font-bold text-xs md:text-sm"
            >
              <TbPlayerSkipForwardFilled size={18} />
              SKIP TO OUTRO
            </button>
          )}
        </div>
      </div>

      <div className="category flex flex-wrap flex-col sm:flex-row items-center justify-center sm:justify-between px-2 md:px-20 gap-3 bg-lightbg py-4">
        <div className="servers flex gap-4">
          <button
            onClick={() => setServer("vidWish")}
            className={`${
              server === "vidWish" ? "bg-primary text-black" : "bg-btnbg text-white"
            } px-3 py-1.5 rounded text-sm font-semibold uppercase transition-colors`}
          >
            vidwish
          </button>
          <button
            onClick={() => setServer("megaPlay")}
            className={`${
              server === "megaPlay" ? "bg-primary text-black" : "bg-btnbg text-white"
            } px-3 py-1.5 rounded text-sm font-semibold uppercase transition-colors`}
          >
            megaplay
          </button>
        </div>

        <div className="flex gap-5">
          <div className="sound flex gap-3">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => setCategory(type)}
                className={`${
                  category === type ? "bg-primary text-black" : "bg-btnbg text-white"
                } px-3 py-1.5 rounded text-sm font-semibold uppercase transition-colors`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="btns flex gap-4">
            {hasPrevEp && (
              <button
                title="prev"
                className="prev bg-primary hover:scale-105 active:scale-95 transition-all px-3 py-1 rounded-md text-black"
                onClick={() => changeEpisode("prev")}
              >
                <TbPlayerTrackPrevFilled />
              </button>
            )}
            {hasNextEp && (
              <button
                title="next"
                className="next bg-primary hover:scale-105 active:scale-95 transition-all px-3 py-1 rounded-md text-black"
                onClick={() => changeEpisode("next")}
              >
                <TbPlayerTrackNextFilled />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col text-center sm:text-right">
          <p className="text-gray-400 text-sm">
            Watching <span className="text-white font-medium">Episode {currentEp.episodeNumber}</span>
          </p>
          {currentEp.isFiller && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-tighter">
              Filler Episode 👻
            </p>
          )}
        </div>
        
      </div>
    </>
  );
};

export default Player;