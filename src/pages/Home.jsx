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

const Home = () => {
  const { data, isLoading, isError, error } = useApi("/home");
  const setGenres = useGenresStore((state) => state.setGenres);
  const setTopTen = useTopTenStore((state) => state.setTopTen);

  // 🛠️ Changed state to an empty array to support multiple animes
  const [nowPlaying, setNowPlaying] = useState([]);

  const syncHistory = () => {
    const savedData = localStorage.getItem("now_playing");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // 🛠️ Ensure we are dealing with an array. 
        // If it's an old single object, wrap it in an array so the map doesn't crash.
        setNowPlaying(Array.isArray(parsedData) ? parsedData : [parsedData]);
      } catch (e) {
        console.error("Error parsing history", e);
      }
    } else {
      setNowPlaying([]);
    }
  };

  useEffect(() => {
    setGenres(genres);
    syncHistory();
    // Listen for storage changes in other tabs or focus
    window.addEventListener('focus', syncHistory);
    window.addEventListener('storage', syncHistory); 
    return () => {
      window.removeEventListener('focus', syncHistory);
      window.removeEventListener('storage', syncHistory);
    };
  }, []);

  useEffect(() => {
    if (data?.data) {
      setTopTen(data.data.topTen);
    }
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Helmet>
        <title>Watch Anime Online | JoyNime</title>
      </Helmet>

      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
          <HeroBanner slides={data?.data?.spotlight} />

          <div className="xl:mx-10 px-2 sm:px-4">
            
            {/* 1. TRENDING */}
            <section className="mt-8">
              <TrendingLayout data={data?.data?.trending} />
            </section>

            {/* 2. NOW PLAYING (Moved up for better UX) */}
            <AnimatePresence mode="wait">
              {nowPlaying.length > 0 && (
                <motion.div
                  key="now-playing-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                >
                  <NowPlayingLayout data={nowPlaying} onClear={handleClearHistory} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. GRID QUICK LINKS */}
            <div className="grid grid-cols-12 gap-4 my-8">
              <DynamicLayout title="Top Airing" endpoint="top-airing" data={data?.data?.topAiring} />
              <DynamicLayout title="Most Popular" endpoint="most-popular" data={data?.data?.mostPopular} />
              <DynamicLayout title="Most Favorite" endpoint="most-favorite" data={data?.data?.mostFavorite} />
              <DynamicLayout title="Latest Completed" endpoint="completed" data={data?.data?.latestCompleted} />
            </div>

            {/* 4. MAIN CONTENT */}
            <div className="grid grid-cols-12 gap-6 my-10">
              <div className="col-span-12 xl:col-span-9 space-y-10">
                <MainLayout title="Latest Episode" endpoint="recently-updated" data={data?.data?.latestEpisode} />
                <MainLayout title="New Added" endpoint="recently-added" data={data?.data?.newAdded} />
                <MainLayout title="Top Upcoming" endpoint="top-upcoming" data={data?.data?.topUpcoming} />
              </div>

              <aside className="col-span-12 xl:col-span-3 space-y-8">
                <div className="sticky top-24">
                  <GenresLayout />
                  <div className="mt-8">
                    <Top10Layout />
                  </div>
                </div>
              </aside>
            </div>

            <Footer />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;