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

  // Title fallback
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

  const getPoster = () => {
    const rawUrl = currentEp?.image || 
                    currentEp?.img || 
                    animeInfo?.poster || 
                    animeInfo?.image;
    
    if (!rawUrl) {
      return `https://placehold.co/600x400/111/ff9c00?text=${encodeURIComponent(cleanTitle)}`;
    }
    return `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&w=600&il`;
  };

  useEffect(() => {
    if (currentEp && id) {
      const historyItem = {
        id: id,
        episodeId: currentEp.id,
        name: cleanTitle,
        episodeNumber: currentEp.episodeNumber,
        poster: getPoster(),
        updatedAt: Date.now()
      };

      const existingData = localStorage.getItem("now_playing");
      let historyArray = [];
      
      try {
        historyArray = JSON.parse(existingData) || [];
        if (!Array.isArray(historyArray)) historyArray = [];
      } catch (e) {
        historyArray = [];
      }

      const filteredHistory = historyArray.filter(item => item.id !== id);
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
    <div className="min-h-screen bg-[#050505] text-white pt-20 md:pt-24 pb-12 px-2 md:px-8">
      <Helmet>
        <title>{`Watching ${cleanTitle}`}</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* RESPONSIVE BREADCRUMB */}
        <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-[10px] uppercase tracking-widest font-black">
          <div className="flex items-center w-full sm:w-auto gap-2 md:gap-3 bg-white/5 border border-white/10 px-4 md:px-8 py-3 md:py-4 rounded-full overflow-hidden">
            <Link to="/home" className="text-white/40 hover:text-primary transition-all shrink-0">HOME</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
            <Link to={`/anime/${id}`} className="text-white/80 truncate max-w-[150px] md:max-w-[250px] hover:text-primary transition-colors">
              {cleanTitle}
            </Link>
          </div>
          
          <div className="bg-primary text-black px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center justify-center self-end sm:self-auto shrink-0 shadow-lg shadow-primary/10">
            EP {currentEp?.episodeNumber || "1"}
          </div>
        </nav>

        {/* PLAYER CONTAINER */}
        <div className="relative group rounded-2xl md:rounded-[3rem] overflow-hidden border border-white/10 bg-black/40">
          <Player
            episodeId={currentEp?.id}
            currentEp={currentEp}
            hasNextEp={currentIndex < episodes.length - 1}
            hasPrevEp={currentIndex > 0}
            animeData={animeInfo} // Passing animeInfo so player has season data
            changeEpisode={(dir) => {
                const target = episodes[currentIndex + (dir === 'next' ? 1 : -1)];
                if(target) updateParams(target.id);
            }}
          />
        </div>

        {/* EPISODES SECTION */}
        <div className="mt-12 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 md:px-4">
            <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 md:gap-4">
              <div className="w-2 h-8 md:h-10 bg-primary rounded-full" /> Episodes
            </h3>
            
            <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 self-end sm:self-auto">
              <button 
                onClick={() => setLayout("row")} 
                className={`p-3 md:p-4 rounded-full transition-all ${layout === "row" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}
              >
                <MdTableRows size={18} />
              </button>
              <button 
                onClick={() => setLayout("column")} 
                className={`p-3 md:p-4 rounded-full transition-all ${layout === "column" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}
              >
                <HiMiniViewColumns size={18} />
              </button>
            </div>
          </div>

          <div className={`grid gap-3 md:gap-5 p-4 md:p-8 bg-white/[0.02] rounded-3xl md:rounded-[3rem] border border-white/5 ${
            layout === "row" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12"
          }`}>
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