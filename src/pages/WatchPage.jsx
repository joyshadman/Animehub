/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi"; 
import PageNotFound from "./PageNotFound";
import { MdTableRows } from "react-icons/md";
import { HiMiniViewColumns } from "react-icons/hi2";
import { Helmet } from "react-helmet";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");
  const ep = searchParams.get("ep");

  // Fetching data
  const { data: epData, isError: epError, isLoading: epLoading } = useApi(`/episodes/${id}`);
  const { data: infoData } = useApi(`/info/${id}`);

  const episodes = useMemo(() => epData?.data || [], [epData]);
  const animeInfo = infoData?.data;

  // Title fallback to prevent Helmet errors and UI blank spots
  const cleanTitle = useMemo(() => {
    return animeInfo?.name || id?.replace(/-/g, " ").toUpperCase() || "Loading...";
  }, [animeInfo, id]);

  const currentEp = useMemo(() => {
    if (!episodes.length) return null;
    const found = episodes.find((e) => e.id.split("ep=").pop() === ep);
    return found || episodes[0];
  }, [episodes, ep]);

  const currentIndex = useMemo(() => {
    return episodes.findIndex(e => e.id === currentEp?.id);
  }, [episodes, currentEp]);

  const updateParams = (newEpValue) => {
    const cleanId = newEpValue.includes("ep=") ? newEpValue.split("ep=").pop() : newEpValue;
    setSearchParams({ ep: cleanId }, { replace: true });
  };

  /**
   * IMAGE LOADING FIX:
   * Wraps the raw URL in a proxy to bypass 403 Forbidden/Hotlink protection.
   */
  const getPoster = () => {
    const rawUrl = currentEp?.image || 
                   currentEp?.img || 
                   animeInfo?.poster || 
                   animeInfo?.image;
    
    if (!rawUrl) {
      return `https://placehold.co/600x400/111/ff9c00?text=${encodeURIComponent(cleanTitle)}`;
    }
    
    // Using images.weserv.nl as a proxy to force the image to load
    return `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&w=600&il`;
  };

  /**
   * DIRECT LOCALSTORAGE LOGIC:
   * Saves history without using a Zustand store.
   */
  useEffect(() => {
    if (currentEp && id) {
      const historyItem = {
        id: id,
        episodeId: currentEp.id,
        name: cleanTitle,
        episodeNumber: currentEp.episodeNumber,
        poster: getPoster(), // Saves the proxied URL
        updatedAt: Date.now()
      };

      // Get existing data
      const existingData = localStorage.getItem("now_playing");
      let historyArray = [];
      
      try {
        historyArray = JSON.parse(existingData) || [];
        if (!Array.isArray(historyArray)) historyArray = [];
      } catch (e) {
        historyArray = [];
      }

      // Filter out current anime to move it to the top
      const filteredHistory = historyArray.filter(item => item.id !== id);
      
      // Update and Limit to 15 items
      const newHistory = [historyItem, ...filteredHistory].slice(0, 15);
      
      localStorage.setItem("now_playing", JSON.stringify(newHistory));
    }
  }, [currentEp?.id, id, cleanTitle, animeInfo]);

  useEffect(() => {
    if (!ep && episodes.length > 0) {
      updateParams(episodes[0].id);
    }
  }, [ep, episodes]);

  if (epError) return <PageNotFound />;
  if (epLoading || !episodes.length) return <Loader className="h-screen" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 md:px-8">
      <Helmet>
        <title>{`Watching ${cleanTitle}`}</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full">
            <Link to="/home" className="text-white/40 hover:text-primary transition-all">HOME</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <Link to={`/anime/${id}`} className="text-white/80 truncate max-w-[250px]">{cleanTitle}</Link>
          </div>
          <div className="bg-primary text-black px-8 py-4 rounded-full">
            EP {currentEp?.episodeNumber || "1"}
          </div>
        </nav>

        <div className="relative group rounded-[3rem] overflow-hidden border border-white/10 bg-black/40">
          <Player
            episodeId={currentEp?.id}
            currentEp={currentEp}
            hasNextEp={currentIndex < episodes.length - 1}
            hasPrevEp={currentIndex > 0}
            changeEpisode={(dir) => {
                const target = episodes[currentIndex + (dir === 'next' ? 1 : -1)];
                if(target) updateParams(target.id);
            }}
          />
        </div>

        <div className="mt-16 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <div className="w-2 h-10 bg-primary rounded-full" /> Episodes
            </h3>
            <div className="flex bg-white/5 p-2 rounded-full border border-white/10">
              <button onClick={() => setLayout("row")} className={`p-4 rounded-full ${layout === "row" ? "bg-white text-black" : "text-white/30"}`}><MdTableRows size={22} /></button>
              <button onClick={() => setLayout("column")} className={`p-4 rounded-full ${layout === "column" ? "bg-white text-black" : "text-white/30"}`}><HiMiniViewColumns size={22} /></button>
            </div>
          </div>
          <div className={`grid gap-5 p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 ${layout === "row" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12"}`}>
            {episodes.map((episode) => (
              <Episodes key={episode.id} episode={episode} currentEp={currentEp} layout={layout} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;