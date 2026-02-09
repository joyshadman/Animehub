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

  // 📡 API CALLS
  // Fix: Ensure we are fetching the base episode list for the anime ID
  const { data: epData, isError: epError } = useApi(`/episodes/${id}`);
  const episodes = epData?.data;

  const cleanTitle = useMemo(() => {
    return id.replace(/-\d+$/, "").replace(/-/g, " ").toUpperCase();
  }, [id]);

  const seriesId = useMemo(() => {
    return id.replace(/-\d+$/, "");
  }, [id]);

  // 🛠️ FIX: Improved Param Updater
  const updateParams = (newEpValue) => {
    setSearchParams({ ep: newEpValue }, { replace: true });
  };

  useEffect(() => {
    if (ep && episodes && episodes.length > 0) {
      const current = episodes.find((e) => e.id.split("ep=").pop() === ep) || episodes[0];
      
      // 🛠️ FIX: Use a more reliable image source since flawlessanime is down
      // This uses a common anime image proxy or the internal data
      const backupPoster = `https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/default.jpg`;
      const posterImg = current.poster || current.image || backupPoster;

      const historyItem = {
        id: id,
        episodeId: current.id,
        name: cleanTitle,
        episodeNumber: current.episodeNumber,
        poster: posterImg, 
        updatedAt: Date.now()
      };

      const existingHistory = JSON.parse(localStorage.getItem("now_playing") || "[]");
      const filteredHistory = Array.isArray(existingHistory) 
        ? existingHistory.filter(item => item.id !== id)
        : [];

      const updatedHistory = [historyItem, ...filteredHistory].slice(0, 12);
      localStorage.setItem("now_playing", JSON.stringify(updatedHistory));
    }
  }, [ep, episodes, id, cleanTitle]);

  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEp = episodes[0].id.split("ep=").pop();
      updateParams(firstEp);
    }
  }, [ep, episodes]);

  if (epError) return <PageNotFound />;
  if (!episodes) return <Loader className="h-screen" />;

  const currentEp = episodes.find((e) => e.id.split("ep=").pop() === ep) || episodes[0];

  const changeEpisode = (action) => {
    const currentIndex = episodes.findIndex(e => e.id === currentEp.id);
    const targetEp = action === "next" ? episodes[currentIndex + 1] : episodes[currentIndex - 1];
    if (targetEp) {
        const nextId = targetEp.id.split("ep=").pop();
        updateParams(nextId);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-10 px-4 md:px-8">
      <Helmet>
        <title>Watching {cleanTitle} | JoyNime</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black">
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 px-6 py-3 rounded-full">
            <Link to="/home" className="text-white/40 hover:text-primary">HOME</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <Link to={`/anime/${seriesId}`} className="text-white truncate max-w-[200px]">{cleanTitle}</Link>
          </div>
          <div className="bg-primary text-black px-6 py-3 rounded-full">EP {currentEp?.episodeNumber}</div>
        </nav>

        <div className="relative group">
            <Player
              id={id}
              // 🛠️ FIX: construct the ID cleanly without double colons
              episodeId={currentEp.id} 
              currentEp={currentEp}
              changeEpisode={changeEpisode}
              hasNextEp={Boolean(episodes[episodes.findIndex(e => e.id === currentEp.id) + 1])}
              hasPrevEp={Boolean(episodes[episodes.findIndex(e => e.id === currentEp.id) - 1])}
            />
        </div>

        {/* ... rest of your layout */}
        <div className="mt-14 space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-4">
             <div className="w-1.5 h-8 bg-primary rounded-full" />
             Episodes
          </h3>
          <div className={`grid gap-4 p-6 bg-white/[0.02] rounded-[2.5rem] border border-white/10 ${
            layout === "row" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12"
          }`}>
            {episodes?.map((episode) => (
              <Episodes key={episode.id} episode={episode} currentEp={currentEp} layout={layout} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;