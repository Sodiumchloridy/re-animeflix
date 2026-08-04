import Image from "next/image";
import Link from "next/link";
import AnimeCard from "./_components/AnimeCard";
import HeroCarousel from "./_components/HeroCarousel";
import { fetchRecentEpisodes, fetchTopAiring } from "./lib/anime-client";

export const revalidate = 3600;

export default async function Home() {
  const topAiring = await fetchTopAiring();
  const recentEpisodes = await fetchRecentEpisodes();

  const featuredList = topAiring.results.slice(0, 7).map((a: any) => ({
    id: a.id,
    title: a.title,
    image: a.image,
    bannerImage: a.image,
    genres: a.genres,
    type: a.type,
    episodes: a.episodeNumber,
    year: a.year || 2026,
  }));

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* 3D Hero Showcase Section (LunarAnime style) */}
      <HeroCarousel items={featuredList} />

      {/* Main Grid & Ranking Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Recent Episodes Column */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              Recent Episodes
            </h1>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {recentEpisodes.results.map((anime: any, index: number) => (
              <AnimeCard anime={anime} key={anime.id || index} />
            ))}
          </div>
        </section>

        {/* Top Airing Sidebar (Miruro style) */}
        <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-4">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Top Airing
            </h2>
            <span className="text-xs text-zinc-400 font-medium">Rankings</span>
          </div>

          <div className="flex flex-col gap-3">
            {topAiring.results.slice(0, 10).map((anime: any, index: number) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              return (
                <Link
                  key={anime.id || index}
                  href={`/anime/${anime.id}?ep=1`}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-[#12151e] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all duration-200"
                >
                  {/* Rank Badge */}
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      isTop3
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
                        : "bg-white/5 text-zinc-400 border border-white/10"
                    }`}
                  >
                    {String(rank).padStart(2, "0")}
                  </span>

                  {/* Thumbnail */}
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                    <Image
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      src={anime.image}
                      alt={anime.title}
                      fill
                      sizes="48px"
                      unoptimized
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col min-w-0 flex-1 space-y-1">
                    <h3 className="font-semibold text-xs text-zinc-100 group-hover:text-purple-300 line-clamp-1 transition-colors">
                      {anime.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span className="uppercase font-medium px-1.5 py-0.2 rounded bg-white/5 border border-white/10">
                        {anime.type || "TV"}
                      </span>
                      {anime.genres?.[0] && (
                        <span className="text-zinc-400">{anime.genres[0]}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
