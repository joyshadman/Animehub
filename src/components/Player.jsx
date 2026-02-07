/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import MoreSeasons from "../layouts/MoreSeasons";

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("vidWish");

  return (
    <>
      <div className="w-full bg-background aspect-video relative rounded-sm max-w-screen-xl overflow-hidden">
        <iframe
          id="anime-player"
          key={`${episodeId}-${server}-${category}`}
          src={`https://${
            server === "vidWish" ? "vidwish.live" : "megaplay.buzz"
          }/stream/s-2/${episodeId.split("ep=").pop()}/${category}`}
          width="100%"
          height="100%"
          allowFullScreen
          title="Video Player"
          className="z-10"
        ></iframe>
      </div>

      <div className="category flex flex-wrap flex-col sm:flex-row items-center justify-center sm:justify-between px-2 md:px-20 gap-3 bg-lightbg py-4">
        <div className="servers flex gap-4">
          <button
            onClick={() => setServer("vidWish")}
            className={`${
              server === "vidWish"
                ? "bg-primary text-black"
                : "bg-btnbg text-white"
            } px-3 py-1.5 rounded text-sm font-semibold uppercase`}
          >
            vidwish
          </button>
          <button
            onClick={() => setServer("megaPlay")}
            className={`${
              server === "megaPlay"
                ? "bg-primary text-black"
                : "bg-btnbg text-white"
            } px-3 py-1.5 rounded text-sm font-semibold uppercase`}
          >
            megaplay
          </button>
        </div>

        <div className="flex gap-5">
          <div className="sound flex gap-3">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => setCategory(type)}
                className={`${
                  category === type
                    ? "bg-primary text-black"
                    : "bg-btnbg text-white"
                } px-3 py-1.5 rounded text-sm font-semibold uppercase`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="btns flex gap-4">
            {hasPrevEp && (
              <button
                className="bg-primary px-3 py-1 rounded-md text-black"
                onClick={() => changeEpisode("prev")}
              >
                <TbPlayerTrackPrevFilled />
              </button>
            )}
            {hasNextEp && (
              <button
                className="bg-primary px-3 py-1 rounded-md text-black"
                onClick={() => changeEpisode("next")}
              >
                <TbPlayerTrackNextFilled />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col text-center sm:text-right">
          <p className="text-gray-400 text-sm">
            Watching{" "}
            <span className="text-white font-medium">
              Episode {currentEp.episodeNumber}
            </span>
          </p>
          {currentEp.isFiller && (
            <p className="text-red-400 text-[10px] font-bold uppercase">
              Filler Episode 👻
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Player;
