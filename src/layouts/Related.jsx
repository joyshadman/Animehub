/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MiniPoster from "../components/MiniPoster";
import Heading from "../components/Heading";

const Related = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const initialItems = 6; // Compact initial view
  const hasMore = data?.length > initialItems;

  const displayedData = showAll ? data : data?.slice(0, initialItems);

  if (!data || data.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      {/* 🏷️ HEADER SECTION */}
      <div className="flex items-center justify-between mb-4">
        <Heading className="!mb-0 text-xl font-black uppercase tracking-tighter italic">
          Related
        </Heading>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          {data.length} Series
        </span>
      </div>

      {/* 🪟 GLASS PANEL */}
      <div className="relative overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[2rem] p-3 shadow-2xl">
        <div className="flex flex-col gap-1">
          <AnimatePresence mode="popLayout">
            {displayedData.map((item, index) => (
              <motion.div
                key={item.id + index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: showAll ? 0 : index * 0.05 }}
                className="group relative"
              >
                <MiniPoster item={item} />
                
                {/* Visual Separator */}
                {index !== displayedData.length - 1 && (
                  <div className="mx-auto w-[90%] h-[1px] bg-white/[0.03] my-1 group-hover:bg-primary/20 transition-colors" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 🔘 INTERACTIVE TOGGLE */}
        {hasMore && (
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-3 py-4 text-[10px] font-black text-white/40 hover:text-primary uppercase tracking-[0.3em] transition-all border-t border-white/5 bg-white/[0.01]"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Collapse List" : `Show More (+${data.length - initialItems})`}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Related;