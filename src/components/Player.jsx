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
  animeData,
}) => {
  const [category, setCategory] = useState(localStorage.getItem("anime_category") || "sub");
  const [server, setServer] = useState(localStorage.getItem("anime_server") || "vidWish");
  const [autoNext, setAutoNext] = useState(JSON.parse(localStorage.getItem("anime_autonext") ?? "true"));
  const [skipFiller, setSkipFiller] = useState(JSON.parse(localStorage.getItem("anime_skipfiller") ?? "false"));
  
  const [theaterMode, setTheaterMode] = useState(false);
  const [lightMode, setLightMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // 💾 SAVE HISTORY
  useEffect(() => {
    if (currentEp && animeData) {
      const historyItem = {
        id: animeData.id,
        name: animeData.name,
        poster: animeData.poster || animeData.image,
        episodeNumber: currentEp.episodeNumber,
        episodeId: episodeId,
        updatedAt: Date.now(),
      };
      const existingData = JSON.parse(localStorage.getItem("now_playing") || "[]");
      const filtered = existingData.filter(item => item.id !== animeData.id);
      const newHistory = [historyItem, ...filtered].slice(0, 15);
      localStorage.setItem("now_playing", JSON.stringify(newHistory));
    }
  }, [episodeId, currentEp, animeData]);

  // ⚙️ PERSISTENCE
  useEffect(() => {
    localStorage.setItem("anime_category", category);
    localStorage.setItem("anime_server", server);
    localStorage.setItem("anime_autonext", autoNext);
    localStorage.setItem("anime_skipfiller", skipFiller);
  }, [category, server, autoNext, skipFiller]);

  // ⚡ SKIP FILLER
  useEffect(() => {
    if (skipFiller && currentEp?.isFiller && hasNextEp) {
      changeEpisode("next");
    }
  }, [skipFiller, currentEp, hasNextEp, changeEpisode]);

  // ⌨️ SHORTCUTS
  const toggleFullscreen = () => {
    const iframe = document.getElementById("anime-player");
    if (!document.fullscreenElement) iframe?.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleKeydown = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (key === 'f') { e.preventDefault(); toggleFullscreen(); }
    if (key === 'l') { setLightMode(prev => !prev); }
    if ((key === 'n' || e.key === 'ArrowRight') && hasNextEp) { changeEpisode("next"); }
    if ((key === 'p' || e.key === 'ArrowLeft') && hasPrevEp) { changeEpisode("prev"); }
  }, [hasNextEp, hasPrevEp, changeEpisode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  // 💡 LIGHTS OUT
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

  const refreshStream = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  const streamUrl = `https://${
    server === "vidWish" ? "vidwish.live" : "megaplay.buzz"
  }/stream/s-2/${episodeId.split("ep=").pop()}/${category}`;

  return (
    <div className={`w-full relative transition-all duration-700 ease-in-out ${theaterMode ? "max-w-full" : "max-w-7xl mx-auto px-0 md:px-4"}`}>
      
      <div id="light-dimmer" onClick={() => setLightMode(true)} className="fixed inset-0 bg-black z-[80] transition-opacity duration-500 hidden pointer-events-auto cursor-pointer" />

      {/* PLAYER CONTAINER */}
      <div className={`relative group aspect-video bg-black z-[90] overflow-hidden transition-all duration-700 ${theaterMode ? "rounded-none" : "rounded-none md:rounded-3xl border border-white/10 shadow-2xl"}`}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-20">
            <div className="w-12 h-12 border-4 border-[#ffb700]/20 border-t-[#ffb700] rounded-full animate-spin mb-4"></div>
            <h1 className="text-white/50 font-black tracking-[0.3em] text-[10px] uppercase">Initiating Storm...</h1>
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

      {/* 🎮 RESPONSIVE CONTROLS PANEL */}
      <div className={`mt-4 md:mt-6 z-[95] relative p-1 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[2.5rem] shadow-xl transition-all duration-700 ${theaterMode ? "max-w-7xl mx-auto mb-10" : "w-full"}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 md:px-8">
          
          {/* LEFT: SERVERS & CATEGORY */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
            <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
                {["vidWish", "megaPlay"].map((srv) => (
                <button key={srv} onClick={() => { setLoading(true); setServer(srv); }} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${server === srv ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}>
                    {srv}
                </button>
                ))}
            </div>
            <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
                {["sub", "dub"].map((type) => (
                <button key={type} onClick={() => { setLoading(true); setCategory(type); }} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${category === type ? "bg-[#ffb700] text-black shadow-lg shadow-[#ffb700]/20" : "text-white/40 hover:text-white"}`}>
                    {type}
                </button>
                ))}
            </div>
          </div>

          {/* MIDDLE: PLAYBACK TOOLS */}
          <div className="flex items-center justify-center gap-2 w-full lg:w-auto">
            <button onClick={refreshStream} title="Refresh" className="p-3 rounded-full bg-white/5 text-white/70 hover:bg-white/10 transition-all active:rotate-180 duration-500">
              <TbRefresh size={20} />
            </button>
            <button onClick={() => setLightMode(!lightMode)} title="Focus Mode" className={`p-3 rounded-full transition-all ${!lightMode ? "bg-[#ffb700] text-black shadow-lg" : "bg-white/5 text-white/70"}`}>
              {lightMode ? <TbBulb size={20} /> : <TbBulbOff size={20} />}
            </button>

            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

            <div className="flex items-center gap-2">
                <button onClick={() => changeEpisode("prev")} disabled={!hasPrevEp} className="disabled:opacity-20 p-3 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all">
                    <TbPlayerTrackPrevFilled size={20} />
                </button>
                <button onClick={() => changeEpisode("next")} disabled={!hasNextEp} className="disabled:opacity-20 p-3 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all">
                    <TbPlayerTrackNextFilled size={20} />
                </button>
            </div>

            <button onClick={() => setTheaterMode(!theaterMode)} className={`p-3 rounded-full transition-all ${theaterMode ? "bg-[#ffb700] text-black shadow-lg" : "bg-white/5 text-white/70"}`}>
              {theaterMode ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
          </div>

          {/* RIGHT: BREADCRUMB & TOGGLES */}
          <div className="flex items-center justify-center lg:justify-end gap-8 w-full lg:w-auto lg:pl-8 lg:border-l border-white/10">
            <div className="flex flex-col gap-2">
                <label className="relative flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" checked={autoNext} onChange={() => setAutoNext(!autoNext)} />
                    <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-[#ffb700] transition-all after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner"></div>
                    <span className="ml-3 text-[10px] uppercase font-black text-white/30 peer-checked:text-[#ffb700] transition-colors tracking-widest">Auto Next</span>
                </label>

                <label className="relative flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" checked={skipFiller} onChange={() => setSkipFiller(!skipFiller)} />
                    <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-orange-500 transition-all after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner"></div>
                    <span className="ml-3 text-[10px] uppercase font-black text-white/30 peer-checked:text-orange-500 transition-colors tracking-widest">Skip Filler</span>
                </label>
            </div>

            {/* THE BREADCRUMB / EPISODE INDICATOR */}
            <div className="text-right flex flex-col items-end">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest leading-none mb-1">Session</p>
                <div className="flex items-center gap-2">
                  {currentEp?.isFiller && <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" />}
                  <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter leading-none">EP {currentEp.episodeNumber}</h2>
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* DESKTOP HINTS */}
      <div className="hidden md:flex justify-center gap-10 mt-8 opacity-20 hover:opacity-100 transition-opacity duration-500">
         <div className="flex items-center gap-2 text-[10px] text-white uppercase font-black tracking-widest">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">F</span> Fullscreen
         </div>
         <div className="flex items-center gap-2 text-[10px] text-white uppercase font-black tracking-widest">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">L</span> Lights
         </div>
         <div className="flex items-center gap-2 text-[10px] text-white uppercase font-black tracking-widest">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">N</span> Next
         </div>
      </div>
    </div>
  );
};

export default Player;