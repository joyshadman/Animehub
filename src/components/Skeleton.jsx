import React from "react";

const Skeleton = ({ className, variant = "rect" }) => {
  // Base classes for the shimmer effect
  const baseClasses = "relative overflow-hidden bg-white/5";
  
  // Shimmer animation layer
  const shimmerOverlay = (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );

  // Shape variants
  const variants = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "rounded h-4 mb-2",
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {shimmerOverlay}
      {/* Fallback height/width container if parent doesn't provide it */}
      <div className="invisible">.</div>
    </div>
  );
};

export default Skeleton;