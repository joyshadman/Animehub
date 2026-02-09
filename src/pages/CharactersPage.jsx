/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import InfiniteScroll from "react-infinite-scroll-component";
import { Helmet } from "react-helmet";

const CharactersPage = () => {
  const { id } = useParams();

  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteApi(`/characters/${id}?page=`);

  const pages = data?.pages;
  const allItems = pages?.flatMap((page) => page.data.response) || [];

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center text-white/50">
        Failed to load characters. Please try again later.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Characters & Voice Actors | JoyNime</title>
      </Helmet>

      <main className="pt-20 pb-10 mx-auto max-w-[900px] px-4">
        {pages && !isLoading ? (
          <>
            <div className="mb-8 border-l-4 border-primary pl-4">
              <Heading>Characters & Voice Actors</Heading>
              <p className="text-white/40 text-sm mt-1">Full cast and staff information</p>
            </div>

            <InfiniteScroll
              dataLength={allItems.length}
              next={fetchNextPage}
              hasMore={hasNextPage}
              loader={<div className="py-10"><Loader className="h-fit" /></div>}
              className="space-y-3"
            >
              {allItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="group flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
                >
                  {/* 🎭 LEFT: CHARACTER INFO */}
                  <div className="flex items-center gap-4 flex-1 p-2">
                    <Link to={`/${item.id.replace(":", "/")}`} className="shrink-0">
                      <div className="size-14 md:size-16 overflow-hidden rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
                        <img
                          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          src={item.imageUrl}
                          alt={item.name}
                        />
                      </div>
                    </Link>
                    <div className="flex flex-col">
                      <Link to={`/${item.id.replace(":", "/")}`}>
                        <h4 className="text-sm md:text-base font-bold text-white group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  {/* 🎙️ RIGHT: VOICE ACTORS */}
                  <div className="flex items-center gap-4 flex-1 justify-end p-2 bg-white/[0.02]">
                    <div className="flex flex-col text-right hidden sm:flex">
                      {item.voiceActors.map((actor) => (
                        <Link key={actor.id} to={`/${actor.id.replace(":", "/")}`}>
                          <h4 className="text-sm font-medium text-white/80 hover:text-primary transition-colors">
                            {actor.name}
                          </h4>
                          <span className="text-[10px] text-white/30 uppercase">Japanese</span>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex -space-x-2">
                      {item.voiceActors.map((actor) => (
                        <Link 
                          key={actor.id} 
                          to={`/${actor.id.replace(":", "/")}`}
                          title={actor.name}
                        >
                          <div className="size-14 md:size-16 rounded-lg overflow-hidden border-2 border-[#050505] shadow-xl">
                            <img
                              loading="lazy"
                              className="h-full w-full object-cover"
                              src={actor.imageUrl}
                              alt={actor.name}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </>
        ) : (
          <Loader className="h-[100dvh]" />
        )}
      </main>
      <Footer />
    </>
  );
};

export default CharactersPage;