import React from "react";
import { motion } from "framer-motion";

const Heading = ({ children, className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-4 my-8"
    >
      {/* ⚡ The "Over-engineered" Accent: A glowing vertical pill */}
      <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(255,183,0,0.5)]" />
      
      <h1 className={`text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-md ${className}`}>
        {children}
      </h1>
      
      {/* Optional: A subtle line that fades out to the right */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-4 hidden md:block" />
    </motion.div>
  );
};

export default Heading;