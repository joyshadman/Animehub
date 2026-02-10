import useSidebarStore from "../store/sidebarStore";
import { Link, useLocation } from "react-router-dom";
import Genres from "./Genres";
import { useEffect } from "react";
import { FaAngleRight, FaXmark } from "react-icons/fa6"; 
import { motion, AnimatePresence } from "framer-motion";
import "./sidebar.css";

const Sidebar = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);

  const location = useLocation();
  const key = location.key;

  useEffect(() => {
    if (isSidebarOpen) sidebarHandler();
  }, [key]);

const list = [
    { name: "Home", link: "/home" },
    { name: "About", link: "/about" }, // Added About Page
    { name: "Subbed Anime", link: "/animes/subbed-anime" },
    { name: "Dubbed Anime", link: "/animes/dubbed-anime" },
    { name: "Most Popular", link: "/animes/most-popular" },
    { name: "Top Airing", link: "/animes/top-airing" },
    { name: "Most Favorite", link: "/animes/most-favorite" },
    { name: "Latest Completed", link: "/animes/completed" },
    { name: "Recently Added", link: "/animes/recently-added" },
    { name: "Recently Updated", link: "/animes/recently-updated" },
    { name: "Top Upcoming", link: "/animes/top-upcoming" },
    { name: "A-Z List", link: "/animes/az-list" },
    { name: "Movies", link: "/animes/movie" },
    { name: "OVAs", link: "/animes/ova" },
    { name: "ONAs", link: "/animes/ona" },
    { name: "Specials", link: "/animes/special" },
  ];

  return (
    <>
      {/* 🌑 PREMIMUM BACKDROP BLUR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={sidebarHandler}
            className="fixed inset-0 bg-black/40 backdrop-blur-[8px] z-[998]"
          />
        )}
      </AnimatePresence>

      {/* 📱 SIDEBAR PANEL */}
      <div
        className={`fixed top-0 left-0 h-screen z-[999] w-[280px] md:w-[320px] bg-[#080808]/90 backdrop-blur-3xl transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] border-r border-white/5 shadow-[30px_0_60px_rgba(0,0,0,0.8)] flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER: APPLE STYLE */}
        <div className="p-6 pt-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-primary font-black uppercase italic tracking-[0.2em] text-[10px]">Navigation</span>
            <h2 className="text-white text-xl font-black italic tracking-tighter">BROWSE</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
            onClick={sidebarHandler}
          >
            <FaXmark size={18} />
          </motion.button>
        </div>

        {/* SCROLLABLE LINKS */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-10">
          <ul className="space-y-1">
            {list.map((item, index) => (
              <motion.li
                key={item.link}
                initial={{ x: -30, opacity: 0 }}
                animate={isSidebarOpen ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 20, 
                    delay: index * 0.04 
                }}
              >
                <Link
                  to={item.link}
                  className="group relative flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle hover glow background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <span className="relative z-10 text-white/50 group-hover:text-white font-bold text-sm md:text-base transition-colors uppercase italic tracking-tight">
                    {item.name}
                  </span>
                  
                  <FaAngleRight className="relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" size={14} />
                </Link>
              </motion.li>
            ))}
            
            {/* GENRES HEADER */}
            <li className="pt-10 pb-4 px-4">
              <div className="flex items-center gap-3">
                 <div className="h-[1px] flex-1 bg-white/5" />
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Genres</span>
                 <div className="h-[1px] flex-1 bg-white/5" />
              </div>
            </li>
            
            <div className="px-2">
              <Genres
                event={sidebarHandler}
                className="w-full"
              />
            </div>
          </ul>
        </div>

        {/* FOOTER AREA (Optional App Version/Credits) */}
        <div className="p-6 border-t border-white/5 text-center">
             <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">JoyNime v2.0</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;