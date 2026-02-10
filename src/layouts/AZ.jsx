import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const AZ = () => {
  const { query, category } = useParams();
  const location = useLocation();

  // Determine active state safely
  const currentActive = query ? query.toUpperCase() : (category === "az-list" ? "ALL" : "");

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const azList = [
    { title: "ALL", link: "/animes/az-list" },
    { title: "#", link: "/animes/az-list/other" },
    { title: "0-9", link: "/animes/az-list/0-9" },
    ...alphabets.map((char) => ({
      title: char,
      link: `/animes/az-list/${char}`,
    })),
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 w-full">
      {azList.map((item) => {
        const isActive = currentActive === item.title || location.pathname === item.link;

        return (
          <Link to={item.link} key={item.title}>
            <button
              className={`
                min-w-[35px] md:min-w-[45px] h-9 md:h-11 px-2 
                flex items-center justify-center
                text-[12px] md:text-sm font-black transition-all duration-300 rounded-xl
                border backdrop-blur-md uppercase
                ${isActive
                  ? "bg-[var(--primary)] border-[var(--primary)]/50 text-black shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110 z-10"
                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white"
                }
              `}
            >
              {item.title}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default AZ;