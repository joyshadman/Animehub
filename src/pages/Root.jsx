/* eslint-disable react-hooks/exhaustive-deps */
import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png";
import background from "../assets/background.jpg";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Root = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/search?keyword=${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navbar />
      
      {/* 🌌 MAIN HERO WRAPPER */}
      <div 
        className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

        <div className="relative z-10 w-full max-w-[1200px] px-4 py-10">
          
          {/* 🏷️ LOGO SECTION */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="scale-125 md:scale-150">
              <Logo />
            </div>
          </div>

          {/* 🔍 SEARCH BOX */}
          <div className="max-w-2xl mx-auto mb-10">
            <form
              onSubmit={handleSubmit}
              className="flex h-12 md:h-14 items-center group"
            >
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder="Search anime..."
                className="w-full h-full px-6 bg-white rounded-l-2xl text-black outline-none text-lg placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="h-full px-6 bg-primary text-black rounded-r-2xl hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <FaSearch size={20} />
              </button>
            </form>
          </div>

          {/* 🎨 CENTER BANNER IMAGE */}
          <div className="flex justify-center mb-10">
            <img
              className="w-full max-w-[350px] md:max-w-[450px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-bounce-slow"
              src={banner}
              alt="anime character banner"
            />
          </div>

          {/* 🚀 EXPLORE BUTTON */}
          <div className="flex justify-center">
            <Link
              to="/home"
              className="group relative inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
            >
              <span className="text-black font-black text-lg uppercase tracking-wider">
                Explore Animes
              </span>
              <FaArrowCircleRight className="text-black text-xl group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Root;