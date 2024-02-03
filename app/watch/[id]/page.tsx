import { ANIME } from "@consumet/extensions";
import VideoPlayer from "./VideoPlayer";

export default async function WatchPage({
  params,
}: {
  params: { id: string };
}) {
  const gogoanime = new ANIME.Gogoanime();
  const episodeSources = await gogoanime.fetchEpisodeSources(
    decodeURIComponent(params.id)
  );
  console.log(episodeSources);
  const sourceHD = episodeSources.sources.find(
    (source) => source.quality === "1080p"
  );
  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%]">
        <VideoPlayer url={sourceHD?.url as string} />
      </div>
    </div>
  );
}
