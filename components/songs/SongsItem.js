import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../../atom/songAtom";
import useSpotify from "../../hooks/useSpotify";

const SongsItem = ({ track, order }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };
  const time = moment
    .duration(track.track.duration_ms, "milliseconds")
    .format("hh:mm:ss", { trim: true });
  return (
    <div className="grid grid-cols-2 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer" onClick={playSong}>
      <div className="flex items-center space-x-5 md:mr-9">
        <p>{order + 1}</p>
        <img src={track.track.album.images[0].url} className="w-10 h-10" />
        <div>
          <p className="text-white w-36 lg:w-72 truncate">{track.track.name}</p>
          <p className="text-[14px] w-40">
            {track.track.album.artists[0].name}
          </p>
        </div>

        <div className="flex items-center justify-between ml-auto md:ml-0">
          <p className="hidden md:inline w-40 lg:w-72 truncate md:mx-7">
            {track.track.album.name}
          </p>
          <p className="md:ml-7">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default SongsItem;
