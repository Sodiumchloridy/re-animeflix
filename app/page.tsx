import { ANIME } from "@consumet/extensions";
import Image from "next/image";
import Link from "next/link";
import CarouselWithContent from "./_components/Carousel";
import WatchListButton from "@/app/_components/WatchListButton/WatchListButton";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Home() {
  const gogoanime = new ANIME.Gogoanime();
  const topAiring = await gogoanime.fetchTopAiring();
  const recentEpisodes = await gogoanime.fetchRecentEpisodes();
  return (
    <main className="bg-gray-900">
      {/* Trending Anime */}
      <CarouselWithContent />

      <div className="block xl:flex mt-8 w-auto">
        {/* Recent Episodes */}
        <aside className="w-full px-4">
          <h1 className="text-3xl font-semibold my-4">Recent Episodes</h1>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(125px,1fr))]">
            {recentEpisodes.results.map((anime, index: number) => (
              <div key={index}>
                <Link
                  // key={index}
                  href={`anime/${anime.id}`}
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
                  <h2 className="text-sm line-clamp-2 mt-1">
                    {anime.title as string}
                  </h2>
                </Link>
                <WatchListButton id={anime.id} title={anime.title as string} />
              </div>
            ))}
          </div>
        </aside>

        {/* Top Airing TODO */}
        <aside className="w-full pb-4 px-8 lg:pl-0 lg:pr-12 xl:max-w-[40vw]">
          <h1 className="font-semibold text-3xl my-4">Top Airing</h1>
          {topAiring.results.map((anime: any, index: number) => (
            <Link className="flex my-4" key={index} href={`anime/${anime.id}`}>
              <Image
                className="object-cover h-32 w-24 flex-none rounded-l-lg"
                src={anime.image}
                alt={anime.title}
                width={300}
                height={500}
                unoptimized
              />
              {/* Anime Title and Genre */}
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
