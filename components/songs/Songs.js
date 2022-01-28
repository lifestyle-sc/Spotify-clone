import { ClockIcon } from "@heroicons/react/outline";
import { useRecoilValue } from "recoil";
import { playlistState } from "../../atom/playlistAtom";
import SongsItem from "./SongsItem";

const Songs = () => {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="flex flex-col space-y-1 text-gray-500 px-8 pb-28">

          {playlist.tracks.items && playlist.tracks.items.map((track, i) => (
            <SongsItem key={i} track={track} order={i} />
          ))}
    </div>
  );
};

export default Songs;
