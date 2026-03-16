import Image from "next/image";
import Link from "next/link";
import AnimeCard from "./_components/AnimeCard";
import { fetchRecentEpisodes, fetchTopAiring } from "./lib/anime-client";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Home() {
  const topAiring = await fetchTopAiring();
  const recentEpisodes = await fetchRecentEpisodes();
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in duration-700">
      {/* Recent Episodes */}
      <section className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Recent Episodes
        </h1>
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {recentEpisodes.results.map((anime: any, index: number) => (
            <AnimeCard anime={anime} key={index} />
          ))}
        </div>
      </section>

      {/* Top Airing */}
      <aside className="w-full lg:w-[350px] xl:w-[400px] shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Top Airing
        </h1>
        <div className="flex flex-col gap-4">
          {topAiring.results.map((anime: any, index: number) => (
            <Link
              key={index}
              href={`anime/${anime.id}?ep=1`}
              className="group flex gap-4 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  src={anime.image}
                  alt={anime.title}
                  fill
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div className="flex flex-col py-1 overflow-hidden">
                <h2 className="font-semibold text-sm sm:text-base text-white/90 group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                  {anime.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {anime.genres?.slice(0, 3).map((genre: string, idx: number) => (
                    <span
                      className="bg-white/10 text-white/80 rounded-full px-2.5 py-0.5 text-[10px] xl:text-xs tracking-wider border border-white/5"
                      key={idx}
                    >
                      {genre}
                    </span>
                  ))}
                  {anime.genres?.length > 3 && (
                     <span className="text-white/50 text-[10px] xl:text-xs py-0.5">+{anime.genres.length - 3}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
