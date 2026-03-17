import Image from "next/image";
import VideoPlayer from "./VideoPlayer";
import Link from "next/link";
import { getAnimeInfo, getEpisodeSources } from "@/app/lib/anime-client";
import { redirect } from "next/navigation";
import SynopsisText from "@/app/_components/SynopsisText";

export default async function AnimePage({
  params,
  searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = await params;
  const { ep } = await searchParams;

  let animeInfo: any;
  try {
    animeInfo = await getAnimeInfo(id);
  } catch (e) {
    console.error("Failed to load anime info:", e);
  }

  if (!ep || Number(ep) < 1 || !animeInfo?.episodes?.length || Number(ep) > animeInfo.episodes.length) {
    return redirect(`/anime/${id}?ep=1`);
  }

  const episodeId = animeInfo.episodes[Number(ep) - 1].id;
  let currentEpisodeSource: any[] = [];
  try {
    const result = await getEpisodeSources(episodeId);
    currentEpisodeSource = result?.sources || [];
  } catch (e) {
    console.error("Failed to load episode sources:", e);
  }

  // Select Video Url - prefer subbed, highest quality
  const subSources = currentEpisodeSource?.filter((s: any) => !s.isDub) || [];
  const videoUrl =
    subSources.find((s: any) => s.quality?.includes("1080p")) ||
    subSources.find((s: any) => s.quality?.includes("720p")) ||
    currentEpisodeSource?.find((s: any) => s.quality === "default") ||
    currentEpisodeSource?.[0];

  if (!animeInfo) {
    return (
      <div className="w-full flex justify-center mt-16 text-white">
        Unable to load anime info.
      </div>
    );
  }

  return (
    <main className="w-full flex flex-col gap-8 pb-10 animate-in fade-in duration-700">
      {/* Video Player Section */}
      <div className="w-full flex justify-center mt-2 lg:mt-6">
        <div className="w-full max-w-6xl bg-black/50 backdrop-blur-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center min-h-[50vh] text-center p-8">
          {videoUrl?.url ? (
             <VideoPlayer option={{ url: videoUrl.url as string }} />
          ) : (
             <h2 className="text-xl text-white/50">
               Video source currently unavailable. This is usually caused by cloudflare bot protection blocking the server&apos;s IP.
             </h2>
          )}
        </div>
      </div>

      {/* Information and Episodes Container */}
      <div className="flex flex-col xl:flex-row gap-8 w-full max-w-6xl mx-auto">
        {/* Anime Information Section */}
        <section className="flex-1 flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
          {/* Subtle top glare effect to fix blending */}
          <div className="absolute top-0 left-0 right-0 h-[10px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="shrink-0 self-start relative overflow-hidden rounded-xl border border-white/10 shadow-lg group">
            <Image
              className="h-72 w-52 sm:h-80 sm:w-56 object-cover group-hover:scale-105 transition-transform duration-500"
              src={animeInfo.image as string}
              alt={animeInfo.title as string}
              width={300}
              height={450}
              unoptimized
            />
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 space-y-4 text-white/80">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {animeInfo.title as string}
            </h1>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm max-w-md">
              <p><span className="text-white/50">Status:</span> <span className="text-white">{animeInfo.status}</span></p>
              <p><span className="text-white/50">Season:</span> <span className="text-white">{animeInfo.type}</span></p>
              <p><span className="text-white/50">Type:</span> <span className="text-white">{animeInfo.hasSub ? "SUB" : "DUB"}</span></p>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-white/50 text-sm">Genres:</span>
              {animeInfo.genres?.map((genre: string, index: number) => (
                <span
                  className="bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full px-3 py-1 text-xs"
                  key={index}
                >
                  {genre}
                </span>
              ))}
            </div>

            {animeInfo.description && (
              <div className="pt-2 border-t border-white/10 mt-auto">
                <span className="text-white/50 text-sm mb-1 block">Synopsis:</span>
                <SynopsisText text={animeInfo.description} />
              </div>
            )}
          </div>
        </section>

        {/* Episodes Section */}
        <section className="w-full xl:w-[350px] shrink-0 p-6 sm:p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col max-h-[600px] overflow-hidden relative">
          {/* Subtle top glare effect to fix blending */}
          <div className="absolute top-0 left-0 right-0 h-[10px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Episodes
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 xl:grid-cols-4 gap-2 sm:gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {animeInfo.episodes?.map((episode: any, index: number) => {
              const epNumber = index + 1;
              const isActive = ep === String(epNumber);
              return (
                <Link
                  key={episode.id}
                  href={`/anime/${id}?ep=${epNumber}`}
                  className={`
                    relative flex items-center justify-center aspect-square rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400" 
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-purple-500/50"}
                  `}
                >
                  {epNumber}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
