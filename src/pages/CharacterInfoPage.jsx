/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useApi } from "../services/useApi";
import Loader from "../components/Loader";
import PageNotFound from "./PageNotFound";
import Image from "../components/Image";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { Helmet } from "react-helmet";
import { useState } from "react";

const CharacterInfoPage = () => {
  const { category, id } = useParams(); // category will be 'character' or 'people'
  const [isExpanded, setIsExpanded] = useState(false);

  // Reconstructing the ID for the API (e.g., character:monkey-d-luffy-1)
  const fullId = `${category}:${id}`;
  const { data: response, isLoading, isError } = useApi(`/${category}/${fullId}`);
  const data = response?.data;

  if (isError) return <PageNotFound />;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Helmet>
        <title>{data?.name || "Loading..."} | JoyNime</title>
        <meta name="description" content={`Details about ${data?.name}`} />
      </Helmet>

      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <div className="pt-20 pb-10">
          {/* 🎭 TOP PROFILE HEADER */}
          <section className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-12 gap-8 items-start">
            
            {/* LEFT: IMAGE */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl shadow-primary/5">
                <img 
                  src={data.imageUrl} 
                  alt={data.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* RIGHT: BASIC INFO */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-primary">
                  {data.name}
                </h1>
                <p className="text-white/40 text-lg font-medium">{data.nickname || category.toUpperCase()}</p>
              </div>

              {/* BIO / DESCRIPTION */}
              <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 relative">
                <h3 className="text-primary font-bold mb-2 uppercase text-xs tracking-widest">Biography</h3>
                <div className={`text-white/70 leading-relaxed text-sm transition-all duration-500 ${!isExpanded && "line-clamp-[8]"}`}>
                  {data.description || "No biography available for this entry."}
                </div>
                {data.description?.length > 400 && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 text-primary text-xs font-bold uppercase hover:underline"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* 🎞️ APPEARANCES / ANIME LIST */}
          <section className="max-w-[1200px] mx-auto px-4 md:px-8 mt-16">
            <div className="mb-8 border-l-4 border-primary pl-4">
              <Heading>Appearances</Heading>
              <p className="text-white/40 text-sm">Anime titles featuring {data.name}</p>
            </div>

            {/* Reuse your existing Grid logic */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {data.anime?.map((item, index) => (
                <div key={item.id + index} className="w-full transform transition-transform duration-300 hover:scale-105">
                  <Image data={item} />
                </div>
              ))}
            </div>

            {(!data.anime || data.anime.length === 0) && (
              <div className="py-20 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <p className="text-white/20 uppercase font-black">No anime found in database</p>
              </div>
            )}
          </section>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CharacterInfoPage;