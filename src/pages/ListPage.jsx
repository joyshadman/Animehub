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

  // FIX: API usually expects lowercase 'all' or lowercase letters
  const endpoint = (() => {
    if (category === "az-list") {
      const azQuery = query ? query.toLowerCase() : "all";
      return `/az-list/${azQuery}?page=`;
    }
    if (category === "genre") return `/genre/${query?.toLowerCase()}?page=`;
    if (category === "producer") return `/producer/${query?.toLowerCase()}?page=`;
    return `/${category}?page=`;
  })();

  const { data, isError, isLoading, hasNextPage, fetchNextPage } = useInfiniteApi(endpoint);

  if (!isValidQuery || isError) {
    return <PageNotFound />;
  }

  const pages = data?.pages;
  const displayTitle = query 
    ? `${query.replace(/-/g, ' ')}` 
    : `${category.replace(/-/g, ' ')}`;

  return (
    <div className="list-page pt-20 min-h-screen bg-[#050505]">
      <Helmet>
        <title>{displayTitle.toUpperCase()} Anime | AniStorm</title>
      </Helmet>

      {category === "az-list" && (
        <div className="mb-12 mt-6 max-w-[1600px] mx-auto px-4">
          <AZ />
        </div>
      )}

      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={data?.pages.flat().length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<div className="py-10"><Loader className="h-fit" /></div>}
          endMessage={<Footer />}
          className="overflow-hidden"
        >
          <div className="max-w-[1600px] mx-auto px-4 mt-10">
            <header className="mb-10 border-l-4 border-primary pl-6">
              <Heading className="capitalize text-white">
                {displayTitle} <span className="text-primary">Anime</span>
              </Heading>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
              {pages?.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data?.response?.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="w-full transition-transform hover:scale-105">
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