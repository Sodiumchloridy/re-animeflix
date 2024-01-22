import { ANIME } from "@consumet/extensions"
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import CarouselWithContent from "./Carousel"

export default async function Home() {
  const gogoanime = new ANIME.Gogoanime()
  const topAiring = await gogoanime.fetchTopAiring()
  const recentEpisodes = await gogoanime.fetchRecentEpisodes()
  
  return (
    <main className="min-h-screen">
      {/* Trending Anime */}
      <CarouselWithContent/>
      <div className="block lg:flex mt-8">
        {/* Recent Episodes */}
        <aside className="mx-16">
          <h1 className="text-4xl font-semibold my-4">Recent Episodes</h1>
          <div className="grid gap-5 grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {
              recentEpisodes.results.map((anime, index) => (
                <Link key={index} href={`anime/${anime.id}`}>
                  <Image
                    className="aspect-[3/4] object-cover rounded-lg mb-1"
                    src={anime.image as string} 
                    alt={anime.title as string} 
                    width={300} 
                    height={500}
                    unoptimized
                  />
                  <h2 className="text-xs">{anime.title as string}</h2>
                </Link>
              ))
            }
          </div>
        </aside>
        {/* Top Airing */}
        <aside className="w-full ml-16 lg:mr-16 lg:ml-0">
          <h1 className="font-semibold text-xl my-4">Top Airing This Season</h1>
            {
              topAiring.results.map((anime:any, index:number) => (
                <Link className="flex my-4" key={index} href={`anime/${anime.id}`}>
                  <Image
                    className="object-cover h-32 w-24 flex-none rounded-l-lg"
                    src={anime.image} 
                    alt={anime.title} 
                    width={300} 
                    height={500}
                    unoptimized
                  />
                  <div className="w-full p-2 bg-blue-gray-900 rounded-r-lg">
                    <h1 className="m-1 text-sm">{anime.title}</h1>
                    <div className="flex gap-2 flex-wrap">
                    {anime.genres.map((genre:string, index:number) => (
                      <h1 className="bg-gray-700 w-fit rounded-md px-2 text-xs" key={index}>{genre}</h1>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            }
        </aside>
      </div>
    </main>
  )
}
