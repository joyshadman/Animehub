/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { useApi } from "../services/useApi";
import Loader from "../components/Loader";
import InfoLayout from "../layouts/InfoLayout";
import Recommended from "../layouts/Recommended";
import MostPopular from "../layouts/MostPopular";
import MoreSeasons from "../layouts/MoreSeasons";
import Related from "../layouts/Related";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { FaWindowClose } from "react-icons/fa";
import VoiceActorsLayout from "../layouts/VoiceActorsLayout";

const DetailPage = () => {
  const { id } = useParams();
  const [bigPoster, setBigPoster] = useState(null);

  // 1. Reset scroll to top when ID changes (important for related anime clicks)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const titleId = id.split("-").slice(0, -1).join(" ").replace(",", " ");

  const endsWithNumber = /\d$/;
  const result = endsWithNumber.test(id);

  if (!result) {
    return <PageNotFound />;
  }

  const showBigPoster = (url) => {
    setBigPoster(url);
  };

  const { data: response, isError, isLoading } = useApi(`/anime/${id}`);
  const data = response?.data;

  if (isError) {
    return <PageNotFound />;
  }

  return (
    <main className={`relative min-h-screen bg-[#050505] ${bigPoster ? "h-screen overflow-hidden" : ""}`}>
      
      {/* 🖼️ BIG POSTER MODAL */}
      {bigPoster && (
        <div className="fixed inset-0 flex justify-center items-center z-[200] bg-black/90 backdrop-blur-md p-4">
          <div className="relative max-w-full max-h-full group">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold uppercase text-xs"
            >
              <span>Close</span>
              <FaWindowClose size={24} />
            </button>
            <img
              src={bigPoster}
              alt="big poster"
              className="rounded-lg shadow-2xl max-h-[85vh] w-auto border border-white/10"
            />
          </div>
        </div>
      )}

      <Helmet>
        <title>{titleId.toUpperCase()} | JoyNime</title>
        <meta property="og:title" content={`${titleId} - JoyNime`} />
      </Helmet>

      {data && !isLoading ? (
        <div className={`DetailPage transition-all duration-500 ${bigPoster ? "blur-xl scale-95" : "blur-0 scale-100"}`}>
          
          {/* TOP INFO SECTION */}
          <InfoLayout showBigPoster={showBigPoster} data={data} />

          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 px-4 md:px-8 py-10">
            
            {/* ⬅️ LEFT CONTENT: Seasons, VAs, Recommendations */}
            <div className="col-span-12 xl:col-span-9 space-y-12">
              {data.moreSeasons && data.moreSeasons.length !== 0 && (
                <MoreSeasons data={data.moreSeasons} />
              )}
              
              <div className="bg-white/[0.02] rounded-3xl p-1 border border-white/5">
                <VoiceActorsLayout id={id} />
              </div>

              {data.recommended && (
                <div className="recomendation">
                  <Recommended data={data.recommended} />
                </div>
              )}
            </div>

            {/* ➡️ RIGHT CONTENT: Related & Popular (Sticky) */}
            <aside className="col-span-12 xl:col-span-3">
              <div className="sticky top-24 space-y-10">
                {data.related && data.related.length !== 0 && (
                  <div className="related">
                    <Related data={data.related} />
                  </div>
                )}
                
                {data.mostPopular && (
                  <div className="most-popular">
                    <MostPopular data={data.mostPopular} />
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <Loader className="h-[100dvh]" />
      )}

      <Footer />
    </main>
  );
};

export default DetailPage;