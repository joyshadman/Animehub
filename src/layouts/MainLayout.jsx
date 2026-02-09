/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Image from "../components/Image";
import { FaAngleRight } from "react-icons/fa";

const MainLayout = ({ title, data, endpoint }) => {
  return (
    <div className="pb-12 px-2 md:px-0">
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="relative">
          <Heading className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
            {title}
          </Heading>
          <div className="absolute -bottom-2 left-0 h-1 w-2/3 bg-gradient-to-r from-primary to-transparent rounded-full" />
        </div>
        
        <Link to={`/animes/${endpoint}`} className="shrink-0">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-400 group">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
              View All
            </span>
            <FaAngleRight className="text-neutral-500 group-hover:text-primary transition-transform group-hover:translate-x-1" size={12} />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {data && data.map((item) => (
          <div key={item.id} className="group relative flex flex-col">
            {/* The primary link for the image */}
            <Link 
              to={`/anime/${item.id}`} 
              className="relative aspect-[2/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/10 backdrop-blur-sm transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:-translate-y-2"
            >
              {/* IMPORTANT: We pass a prop to Image (if supported) to disable its internal Link.
                  If your Image.jsx just returns an <img>, this is fine. 
              */}
              <Image 
                data={item} 
                isLink={false} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              
              {item.type && (
                 <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-tighter text-white">
                    {item.type}
                 </div>
              )}
            </Link>

            <div className="mt-3 px-2">
              <Link to={`/anime/${item.id}`}>
                <h4 className="text-sm font-bold text-neutral-200 group-hover:text-primary transition-colors line-clamp-1 leading-tight uppercase tracking-wide">
                  {item.title || item.name}
                </h4>
              </Link>
              <p className="text-[10px] font-medium text-neutral-500 mt-1 uppercase tracking-widest">
                {item.status || "Released"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;