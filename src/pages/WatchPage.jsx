/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  // Clean Title Logic (Removes IDs like -123 and replaces dashes)
  const cleanTitle = useMemo(() => {
    if (animeInfo?.name) return animeInfo.name;
    return id?.replace(/-\d+$/, "")?.replace(/-/g, " ")?.toUpperCase() || "Loading...";
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
    const rawUrl = currentEp?.image || currentEp?.img || animeInfo?.poster || animeInfo?.image;
    if (!rawUrl) return `https://placehold.co/600x400/111/ff9c00?text=${encodeURIComponent(cleanTitle)}`;
    return `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&w=600&il`;
  };

  // --- High-End Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const playerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#050505] text-white pt-20 md:pt-24 pb-12 px-2 md:px-8"
    >
      <Helmet>
        <title>{`Watching ${cleanTitle}`}</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 mt-20">
        
        {/* BREADCRUMB */}
        <motion.nav variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-[10px] uppercase tracking-widest font-black">
          <div className="flex items-center w-full sm:w-auto gap-2 md:gap-3 bg-white/5 border border-white/10 px-4 md:px-8 py-3 md:py-4 rounded-full overflow-hidden">
            <Link to="/home" className="text-white/40 hover:text-primary transition-all shrink-0">HOME</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
            <Link to={`/anime/${id}`} className="text-white/80 truncate max-w-[150px] md:max-w-[250px] hover:text-primary transition-colors">
              {cleanTitle}
            </Link>
          </div>
          
          <div className="bg-primary text-black px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center justify-center self-end sm:self-auto shrink-0 shadow-lg shadow-primary/20">
            EP {currentEp?.episodeNumber || "1"}
          </div>
        </motion.nav>

        {/* PLAYER CONTAINER */}
        <motion.div 
          variants={playerVariants}
          className="relative group rounded-2xl md:rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <Player
            episodeId={currentEp?.id}
            currentEp={currentEp}
            hasNextEp={currentIndex < episodes.length - 1}
            hasPrevEp={currentIndex > 0}
            animeData={animeInfo}
            changeEpisode={(dir) => {
                const target = episodes[currentIndex + (dir === 'next' ? 1 : -1)];
                if(target) updateParams(target.id);
            }}
          />
        </motion.div>

        {/* EPISODES SECTION */}
        <motion.div variants={itemVariants} className="mt-12 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 md:px-4">
            <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3 md:gap-4">
              <div className="w-2 h-8 md:h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" /> 
              Episodes
            </h3>
            
            <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 self-end sm:self-auto backdrop-blur-md">
              <button 
                onClick={() => setLayout("row")} 
                className={`p-3 md:p-4 rounded-full transition-all duration-300 ${layout === "row" ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white/60"}`}
              >
                <MdTableRows size={20} />
              </button>
              <button 
                onClick={() => setLayout("column")} 
                className={`p-3 md:p-4 rounded-full transition-all duration-300 ${layout === "column" ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white/60"}`}
              >
                <HiMiniViewColumns size={20} />
              </button>
            </div>
          </div>

          <motion.div 
            layout
            className={`grid gap-3 md:gap-6 p-4 md:p-10 bg-white/[0.01] rounded-3xl md:rounded-[3.5rem] border border-white/5 shadow-inner ${
              layout === "row" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {episodes.map((episode) => (
                <motion.div
                  key={episode.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Episodes episode={episode} currentEp={currentEp} layout={layout} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WatchPage;