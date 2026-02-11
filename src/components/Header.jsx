/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { FaBars, FaSearch, FaArrowCircleRight } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { useApi } from "../services/useApi"; 
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [hoveredPath, setHoveredPath] = useState(null);
  const timeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. 🔍 SEARCH LOGIC
  const changeInput = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, 500);
  };

  const { data, isLoading } = useApi(
    debouncedValue.length > 2 ? `/suggestion?keyword=${debouncedValue}` : null
  );

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
      resetSearch();
    }
  };

  const navigateToAnimePage = (id) => {
    navigate(`/anime/${id}`);
    resetSearch();
  };

  const resetSearch = () => {
    setValue("");
    setDebouncedValue("");
    setShowSearch(false);
  };

  // 2. 📱 SCREEN SIZE & SCROLL LOGIC
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isDesktop = windowWidth >= 1024;

  const headerWidth = useTransform(
    scrollY, 
    [0, 200], 
    isDesktop ? ["90%", "65%"] : ["95%", "95%"]
  );

  const headerScale = useTransform(
    scrollY, 
    [0, 200], 
    isDesktop ? [1, 0.98] : [1, 1]
  );

  const smoothWidth = useSpring(headerWidth, { stiffness: 200, damping: 25 });
  const smoothScale = useSpring(headerScale, { stiffness: 200, damping: 25 });

  const navLinks = [
    { name: "Home", link: "/home" },
    { name: "About", link: "/about" },
    { name: "Most Popular", link: "/animes/most-popular" },
    { name: "Updated", link: "/animes/recently-updated" },
  ];

  return (
    <div className="fixed top-4 md:top-6 inset-x-0 z-[999] flex justify-center pointer-events-none">
      <motion.div 
        style={{ 
          width: isDesktop ? smoothWidth : "95%", 
          scale: isDesktop ? smoothScale : 1 
        }} 
        className="relative pointer-events-auto will-change-transform"
      >
        
        <div 
          style={{ 
            backdropFilter: "blur(20px) saturate(160%)", 
            WebkitBackdropFilter: "blur(20px) saturate(160%)"
          }}
          className={`relative rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 overflow-hidden ${
            isScrolled 
              ? "bg-black/40 border-white/20 shadow-2xl py-3 px-5" 
              : "bg-black/20 border-white/10 py-4 px-6 md:px-10"
          }`}
        >
          {/* TOP BAR */}
          <div className="flex justify-between items-center relative z-20">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1, color: "#ff9500" }} 
                onClick={sidebarHandler} 
                className="text-white/80"
              >
                <FaBars size={22} />
              </motion.button>
              <div onClick={() => { navigate("/home"); resetSearch(); }} className="cursor-pointer">
                <Logo />
              </div>
            </div>

            <nav 
              className="hidden lg:flex items-center gap-1" 
              onMouseLeave={() => setHoveredPath(null)}
            >
              {navLinks.map((item) => (
                <motion.button
                  key={item.link}
                  onMouseEnter={() => setHoveredPath(item.link)}
                  onClick={() => navigate(item.link)}
                  className={`relative px-4 py-2 text-[11px] font-black italic uppercase tracking-tighter transition-all duration-300 ${
                    hoveredPath === item.link || location.pathname === item.link 
                      ? "text-primary" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <AnimatePresence>
                    {hoveredPath === item.link && (
                      <motion.div layoutId="nav-hover-bg" className="absolute inset-0 bg-white/5 rounded-full -z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    )}
                  </AnimatePresence>
                  {location.pathname === item.link && (
                    <motion.div layoutId="nav-active-line" className="absolute -bottom-1 left-4 right-4 h-[1.5px] bg-primary rounded-full" />
                  )}
                </motion.button>
              ))}
            </nav>

            <div className="flex items-center">
              <motion.button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-3 rounded-full transition-all ${showSearch ? "bg-primary text-black" : "text-white/60 hover:text-white"}`}
              >
                {showSearch ? <FaXmark size={20} /> : <FaSearch size={20} />}
              </motion.button>
            </div>
          </div>

          {/* 🔍 SEARCH AREA */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    autoFocus
                    value={value}
                    onChange={changeInput}
                    placeholder="Search AniStorm..."
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary/50 transition-all"
                  />
                  {value.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => { setValue(""); setDebouncedValue(""); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                    >
                      <FaXmark />
                    </button>
                  )}
                </form>

                {/* 📋 SCROLLABLE LIST AREA */}
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar rounded-2xl">
                  {isLoading ? (
                    <div className="py-10"><Loader /></div>
                  ) : data?.data?.length > 0 ? (
                    <div className="grid gap-1 bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                      {data.data.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateToAnimePage(item.id)}
                          className="flex items-center gap-4 p-3 hover:bg-primary/20 cursor-pointer group transition-all"
                        >
                          <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10 relative">
                            <img src={item.poster} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-primary truncate transition-colors">{item.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-black">
                              <span>{item.type}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20"></span>
                              <span>{item.aired}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    debouncedValue.length > 2 && (
                      <div className="py-10 text-center text-primary font-black italic uppercase tracking-widest">
                        Anime not found :(
                      </div>
                    )
                  )}
                </div>

                {/* 🚀 VIEW MORE BUTTON (Outside scroll area, only visible when data exists) */}
                {data?.data?.length > 0 && !isLoading && (
                   <motion.button
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   onClick={handleSearchSubmit}
                   className="w-full py-4 bg-primary text-black font-black uppercase italic text-xs flex justify-center items-center gap-2 rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95 pointer-events-auto"
                 >
                   View All Results <FaArrowCircleRight />
                 </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 149, 0, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Header;