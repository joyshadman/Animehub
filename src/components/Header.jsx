/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredPath, setHoveredPath] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Listen for scroll to toggle transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🚀 INSTANT REFRESH: Force transparent state when navigating back to top
  useEffect(() => {
    setIsScrolled(window.scrollY > 20);
  }, [location.pathname]);

  const { scrollY } = useScroll();
  
  // Header width and scale transformations
  const headerWidth = useTransform(scrollY, [0, 200], isMobile ? ["95%", "95%"] : ["90%", "65%"]);
  const headerScale = useTransform(scrollY, [0, 200], isMobile ? [1, 1] : [1, 0.98]);
  
  const smoothWidth = useSpring(headerWidth, { stiffness: 200, damping: 25 });
  const smoothScale = useSpring(headerScale, { stiffness: 200, damping: 25 });

  const navLinks = [
    { name: "Home", link: "/home" },
    { name: "About", link: "/about" },
    { name: "Most Popular", link: "/animes/most-popular" },
    { name: "Updated", link: "/animes/recently-updated" },
  ];

  const resetSearch = () => {
    setValue("");
    setShowSearch(false);
  };

  return (
    <div className="fixed top-4 md:top-6 inset-x-0 z-[999] flex justify-center pointer-events-none">
      <motion.div
        style={{ width: smoothWidth, scale: smoothScale }}
        className="relative pointer-events-auto will-change-transform"
      >
        {/* 🧊 GLASS CONTAINER - Pure CSS transitions for background and blur */}
        <div
          className={`
            relative rounded-full border transition-all duration-500 ease-out
            ${isScrolled 
              ? "bg-[#0a0a0a]/90 backdrop-blur-2xl border-white/10 py-3 md:py-4 px-5 md:px-8 shadow-2xl" 
              : "bg-black/10 backdrop-blur-md border-white/5 py-4 md:py-5 px-6 md:px-10"
            }
          `}
        >
          <div className="flex justify-between items-center relative z-20">
            <div className="flex items-center gap-3 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.1, color: "#ffb700" }}
                whileTap={{ scale: 0.9 }}
                onClick={sidebarHandler}
                className="text-white/80 p-1 md:p-2"
              >
                <FaBars size={20} />
              </motion.button>
              
              <div onClick={() => { navigate("/"); resetSearch(); }} className="cursor-pointer">
                <Logo />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredPath(null)}>
              {navLinks.map((item) => (
                <motion.button
                  key={item.link}
                  onMouseEnter={() => setHoveredPath(item.link)}
                  onClick={() => navigate(item.link)}
                  className={`relative px-4 py-2 text-sm font-black italic uppercase tracking-tighter transition-all duration-300 ${
                    hoveredPath === item.link || location.pathname === item.link 
                    ? "text-primary" 
                    : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <AnimatePresence>
                    {hoveredPath === item.link && (
                      <motion.div
                        layoutId="nav-hover-bg"
                        className="absolute inset-0 bg-white/5 rounded-full -z-0"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  {location.pathname === item.link && (
                    <motion.div 
                      layoutId="nav-active-line"
                      className="absolute -bottom-1 left-4 right-4 h-[1.5px] bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2.5 md:p-3 rounded-full transition-all ${showSearch ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
              >
                {showSearch ? <FaXmark size={18} /> : <FaSearch size={18} />}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden relative z-10"
              >
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Unlock the multi-verse..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3 md:py-4 text-sm md:text-base outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                />
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Header;