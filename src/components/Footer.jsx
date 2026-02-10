import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import AZ from "../layouts/AZ";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 pb-10 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* ⚡ Background Storm Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 relative z-10">
        
        {/* 🌪️ TOP SECTION: Logo & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center py-10 gap-6">
          <div className="transition-all duration-500 hover:scale-110 cursor-pointer">
            <Logo />
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/joyshadman" 
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 group"
            >
              <FaGithub className="text-2xl group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#0077b5] hover:bg-white/10 hover:border-[#0077b5]/50 transition-all duration-300 group"
            >
              <FaLinkedinIn className="text-2xl group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* 🧊 A-Z SECTION: Glassy Squircle with Shimmer */}
        <div className="relative group overflow-hidden bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 md:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          
          {/* Shimmer Animation Effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-in-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[var(--primary)] text-black font-black italic px-5 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em]">
              A-Z list
            </span>
            <p className="hidden md:block text-white/30 font-bold text-sm italic tracking-tight uppercase">
              Searching anime ordered by alphabet name A to Z.
            </p>
          </div>
          
          <AZ />
        </div>

        {/* ⚖️ BOTTOM SECTION: Disclaimer */}
        <div className="flex flex-col items-center border-t border-white/5 pt-12">
          <div className="max-w-3xl text-center">
            <p className="text-[11px] md:text-xs text-white/30 leading-relaxed font-medium uppercase tracking-wider">
              <span className="text-primary font-black mr-2">Notice:</span> 
              AniStorm is a link-indexing service. We do not host, store, or upload any video files or media on our own servers. 
              All content is provided by non-affiliated third parties.
            </p>
          </div>
          
          <div className="mt-10 flex flex-col md:flex-row items-center gap-4 text-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">
            <span className="hover:text-primary transition-colors cursor-default">
              © {currentYear} AniStorm
            </span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10"></span>
            <span className="italic opacity-50">Designed for the Next Gen</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;