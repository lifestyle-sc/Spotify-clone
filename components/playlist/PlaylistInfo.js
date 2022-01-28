import { useSession } from "next-auth/react";
import { useRecoilValue } from "recoil";
import { playlistState } from "../../atom/playlistAtom";

const PlaylistInfo = () => {
  const { data: session } = useSession();
  const playlist = useRecoilValue(playlistState);
  return (
    <>
      {playlist && (
        <div className="flex items-end ">
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className=" h-[25vw] xl:h-[20vw] shadow-2xl"
          />

          <div className="grow p-2">
            <strong className="uppercase text-[13px]">{playlist.type}</strong>
            <h2 className="text-2xl md:text-3xl xl:text-4xl mb-[10px] font-bold max-h-[19vh] overflow-hidden break-words">
              {playlist.name}
            </h2>
            <div className="hidden md:block">
              {playlist.description && (
                <h3 className="text-[14px] text-gray-400 font-semibold max-h-[13vh] overflow-hidden">
                  {playlist.description}
                </h3>
              )}
              <span className="text-[14px] font-bold">
                {playlist.owner.display_name === session?.user?.name ? (
                  <img
                    src={session?.user?.image}
                    className="w-6 h-6 rounded-full inline mr-2"
                  />
                ) : (
                  <img
                    src={playlist.images[0].url}
                    className="w-6 h-6 rounded-full inline mr-2"
                  />
                )}
                {playlist.owner.display_name} .
                <span className="text-gray-400 px-2">
                  {playlist.followers.total} likes
                </span>
                .
                <span className="text-gray-400 px-2">
                  {playlist.tracks.items.length} songs
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistInfo;
