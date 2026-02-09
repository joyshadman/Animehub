/* eslint-disable react/prop-types */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const TrendingLayout = ({ data }) => {
  return (
    <div className="trending mt-10 w-full overflow-hidden px-2">
      {/* 🔥 MASSIVE TRENDING TITLE */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.1)]">
          Trending
        </h2>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 via-white/5 to-transparent mt-2" />
      </div>
      
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={true}
        spaceBetween={15}
        slidesPerView={3.2}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          480: { slidesPerView: 3.5, spaceBetween: 15 },
          768: { slidesPerView: 4.5, spaceBetween: 20 },
          1024: { slidesPerView: 5.5, spaceBetween: 25 },
          1440: { slidesPerView: 6.5, spaceBetween: 30 },
        }}
        className="pb-10"
      >
        {data &&
          data.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="group flex flex-col items-center">
                <Link
                  to={`/anime/${item.id}`}
                  className="relative w-full aspect-[2/3] overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    src={item.poster}
                    alt={item.title}
                  />

                  {/* 🍎 FLOATING GLASS RANK */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/20 text-white w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-[1.2rem] font-black text-xl shadow-2xl group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      {item.rank < 10 ? `0${item.rank}` : item.rank}
                    </div>
                  </div>

                  {/* Bottom Glossy Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                <h2
                  title={item.title}
                  className="mt-5 px-2 w-full text-center text-[13px] md:text-[15px] font-black italic tracking-tighter uppercase truncate transition-colors duration-300 group-hover:text-primary"
                >
                  {item.title}
                </h2>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* 🛠️ Glassy Nav Buttons Styling */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 60px !important;
          height: 60px !important;
          border-radius: 20px;
          color: white !important;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: 900;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: #fff;
          color: black !important;
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          .swiper-button-next, .swiper-button-prev { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default TrendingLayout;