import React, { useState, useEffect } from "react";
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    SwitchHorizontalIcon,
  } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentTrackIdState, currentTrackState, isPlayingState } from "../../atom/songAtom";
import { errorMsgState } from "../../atom/errorAtom";

function WebPlayback({ songInfo }) {
  const { data: session, status } = useSession();

  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
 // const isPlaying = useRecoilValue(isPlayingState);
  const [ errorMsg, setErrorMsg ] = useRecoilState(errorMsgState)

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(session?.user?.accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setCurrentTrackId(state.track_window.current_track.id);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  const togglePlay = () => {
      if(!is_active) {
          setErrorMsg('Instance not active. Transfer your playback using your Spotify app')

          setTimeout(() => { setErrorMsg(null) }, 3000)
      }else{
          player.togglePlay()
      }
  }

  return (
    <div className="flex items-center justify-evenly">
      <SwitchHorizontalIcon className="button" />
      <RewindIcon onClick={() => { player.previousTrack() }} className="button" />
      {!is_paused? (
        <PauseIcon onClick={togglePlay} className="button w-10 h-10" />
      ) : (
        <PlayIcon onClick={togglePlay} className="button w-10 h-10" />
      )}

      <FastForwardIcon onClick={() => { player.nextTrack() }} className="button" />
      <ReplyIcon className="button" />
    </div>
  );
}

export default WebPlayback;
