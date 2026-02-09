/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
  TbRefresh,
  TbBulb,
  TbBulbOff,
} from "react-icons/tb";
import { FaExpand, FaCompress } from "react-icons/fa";

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
  animeData, // Pass the main anime object to save for "Now Playing"
}) => {
  const [category, setCategory] = useState(
    localStorage.getItem("anime_category") || "sub"
  );
  const [server, setServer] = useState(
    localStorage.getItem("anime_server") || "vidWish"
  );
  const [autoNext, setAutoNext] = useState(
    JSON.parse(localStorage.getItem("anime_autonext") ?? "true")
  );
  const [theaterMode, setTheaterMode] = useState(false);
  const [lightMode, setLightMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // 💾 1. SAVE "NOW PLAYING" TO LOCALSTORAGE
  useEffect(() => {
    if (currentEp && animeData) {
      const historyItem = {
        ...animeData,
        episodeNumber: currentEp.episodeNumber,
        episodeId: episodeId,
        lastWatched: new Date().getTime(),
      };
      localStorage.setItem("now_playing", JSON.stringify(historyItem));
    }
  }, [episodeId, currentEp, animeData]);

  // ⚙️ 2. PERSISTENCE FOR SETTINGS
  useEffect(() => {
    localStorage.setItem("anime_category", category);
    localStorage.setItem("anime_server", server);
    localStorage.setItem("anime_autonext", autoNext);
  }, [category, server, autoNext]);

  // ⌨️ 3. KEYBOARD SHORTCUTS LOGIC
  const handleKeydown = useCallback((e) => {
    const key = e.key.toLowerCase();
    
    // Fullscreen (F)
    if (key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    }
    // Lights (L)
    if (key === 'l') {
      setLightMode(prev => !prev);
    }
    // Next Episode (N or ArrowRight)
    if ((key === 'n' || e.key === 'ArrowRight') && hasNextEp) {
      changeEpisode("next");
    }
    // Prev Episode (P or ArrowLeft)
    if ((key === 'p' || e.key === 'ArrowLeft') && hasPrevEp) {
      changeEpisode("prev");
    }
  }, [hasNextEp, hasPrevEp, changeEpisode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  // 💡 4. HANDLE LIGHT DIMMING
  useEffect(() => {
    const overlay = document.getElementById("light-dimmer");
    if (!lightMode) {
      overlay?.classList.remove("hidden");
      overlay?.classList.add("opacity-95");
    } else {
      overlay?.classList.add("opacity-0");
      setTimeout(() => overlay?.classList.add("hidden"), 300);
    }
  }, [lightMode]);

  const toggleFullscreen = () => {
    const iframe = document.getElementById("anime-player");
    if (!document.fullscreenElement) iframe?.requestFullscreen();
    else document.exitFullscreen();
  };

  const refreshStream = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  const streamUrl = `https://${
    server === "vidWish" ? "vidwish.live" : "megaplay.buzz"
  }/stream/s-2/${episodeId.split("ep=").pop()}/${category}`;

  return (
    <div 
      className={`w-full relative transition-all duration-700 ease-in-out ${
        theaterMode ? "max-w-full px-0" : "max-w-7xl mx-auto px-4 md:px-0"
      }`}
    >
      {/* 💡 LIGHT DIMMER OVERLAY */}
      <div 
        id="light-dimmer" 
        onClick={() => setLightMode(true)}
        className="fixed inset-0 bg-black z-[80] transition-opacity duration-500 hidden pointer-events-auto cursor-pointer"
      />

      {/* 🎬 PLAYER CONTAINER */}
      <div
        className={`relative group aspect-video bg-black z-[90] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 ${
            theaterMode ? "rounded-none" : "rounded-3xl shadow-primary/5"
        }`}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <h1 className="text-white/50 font-black tracking-[0.3em] text-[10px] uppercase">
              Initializing Buffer...
            </h1>
          </div>
        )}

        <iframe
          id="anime-player"
          key={`${episodeId}-${server}-${category}-${refreshKey}`}
          src={streamUrl}
          width="100%"
          height="100%"
          allowFullScreen
          onLoad={() => setLoading(false)}
          title="Anime Player"
          className="relative z-10"
        ></iframe>
      </div>

      {/* 🎮 CONTROLS PANEL */}
      <div className={`mt-6 z-[95] relative p-1 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-xl transition-all duration-700 ${theaterMode ? "max-w-7xl mx-auto" : "w-full"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 px-6">
          
          <div className="flex items-center gap-3">
            <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
                {["vidWish", "megaPlay"].map((srv) => (
                <button
                    key={srv}
                    onClick={() => { setLoading(true); setServer(srv); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
                    server === srv ? "bg-white text-black" : "text-white/40 hover:text-white"
                    }`}
                >
                    {srv}
                </button>
                ))}
            </div>

            <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
                {["sub", "dub"].map((type) => (
                <button
                    key={type}
                    onClick={() => { setLoading(true); setCategory(type); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
                    category === type ? "bg-primary text-black" : "text-white/40 hover:text-white"
                    }`}
                >
                    {type}
                </button>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={refreshStream} title="Refresh Stream" className="p-3 rounded-full bg-white/5 text-white/70 hover:bg-white/10 transition-all active:rotate-180 duration-500">
              <TbRefresh size={18} />
            </button>

            <button onClick={() => setLightMode(!lightMode)} title="Focus Mode" className={`p-3 rounded-full transition-all ${!lightMode ? "bg-yellow-400 text-black" : "bg-white/5 text-white/70"}`}>
              {lightMode ? <TbBulb size={18} /> : <TbBulbOff size={18} />}
            </button>

            <div className="h-6 w-[1px] bg-white/10 mx-1" />

            <button onClick={() => changeEpisode("prev")} disabled={!hasPrevEp} className="disabled:opacity-20 p-3 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all">
                <TbPlayerTrackPrevFilled size={18} />
            </button>
            <button onClick={() => changeEpisode("next")} disabled={!hasNextEp} className="disabled:opacity-20 p-3 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all">
                <TbPlayerTrackNextFilled size={18} />
            </button>

            <button onClick={() => setTheaterMode(!theaterMode)} className={`p-3 rounded-full transition-all ${theaterMode ? "bg-primary text-black" : "bg-white/5 text-white/70"}`}>
              {theaterMode ? <FaCompress size={16} /> : <FaExpand size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-6 pl-4 border-l border-white/10">
            <label className="flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" checked={autoNext} onChange={() => setAutoNext(!autoNext)} />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              <span className="ml-3 text-[10px] uppercase font-bold text-white/40">Auto Next</span>
            </label>

            <div className="text-right">
                <p className="text-[9px] text-white/30 uppercase font-black">Playing</p>
                <h2 className="text-lg font-black text-white leading-none">EP {currentEp.episodeNumber}</h2>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-center gap-8 mt-6 opacity-30 group-hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-2 text-[10px] text-white uppercase font-bold">
            <span className="px-1.5 py-0.5 rounded border border-white/20">F</span> Fullscreen
         </div>
         <div className="flex items-center gap-2 text-[10px] text-white uppercase font-bold">
            <span className="px-1.5 py-0.5 rounded border border-white/20">L</span> Lights
         </div>
         <div className="flex items-center gap-2 text-[10px] text-white uppercase font-bold">
            <span className="px-1.5 py-0.5 rounded border border-white/20">N</span> Next
         </div>
      </div>
    </div>
  );
};

export default Player;