import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTopTenStore from "../store/toptenStore";
import MiniPoster from "../components/MiniPoster";
import Heading from "../components/Heading";

const Top10Layout = () => {
  const [selectedTab, setSelectedTab] = useState("today");
  const tabs = [{ name: "today" }, { name: "week" }, { name: "month" }];
  const topTen = useTopTenStore((state) => state.topTen);

  const handleTabChange = (name) => {
    setSelectedTab(name);
  };

  return (
    <div className="mx-2 mt-16">
      {/* 🏷️ HEADER & SLIDING TABS */}
      <div className="flex flex-col sm:flex-row mb-6 justify-between items-start sm:items-center gap-4">
        <Heading className="!mb-0 text-2xl font-black uppercase tracking-tighter italic">
          Top 10
        </Heading>

        <div className="relative flex bg-white/[0.03] border border-white/5 p-1 rounded-full backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`relative z-10 px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                selectedTab === tab.name ? "text-black" : "text-white/40 hover:text-white"
              }`}
            >
              {selectedTab === tab.name && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full z-[-1]"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                />
              )}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🏆 RANKINGS LIST */}
      <div className="relative overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-4 sm:p-6 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            {topTen[selectedTab]?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 sm:gap-8 hover:bg-white/[0.03] p-2 rounded-2xl transition-all"
              >
                {/* RANK NUMBER */}
                <div className="relative flex items-center justify-center min-w-[40px]">
                  <h1 className={`text-2xl sm:text-4xl font-black italic tracking-tighter ${
                    item.rank <= 3 
                    ? "text-primary italic-shadow" 
                    : "text-white/10"
                  }`}>
                    {item.rank < 10 ? `0${item.rank}` : item.rank}
                  </h1>
                  {item.rank <= 3 && (
                    <div className="absolute -bottom-1 w-full h-[2px] bg-primary/30 blur-[2px]" />
                  )}
                </div>

                {/* POSTER & DETAILS */}
                <div className="flex-1">
                  <MiniPoster item={item} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .italic-shadow {
          text-shadow: 2px 2px 0px rgba(0,0,0,0.5), 0 0 15px rgba(var(--primary-rgb), 0.3);
        }
      `}</style>
    </div>
  );
};

export default Top10Layout;