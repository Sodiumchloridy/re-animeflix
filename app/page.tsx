import Image from "next/image";
import Link from "next/link";
import CarouselWithContent from "./_components/Carousel";
import AnimeCard from "./_components/AnimeCard";
import { fetchRecentEpisodes, fetchTopAiring } from "./lib/anime-client";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Home() {
  const topAiring = await fetchTopAiring();
  const recentEpisodes = await fetchRecentEpisodes();
  return (
    <main className="bg-gray-900">
      {/* Trending Anime */}
      <CarouselWithContent />

      <div className="block xl:flex mt-4 w-auto">
        {/* Recent Episodes */}
        <aside className="w-full px-4">
          <h1 className="text-3xl font-semibold my-4">Recent Episodes</h1>
          <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
            {recentEpisodes.results.map((anime, index: number) => (
              <AnimeCard anime={anime} key={index} />
            ))}
          </div>
        </aside>

        {/* Top Airing */}
        <aside className="w-full pb-4 px-8 lg:pl-0 lg:pr-12 xl:max-w-[40vw]">
          <h1 className="font-semibold text-3xl my-4">Top Airing</h1>
          {topAiring.results.map((anime: any, index: number) => (
            <Link className="flex my-4 group/airing overflow-clip rounded-lg" key={index} href={`anime/${anime.id}`}>
              <Image
                className="object-cover h-32 w-24 flex-none group-hover/airing:scale-110 transition-transform duration-200"
                src={anime.image}
                alt={anime.title}
                width={300}
                height={500}
                unoptimized
              />
              {/* Anime Title and Genre */}
              <div className="w-full p-2 bg-blue-gray-900 max-h-32 overflow-clip">
                <h1 className="m-1 text-sm line-clamp-2">{anime.title}</h1>
                <div className="flex gap-2 flex-wrap">
                  {anime.genres?.map((genre: string, index: number) => (
                    <h1
                      className="bg-gray-700 w-fit rounded-md px-2 text-xs"
                      key={index}
                    >
                      {genre}
                    </h1>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </main>
  );
}
