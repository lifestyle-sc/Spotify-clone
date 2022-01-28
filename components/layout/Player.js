import {
  VolumeOffIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState, volumeState } from "../../atom/songAtom";
import useSongInfo from "../../hooks/useSongInfo";
import useSpotify from "../../hooks/useSpotify";
import WebPlayback from "../player/WebPlayback";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useRecoilState(volumeState);
  const songInfo = useSongInfo();


  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing", data.body?.items);
        setCurrentTrackId(data.body?.item.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [spotifyApi, currentTrackId, session]);

  // const handlePlayPause = () => {
  //   spotifyApi.getMyCurrentPlaybackState().then((data) => {
  //     if (data.body.is_playing) {
  //       spotifyApi.pause();
  //       setIsPlaying(false);
  //     } else {
  //       spotifyApi.play();
  //       setIsPlaying(true);
  //     }
  //   });
  // };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          src={songInfo?.album.images?.[0]?.url}
          className="hidden md:inline w-10 h-10"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-xs text-gray-500">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      {/* center */}
      <WebPlayback />

      {/* Right */}
      <div className="flex items-center justify-end space-x-3 md:space-x-4 pr-5">
        <VolumeOffIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          min={0}
          max={100}
          className="w-14 md:w-28"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
};

export default Player;
