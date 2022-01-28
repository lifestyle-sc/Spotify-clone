import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../../atom/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import PlaylistInfo from "../playlist/PlaylistInfo";
import Songs from "../songs/Songs";
import Typing from "../typewriter/Typing";

const colors = [
  "from-indigo-500",
  "from-red-500",
  "from-blue-500",
  "from-green-500",
  "from-pink-500",
  "from-purple-500",
  "from-yellow-500",
];

const steps = [
  "Log in to spotify via the mobile app or desktop app.",
  "Click on the connect to device icon.",
  "Select connect to Web Playback SDK.",
  "If connected, you can now automate your spotify via the web app clone.",
  "Select a playlist and have fun.",
  "Use in desktop mode for better experience.",
];

const Body = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong", err));
  }, [playlistId, spotifyApi]);

  return (
    <div className="grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="bg-black text-white font-semibold flex items-center rounded-full opacity-80 hover:opacity-70 cursor-pointer p-1 pr-1 space-x-3"
          onClick={signOut}
        >
          <img
            className="rounded-full w-9 h-9"
            src={session?.user?.image}
            alt="user image"
          />
          <div>{session?.user?.name}</div>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      {playlist === null ? (
        <span className="text-gray-500 bg-gradient-to-b from-gray-800 to-black flex flex-col items-center h-full justify-center px-3 text-center">
          <h1 className="text-white text-xl md:text-3xl mb-2 font-bold">
            <Typing />
          </h1>
          <span className="text-sm md:text-base">
            Disclaimer: Must Have a Spotify Premium Account
          </span>
          <span className="text-base text-white md:text-lg">How to use: </span>
          <ul>
            {steps.map((step) => (
              <li>{step}</li>
            ))}
          </ul>
        </span>
      ) : (
        <>
          <section
            className={`space-x-7 flex items-end text-white p-8 h-80 bg-gradient-to-b to-black ${color}`}
          >
            <PlaylistInfo />
          </section>
          {playlist && <Songs />}
        </>
      )}
    </div>
  );
};

export default Body;
