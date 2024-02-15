import { ANIME } from "@consumet/extensions";
import Image from "next/image";
import Link from "next/link";
import CarouselWithContent from "./Carousel";

export const revalidate = 3600;

export default async function Home() {
  const gogoanime = new ANIME.Gogoanime();
  const topAiring = await gogoanime.fetchTopAiring();
  const recentEpisodes = await gogoanime.fetchRecentEpisodes();
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Trending Anime */}
      <CarouselWithContent />
      <div className="block xl:flex mt-8">
        {/* Recent Episodes */}
        <aside className="mx-4 lg:mx-12">
          <h1 className="text-4xl font-semibold my-4">Recent Episodes</h1>
          <div className="grid gap-5 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recentEpisodes.results.map((anime, index) => (
              <Link
                key={index}
                href={`anime/${anime.id}/1`}
                className="relative"
              >
                <Image
                  className="aspect-[3/4] object-cover rounded-md"
                  src={anime.image as string}
                  alt={anime.title as string}
                  width={300}
                  height={500}
                  unoptimized
                />
                <h2 className="text-xs line-clamp-2 mt-1">
                  {anime.title as string}
                </h2>
              </Link>
            ))}
          </div>
        </aside>

        {/* Top Airing */}
        <aside className="w-full block p-4 lg:pr-12">
          <h1 className="font-semibold text-xl my-4">Top Airing This Season</h1>
          {topAiring.results.map((anime: any, index: number) => (
            <Link
              className="flex my-4"
              key={index}
              href={`anime/${anime.id}/1`}
            >
              <Image
                className="object-cover h-32 w-24 flex-none rounded-l-lg"
                src={anime.image}
                alt={anime.title}
                width={300}
                height={500}
                unoptimized
              />
              <div className="w-full p-2 bg-blue-gray-900 rounded-r-lg max-h-32 overflow-clip">
                <h1 className="m-1 text-sm line-clamp-2">{anime.title}</h1>
                <div className="flex gap-2 flex-wrap">
                  {anime.genres.map((genre: string, index: number) => (
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
