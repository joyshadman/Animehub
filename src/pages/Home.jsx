/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useApi } from "../services/useApi";
import useGenresStore from "../store/genresStore";
import useTopTenStore from "../store/toptenStore";

import Loader from "../components/Loader";
import HeroBanner from "../components/HeroBanner";
import TrendingLayout from "../layouts/TrendingLayout";
import NowPlayingLayout from "../layouts/NowPlayingLayout";
import DynamicLayout from "../layouts/DynamicLayout";
import MainLayout from "../layouts/MainLayout";
import GenresLayout from "../layouts/GenresLayout";
import Top10Layout from "../layouts/Top10Layout";
import Footer from "../components/Footer";
import Schedule from "../components/Schedule"; 

import notify from "../utils/Toast";
import { genres } from "../utils/genres";

// --- 🎇 PREMIUM VIEWPORT VARIANTS ---
const sectionReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15,
      mass: 1
    }
  }
};

const Home = () => {
  const { data, isLoading, isError, error } = useApi("/home");
  const setGenres = useGenresStore((state) => state.setGenres);
  const setTopTen = useTopTenStore((state) => state.setTopTen);
  const [nowPlaying, setNowPlaying] = useState([]);

  // --- 🔄 SYNC WATCH HISTORY ---
  const syncHistory = () => {
    const savedData = localStorage.getItem("now_playing");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setNowPlaying(Array.isArray(parsedData) ? parsedData : [parsedData]);
      } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    setGenres(genres);
    syncHistory();
    window.addEventListener('focus', syncHistory);
    window.addEventListener('storage', syncHistory); 
    return () => {
      window.removeEventListener('focus', syncHistory);
      window.removeEventListener('storage', syncHistory);
    };
  }, []);

  useEffect(() => {
    if (data?.data) setTopTen(data.data.topTen);
  }, [data]);

  const handleClearHistory = () => {
    localStorage.removeItem("now_playing");
    setNowPlaying([]);
    notify("success", "Watch history cleared");
  };

  if (isError) {
    notify("error", error.message || "Failed to fetch home data");
    return null;
  }

  return (
    <HelmetProvider>
      {/* FIX 1: Removed 'relative' and 'overflow-x-hidden' from the top div if it conflicts 
        with the main layout. Ensure 'overflow-x-clip' is used to prevent horizontal 
        scroll without killing sticky elements.
      */}
      <div className="min-h-screen bg-[#050505] overflow-x-clip">
        <Helmet>
          <title>AniStorm | Watch Anime Online in High Quality</title>
          <meta name="description" content="Stream your favorite anime for free on AniStorm with a modern, cinematic experience." />
        </Helmet>

        {isLoading ? (
          <Loader className="h-[100dvh]" />
        ) : (
          <div className="w-full">
            
            {/* ⚡ 1. HERO BANNER */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full overflow-hidden"
            >
              <HeroBanner slides={data?.data?.spotlight} />
            </motion.div>

            {/* FIX 2: Added 'max-w-full' to container to ensure it never exceeds viewport width 
            */}
            <div className="xl:mx-10 px-2 sm:px-4 relative z-10 max-w-full">
              
              {/* 2. TRENDING */}
              <motion.section 
                className="mt-8"
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <TrendingLayout data={data?.data?.trending} />
              </motion.section>

              {/* 3. NOW PLAYING */}
              <AnimatePresence mode="wait">
                {nowPlaying.length > 0 && (
                  <motion.div
                    key="history-section"
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    viewport={{ once: true }}
                    className="my-12"
                  >
                    <NowPlayingLayout data={nowPlaying} onClear={handleClearHistory} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. DYNAMIC LINKS GRID */}
              <div className="grid grid-cols-12 gap-4 my-16">
                {[
                  { title: "Top Airing", end: "top-airing", d: data?.data?.topAiring },
                  { title: "Most Popular", end: "most-popular", d: data?.data?.mostPopular },
                  { title: "Most Favorite", end: "most-favorite", d: data?.data?.mostFavorite },
                  { title: "Latest Completed", end: "completed", d: data?.data?.latestCompleted }
                ].map((item, i) => (
                  <motion.div 
                    key={item.title}
                    className="col-span-12 md:col-span-6 lg:col-span-3"
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: i * 0.1, 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 15 
                    }}
                  >
                    <DynamicLayout title={item.title} endpoint={item.end} data={item.d} />
                  </motion.div>
                ))}
              </div>

              {/* 5. MAIN CONTENT & SIDEBAR */}
              <div className="grid grid-cols-12 gap-6 my-10">
                
                {/* 🏰 LEFT COLUMN */}
                <div className="col-span-12 xl:col-span-9 space-y-24">
                  {[
                    { t: "Latest Episode", e: "recently-updated", d: data?.data?.latestEpisode },
                    { t: "New Added", e: "recently-added", d: data?.data?.newAdded },
                    { t: "Top Upcoming", e: "top-upcoming", d: data?.data?.topUpcoming }
                  ].map((section, idx) => (
                    <motion.div
                      key={section.t}
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ 
                          duration: 1, 
                          delay: idx * 0.1, 
                          ease: [0.22, 1, 0.36, 1] 
                      }}
                    >
                      <MainLayout title={section.t} endpoint={section.e} data={section.d} />
                    </motion.div>
                  ))}
                </div>

                {/* 🏮 RIGHT COLUMN */}
                {/* FIX 3: Removed 'sticky' from the aside if the parent column doesn't have 
                   defined height, or ensure the parent div is 'relative'.
                */}
                <aside className="col-span-12 xl:col-span-3 h-full relative">
                  <div className="sticky top-24 space-y-12 pb-10">
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="absolute -inset-2 bg-orange-500/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
                      <Schedule />
                    </motion.div>

                    <motion.div
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                    >
                      <GenresLayout />
                    </motion.div>

                    <motion.div
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                    >
                      <Top10Layout />
                    </motion.div>
                  </div>
                </aside>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-20"
              >
                <Footer />
              </motion.div>

            </div>
          </div>
        )}
      </div>
      
      {/* FIX 4: Global CSS injection to kill any hidden scrollbars on the body 
         that might be caused by Framer Motion animations.
      */}
      <style>{`
        body {
          overflow-x: hidden !important;
          width: 100vw;
        }
        /* Fixes for potential double scrollbars on layouts */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </HelmetProvider>
  );
};

export default Home;