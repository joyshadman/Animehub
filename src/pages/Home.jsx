/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
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
    notify("error", error.message);
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      <Helmet>
        <title>Watch Anime Online | JoyNime</title>
      </Helmet>

      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <div className="relative">
          {/* ⚡ 1. HERO BANNER - SLOW PAN REVEAL */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroBanner slides={data?.data?.spotlight} />
          </motion.div>

          <div className="xl:mx-10 px-2 sm:px-4 relative z-10">
            
            {/* 2. TRENDING - ELASTIC REVEAL */}
            <motion.section 
              className="mt-8"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <TrendingLayout data={data?.data?.trending} />
            </motion.section>

            {/* 3. NOW PLAYING - POP & SLIDE */}
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

            {/* 4. DYNAMIC LINKS - STAGGERED GRID POP */}
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
                    delay: i * 0.15, 
                    type: "spring", 
                    stiffness: 120, 
                    damping: 12 
                  }}
                >
                  <DynamicLayout title={item.title} endpoint={item.end} data={item.d} />
                </motion.div>
              ))}
            </div>

            {/* 5. MAIN CONTENT - SMOOTH LEFT/RIGHT FLY-IN */}
            <div className="grid grid-cols-12 gap-6 my-10">
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

              {/* 6. ASIDE - GHOST REVEAL */}
              <aside className="col-span-12 xl:col-span-3">
                <motion.div 
                  className="sticky top-24 space-y-12"
                  initial={{ opacity: 0, x: 60, filter: "brightness(0)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "brightness(1)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "anticipate" }}
                >
                  <GenresLayout />
                  <div className="mt-8">
                    <Top10Layout />
                  </div>
                </motion.div>
              </aside>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Footer />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;