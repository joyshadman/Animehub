/* eslint-disable react/prop-types */
import React from "react";
import { motion } from "framer-motion";
import { useApi } from "../services/useApi";
import Heading from "../components/Heading";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";

const VoiceActorsLayout = ({ id }) => {
  const { data, isLoading, isError } = useApi(`/characters/${id}`);

  if (isError) return null;
  if (isLoading) return <Loader />;
  
  const characters = data?.data?.response?.slice(0, 6);
  if (!characters?.length) return null;

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12"
    >
      {/* 🏷️ HEADER SECTION */}
      <div className="flex justify-between items-end mb-6 px-1">
        <div className="flex items-center gap-4">
          <Heading className="!mb-0 text-xl md:text-3xl font-black uppercase tracking-tighter italic">
            Cast & Crew
          </Heading>
          <div className="hidden md:block h-[1px] w-20 bg-primary/30" />
        </div>

        <Link 
          to={`/characters/${id}`} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-all"
        >
          <span>Full Cast</span>
          <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 🎭 CHARACTERS GRID */}
      <div className="grid grid-cols-12 gap-3">
        {characters.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative col-span-12 md:col-span-6 xl:col-span-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-[1.5rem] p-3 flex items-center justify-between backdrop-blur-xl transition-all duration-300"
          >
            {/* LEFT: CHARACTER */}
            <div className="flex items-center gap-3">
              <Link to={`/${item.id.replace(":", "/")}`} className="relative">
                <div className="size-12 overflow-hidden rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                  <img
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link to={`/${item.id.replace(":", "/")}`}>
                  <h4 className="text-[11px] font-black text-white hover:text-primary transition-colors truncate max-w-[100px] md:max-w-[120px]">
                    {item.name}
                  </h4>
                </Link>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {item.role}
                </span>
              </div>
            </div>

            {/* DIVIDER DOT (Only visible on larger cards) */}
            <div className="hidden sm:block h-1 w-1 rounded-full bg-white/5" />

            {/* RIGHT: VOICE ACTOR */}
            {item.voiceActors.length > 0 && (
              <div className="flex items-center gap-3 text-right">
                <div className="flex flex-col">
                  <Link to={`/${item.voiceActors[0].id.replace(":", "/")}`}>
                    <h4 className="text-[11px] font-black text-white/70 hover:text-primary transition-colors truncate max-w-[100px]">
                      {item.voiceActors[0].name}
                    </h4>
                  </Link>
                  <span className="text-[9px] font-bold text-primary/40 uppercase tracking-tighter">
                    Japanese
                  </span>
                </div>
                <Link to={`/${item.voiceActors[0].id.replace(":", "/")}`}>
                  <div className="size-12 overflow-hidden rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                    <img
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={item.voiceActors[0].imageUrl}
                      alt={item.voiceActors[0].name}
                    />
                  </div>
                </Link>
              </div>
            )}
            
            {/* HOVER GLOW EFFECT */}
            <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
};

export default VoiceActorsLayout;