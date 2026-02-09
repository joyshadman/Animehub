import React from "react";
import { motion } from "framer-motion";
import Image from "../components/Image";
import Heading from "../components/Heading";

const Recommended = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Animation variants for the grid items
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <div className="mt-16 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 mb-8">
        <Heading className="!mb-0 text-2xl md:text-4xl font-black uppercase tracking-tighter italic">
          Recommended for you
        </Heading>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      {/* ANIMATED GRID */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
      >
        {data.map((item) => (
          <motion.div 
            key={item.id} 
            variants={itemVars}
            className="group relative"
          >
            {/* Glossy Overlay on Hover */}
            <div className="absolute -inset-1 bg-primary/20 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
              <Image 
                data={item} 
                className="rounded-2xl shadow-lg border border-white/5 group-hover:border-white/20 transition-colors" 
              />
              
              {/* Bottom Glow Plate */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Recommended;