/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import PageNotFound from "./PageNotFound";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "../components/Image";
import Heading from "../components/Heading";
import AZ from "../layouts/AZ";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const ListPage = () => {
  const { category, query = null } = useParams();

  const validateQueries = [
    "top-airing", "most-popular", "most-favorite", "completed",
    "recently-added", "recently-updated", "top-upcoming",
    "subbed-anime", "dubbed-anime", "movie", "tv", "ova", "ona",
    "special", "az-list", "genre", "producer",
  ];

  const isValidQuery = validateQueries.includes(category);

  // 1. Define endpoint before calling the hook
  const endpoint = (() => {
    if (category === "az-list") return `/az-list/${query ?? "All"}?page=`;
    if (category === "genre") return `/genre/${query}?page=`;
    if (category === "producer") return `/producer/${query}?page=`;
    return `/${category}?page=`;
  })();

  // 2. Call hook at the top level (Fixes the eslint-disable rule you had)
  const { data, isError, isLoading, hasNextPage, fetchNextPage } = useInfiniteApi(endpoint);

  // 3. Handle Invalid State
  if (!isValidQuery || isError) {
    return <PageNotFound />;
  }

  const pages = data?.pages;

  // Formatting title for SEO and Heading
  const displayTitle = query 
    ? `${query.replace(/-/g, ' ')}` 
    : `${category.replace(/-/g, ' ')}`;

  return (
    <div className="list-page pt-20 min-h-screen bg-[#050505]">
      <Helmet>
        <title>{displayTitle.toUpperCase()} Anime | JoyNime</title>
        <meta property="og:title" content={`${displayTitle} - Explore`} />
      </Helmet>

      {/* A-Z Filter for az-list category */}
      {category === "az-list" && (
        <div className="mb-8">
          <AZ selected={query} />
        </div>
      )}

      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={data?.pages.flat().length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<div className="py-10"><Loader className="h-fit" /></div>}
          endMessage={<Footer />}
          className="overflow-hidden" // Prevents weird scrollbar issues
        >
          <div className="max-w-[1600px] mx-auto px-4">
            <header className="mb-8 border-l-4 border-primary pl-4">
              <Heading className="capitalize">
                {displayTitle} Anime
              </Heading>
            </header>

            {/* Responsive Grid - Adjusted for a cleaner look */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {pages?.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.response.map((item, index) => (
                    <div 
                      key={`${item.id}-${pageIndex}-${index}`} 
                      className="w-full transform transition-transform duration-300 hover:scale-105"
                    >
                      <Image data={item} />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      ) : (
        <Loader className="h-[100dvh]" />
      )}
    </div>
  );
};

export default ListPage;