import Image from "next/image";
import WatchPlayer from "./WatchPlayer";
import Link from "next/link";
import { getAnimeInfo, getEpisodeSources } from "@/app/lib/anime-client";
import { redirect } from "next/navigation";
import SynopsisText from "@/app/_components/SynopsisText";
import EpisodeSelector from "@/app/_components/EpisodeSelector";

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
  } catch (e: any) {
    const isRateLimit = e?.message?.includes("ratelimit");
    return (
      <div className="w-full flex justify-center py-20 text-zinc-100">
        <div className="text-center max-w-md p-6 rounded-2xl bg-[#12151e] border border-white/10 space-y-3">
          <h2 className="text-lg font-bold text-red-400">Unable to load anime info</h2>
          {isRateLimit ? (
            <p className="text-xs text-yellow-300">
              We&apos;re being rate-limited by the data provider. Please wait a few minutes before trying again.
            </p>
          ) : (
            <p className="text-xs text-zinc-400">The service may be temporarily unavailable. Please try again later.</p>
          )}
          <Link
            href="/"
            className="inline-block mt-4 text-xs font-semibold px-4 py-2 rounded-xl bg-purple-600 text-white"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!animeInfo || !animeInfo.episodes?.length) {
    return (
      <div className="w-full flex justify-center py-20 text-zinc-100">
        <div className="text-center max-w-md p-6 rounded-2xl bg-[#12151e] border border-white/10 space-y-3">
          <h2 className="text-lg font-bold text-zinc-200">Anime Not Found</h2>
          <p className="text-xs text-zinc-400">This anime title or episode release is unavailable.</p>
          <Link
            href="/"
            className="inline-block mt-2 text-xs font-semibold px-4 py-2 rounded-xl bg-purple-600 text-white"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const episodeNum = ep ? Number(ep) : 1;
  if (episodeNum < 1 || episodeNum > animeInfo.episodes.length) {
    return redirect(`/anime/${id}?ep=1`);
  }

  const episodeId = animeInfo.episodes[episodeNum - 1].id;
  let servers: any[] = [];
  try {
    const result = await getEpisodeSources(episodeId, id, episodeNum);
    servers = result?.servers || [];
  } catch (e) {
    console.error("Failed to load episode sources:", e);
  }

  const prevEp = episodeNum > 1 ? episodeNum - 1 : null;
  const nextEp = episodeNum < animeInfo.episodes.length ? episodeNum + 1 : null;
  const relations = animeInfo.relations || [];

  return (
    <div className="w-full flex flex-col space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Video Player Section with Prev/Next Navigation */}
      <section className="w-full flex flex-col items-center space-y-4">
        <WatchPlayer servers={servers} animeTitle={animeInfo.title as string} />

        {/* Quick Episode Navigation Toolbar */}
        <div className="w-full max-w-6xl flex items-center justify-between px-4 py-3 bg-[#12151e] border border-white/10 rounded-xl text-xs font-medium text-zinc-300">
          <div>
            <span className="text-zinc-500">Currently Watching:</span>{" "}
            <span className="font-semibold text-purple-300">
              Episode {episodeNum} of {animeInfo.episodes.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {prevEp ? (
              <Link
                href={`/anime/${id}?ep=${prevEp}`}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous EP
              </Link>
            ) : (
              <span className="px-3.5 py-1.5 rounded-lg bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed">
                Previous EP
              </span>
            )}

            {nextEp ? (
              <Link
                href={`/anime/${id}?ep=${nextEp}`}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-500 transition-colors flex items-center gap-1.5"
              >
                Next EP
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="px-3.5 py-1.5 rounded-lg bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed">
                Next EP
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Information & Episodes Selector Container */}
      <div className="flex flex-col xl:flex-row gap-8 w-full max-w-6xl mx-auto">
        {/* Anime Information Box */}
        <section className="flex-1 flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-[#12151e] border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="shrink-0 self-start relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
            <Image
              className="h-72 w-52 sm:h-80 sm:w-56 object-cover"
              src={animeInfo.image as string}
              alt={animeInfo.title as string}
              width={300}
              height={450}
              unoptimized
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1 space-y-4 text-zinc-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                {animeInfo.title as string}
              </h1>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase font-semibold">
                  {animeInfo.type || "TV"}
                </span>
                <span>• {animeInfo.hasSub ? "SUB" : "DUB"}</span>
                <span>• {animeInfo.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {animeInfo.genres?.map((genre: string, index: number) => (
                <span
                  className="bg-white/5 text-zinc-300 border border-white/10 rounded-full px-3 py-0.5 text-xs font-medium"
                  key={index}
                >
                  {genre}
                </span>
              ))}
            </div>

            {animeInfo.description && (
              <div className="pt-3 border-t border-white/10 mt-auto space-y-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Synopsis
                </span>
                <SynopsisText text={animeInfo.description} />
              </div>
            )}
          </div>
        </section>

        {/* Feature-Rich Episodes Selector Box */}
        <section className="w-full xl:w-[360px] shrink-0 p-6 bg-[#12151e] border border-white/10 rounded-2xl shadow-xl flex flex-col">
          <EpisodeSelector
            animeId={id}
            episodes={animeInfo.episodes}
            currentEpNumber={episodeNum}
          />
        </section>
      </div>

      {/* Seasons & Related Anime Section (if relations exist) */}
      {relations.length > 0 && (
        <section className="w-full max-w-6xl mx-auto space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Seasons &amp; Related Titles
            </h2>
            <span className="text-xs text-zinc-400 font-medium">
              {relations.length} Related
            </span>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {relations.map((rel: any) => (
              <Link
                key={rel.id}
                href={`/anime/${rel.id}?ep=1`}
                className="group flex flex-col p-2.5 rounded-xl bg-[#12151e] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-900 mb-2">
                  <Image
                    src={rel.image}
                    alt={rel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-bold tracking-wider text-purple-300 uppercase border border-purple-500/30">
                    {rel.relationType?.replace("_", " ")}
                  </div>
                </div>
                <h3 className="text-xs font-semibold text-zinc-100 group-hover:text-purple-300 line-clamp-1 transition-colors">
                  {rel.title}
                </h3>
                <span className="text-[10px] text-zinc-500 capitalize">
                  {rel.type} {rel.status ? `• ${rel.status.toLowerCase()}` : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
