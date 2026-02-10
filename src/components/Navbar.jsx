import { useState } from "react";
import { FaAlignJustify, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", id: "/home" },
    { name: "About", id: "/about" }, 
    { name: "Movies", id: "/animes/movie" },
    { name: "TV Series", id: "/animes/tv" },
    { name: "Most Popular", id: "/animes/most-popular" },
  ];

  return (
    <nav className="relative z-[100]">
      {/* 💻 DESKTOP NAVBAR */}
      <div className="hidden md:flex mt-8 mb-10 justify-center items-center">
        <ul className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.id;
            return (
              <li key={item.id}>
                <Link
                  to={item.id}
                  className={`relative px-6 py-2 rounded-full text-sm font-black transition-all duration-300 uppercase tracking-tighter ${
                    isActive
                      ? "text-black"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {/* Active Background Pill - Using #ffb700 */}
                  {isActive && (
                    <motion.div
                      layoutId="navpill"
                      className="absolute inset-0 bg-[#ffb700] rounded-full z-[-1]"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 📱 MOBILE NAVBAR */}
      <div className="md:hidden w-full px-4 pt-5">
        <button
          onClick={() => setShow(!show)}
          className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest active:scale-95 transition-all text-white"
        >
          {show ? <FaTimes className="text-[#ffb700]" /> : <FaAlignJustify />}
          <span>Menu</span>
        </button>

        <AnimatePresence>
          {show && (
            <motion.ul
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-4 right-4 mt-4 flex flex-col items-center bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] py-6 shadow-2xl gap-2"
            >
              {navLinks.map((item) => {
                const isActive = location.pathname === item.id;
                return (
                  <li className="w-full px-6" key={item.id}>
                    <Link
                      onClick={() => setShow(false)}
                      className={`block w-full text-center py-3 rounded-2xl text-base font-black uppercase tracking-tighter transition-all ${
                        isActive
                          ? "bg-[#ffb700] text-black"
                          : "text-white/40 hover:bg-white/5"
                      }`}
                      to={item.id}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;