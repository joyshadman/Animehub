import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);

  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const changeInput = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, 400);
  };

  const { data, isLoading } = useApi(
    debouncedValue.length > 2 ? `/suggestion?keyword=${debouncedValue}` : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${value}`);
    resetSearch();
  };

  const resetSearch = () => {
    setValue("");
    setDebouncedValue("");
    setShowSearch(false);
  };

  const navigateToAnimePage = (id) => {
    navigate(`/anime/${id}`);
    resetSearch();
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[75%] z-[999]">

      {/* 🔥 Neon Glow Background */}
      <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full"></div>

      {/* 🧊 Glass Navbar */}
      <motion.div
        layout
        className="relative rounded-full bg-black/30 backdrop-blur-xl border border-white/10 px-6 py-3 shadow-2xl"
      >
        <div className="flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={sidebarHandler}>
              <FaBars size={22} />
            </motion.button>
            <Logo />
          </div>

          {/* Center Nav */}
          <div className="hidden md:flex gap-6 mr-20">
            {[
              { name: "Home", link: "/home" },
              { name: "About", link: "/about" },
              { name: "Most Popular", link: "/animes/most-popular" },
              { name: "recently updated", link: "/animes/recently-updated" },
            ].map((item) => (
              <motion.button
                key={item.link}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate(item.link)}
                className="hover:text-primary transition-colors duration-300 font-bold uppercase text-xs tracking-widest"
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Search Toggle */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? <FaXmark /> : <FaSearch />}
          </motion.button>

        </div>

        {/* 🎬 Netflix Expanding Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <motion.input
                autoFocus
                value={value}
                onChange={changeInput}
                placeholder="Search anime..."
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="mt-4 w-full bg-white/10 px-5 py-3 rounded-2xl border border-white/20 outline-none focus:bg-white/20 transition"
              />
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🎥 Floating Results Panel */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-4 rounded-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            {isLoading ? (
              <Loader />
            ) : data?.data?.length ? (
              <>
                {data.data.map((item) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={item.id}
                    onClick={() => navigateToAnimePage(item.id)}
                    className="flex gap-4 px-4 py-4 cursor-pointer hover:bg-white/5"
                  >
                    <img
                      src={item.poster}
                      className="w-12 h-16 rounded-md object-cover"
                    />
                    <div>
                      <h4>{item.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {item.alternativeTitle}
                      </p>
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="w-full flex justify-center items-center gap-3 py-4 bg-primary text-black font-bold"
                >
                  View More
                  <FaArrowCircleRight />
                </motion.button>
              </>
            ) : (
              value.length > 2 && (
                <h1 className="text-center py-6 text-primary">
                  anime not found :(
                </h1>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Header;
