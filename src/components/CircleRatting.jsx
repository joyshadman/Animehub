import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

const StarRating = ({ rating }) => {
  // 1. Force conversion to number and fallback to 0
  const safeRating = Number(rating) || 0;

  // 2. Convert 0-10 scale to 0-5 scale
  const normalizedRating = safeRating / 2;

  return (
    <div className="flex items-center gap-1.5 group">
      {[...Array(5)].map((_, index) => {
        const starNumber = index + 1;

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1, // Staggered entry
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="text-primary text-lg drop-shadow-[0_0_8px_rgba(255,183,0,0.4)]"
          >
            {normalizedRating >= starNumber ? (
              <FaStar />
            ) : normalizedRating >= starNumber - 0.5 ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar className="opacity-30" />
            )}
          </motion.span>
        );
      })}
      
      {/* 3. Rating Number with subtle glass background */}
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="ml-2 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md text-primary text-xs font-black italic tracking-tighter"
      >
        {safeRating > 0 ? safeRating.toFixed(1) : "0.0"}
      </motion.span>
    </div>
  );
};

export default StarRating;