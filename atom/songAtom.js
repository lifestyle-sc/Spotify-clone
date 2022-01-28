import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

export const currentTrackState = atom({
  key: "currentTrackState",
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const volumeState = atom({
  key: "volumeState",
  default: 50,
})
