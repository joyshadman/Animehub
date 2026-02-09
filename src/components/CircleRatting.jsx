import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  // 1. Force conversion to number and fallback to 0 if rating is missing/invalid
  const safeRating = Number(rating) || 0;

  // 2. Convert 0-10 scale to 0-5 scale
  const normalizedRating = safeRating / 2;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starNumber = index + 1;

        return (
          <span key={index} className="text-yellow text-xl">
            {normalizedRating >= starNumber ? (
              <FaStar />
            ) : normalizedRating >= starNumber - 0.5 ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar />
            )}
          </span>
        );
      })}
      
      {/* 3. Using safeRating with a check to prevent toFixed errors */}
      <span className="ml-2 text-yellow mt-1 text-sm font-medium">
        {safeRating > 0 ? safeRating.toFixed(1) : "0.0"}
      </span>
    </div>
  );
};

export default StarRating;