/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import Heading from "../components/Heading";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "../components/Image";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { FaSearch } from "react-icons/fa";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  
  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteApi(`/search?keyword=${keyword}&page=`);

  // Handle potential API errors or empty states
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-dvh bg-[#050505] text-center px-4">
        <FaSearch className="text-white/10 text-6xl mb-4" />
        <h1 className="text-xl text-white/60 font-medium">
          No results found for <span className="text-primary italic">"{keyword}"</span>
        </h1>
        <p className="text-white/30 text-sm mt-2">Try checking for typos or use different keywords.</p>
      </div>
    );
  }

  const pages = data?.pages;
  const allItems = pages?.flatMap((page) => page.data.response) || [];

  return (
    <div className="list-page pt-24 min-h-screen bg-[#050505]">
      <Helmet>
        <title>Results for "{keyword}" | JoyNime</title>
        <meta property="og:title" content={`Search Results for ${keyword}`} />
      </Helmet>

      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={allItems.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<div className="py-10"><Loader className="h-fit" /></div>}
          endMessage={<Footer />}
        >
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <header className="mb-10">
              <span className="text-primary text-xs font-black uppercase tracking-[0.3em] block mb-2">Search results</span>
              <Heading className="capitalize">
                "{keyword}"
              </Heading>
            </header>

            {/* 🎥 Optimized Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {pages?.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.response.map((item, index) => (
                    <div 
                      key={`${item.id}-${pageIndex}-${index}`} 
                      className="w-full transition-transform duration-300 hover:scale-105"
                    >
                      <Image data={item} />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Empty state if API returns success but 0 results */}
            {allItems.length === 0 && (
               <div className="py-40 text-center">
                  <h1 className="text-white/20 text-2xl font-black uppercase italic tracking-tighter">No Anime Found</h1>
               </div>
            )}
          </div>
        </InfiniteScroll>
      ) : (
        <Loader className="h-[100dvh]" />
      )}
    </div>
  );
};

export default SearchResult;