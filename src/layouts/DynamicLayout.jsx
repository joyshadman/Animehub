/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { motion } from "framer-motion"; // Added for the 'Pop' effect
import Heading from "../components/Heading";
import MiniPoster from "../components/MiniPoster";

const DynamicLayout = ({ title, data, endpoint }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="col-span-12 md:col-span-6 mt-8 xl:col-span-3"
    >
      {/* 🏷️ HEADER SECTION */}
      <div className="flex justify-between items-end mb-4 px-1">
        <Heading className="!mb-0 text-xl font-black uppercase tracking-tighter italic">
          {title}
        </Heading>
        
        <Link
          className="group flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-all"
          to={`/animes/${endpoint}`}
        >
          <span>View All</span>
          <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 🪟 GLASS PANEL */}
      <div className="relative group">
        {/* Hover Border Glow */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[1.5rem] pointer-events-none group-hover:from-primary/20 transition-all duration-500" />
        
        <div className="items relative bg-white/[0.02] backdrop-blur-xl rounded-[1.5rem] p-3 h-auto w-full flex flex-col gap-1 border border-white/5">
          {data && data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <MiniPoster item={item} />
              
              {/* Subtle Divider between items, except the last one */}
              {index !== data.length - 1 && (
                <div className="mx-auto w-[90%] h-[1px] bg-white/[0.03] my-1" />
              )}
            </motion.div>
          ))}

          {/* 🔗 BOTTOM CALL TO ACTION */}
          <Link
            to={`/animes/${endpoint}`}
            className="mt-2 py-3 w-full flex justify-center items-center gap-2 rounded-xl bg-white/[0.03] hover:bg-primary hover:text-black text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all duration-300"
          >
            Explore More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicLayout;