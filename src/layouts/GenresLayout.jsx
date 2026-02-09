import React from "react";
import { motion } from "framer-motion";
import Genres from "../components/Genres";
import Heading from "../components/Heading";

const GenresLayout = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 px-4 md:px-0"
    >
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 mb-6">
        <Heading className="!mb-0 text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
          Genres
        </Heading>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      {/* GLASSY CONTAINER */}
      <div className="relative group">
        {/* Subtle background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md p-4">
          <div className="flex flex-wrap gap-2">
            <Genres className="
              !bg-white/[0.05] 
              hover:!bg-primary 
              hover:!text-black 
              !border !border-white/10 
              hover:!border-primary 
              !rounded-xl 
              !px-5 
              !py-2.5 
              !text-[11px] 
              !font-black 
              !uppercase 
              !tracking-widest 
              !transition-all 
              !duration-300
              !inline-block
              !m-1
            " />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GenresLayout;