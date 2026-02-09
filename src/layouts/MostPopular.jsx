import React from "react";
import { motion } from "framer-motion";
import DynamicLayout from "./DynamicLayout";

const MostPopular = ({ data }) => {
  // If there's no data, we return null to avoid rendering an empty block
  if (!data || data.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {/* 🔮 OPTIONAL: Ambient Glow behind this specific section */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />

      <DynamicLayout 
        data={data} 
        title="Most Popular" 
        endpoint="most-popular" 
      />
    </motion.div>
  );
};

export default MostPopular;