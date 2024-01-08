"use client"
import { ANIME, ISearch, IAnimeResult } from "@consumet/extensions"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  const [topAiring, setTopAiring] = useState<ISearch<IAnimeResult>>();
  const [recentEpisodes, setRecentEpisodes] = useState<ISearch<IAnimeResult>>();

  useEffect(() => {
    let gogoanime = new ANIME.Gogoanime()
    gogoanime.fetchTopAiring().then(data => {
      setTopAiring(data);
    });
    gogoanime.fetchRecentEpisodes().then(data => {
      setRecentEpisodes(data);
    });
  }, []);

  return (
    <main className="min-h-screen">
      <section className="mx-4 my-8">
        <h1 className="text-4xl my-2">Top Airing</h1>
        <div className="grid grid-cols-3 gap-3">
          {
            topAiring?.results.filter(Boolean).map((anime, index) => (
              <Link key={index} href={`anime/${anime.id}`}>
                <Image 
                  src={anime.image as string} 
                  alt={anime.title as string} 
                  width={300} 
                  height={400} 
                  unoptimized
                  className="rounded-md mb-1"
                />
                <h2 className="text-xs">{anime.title as string}</h2>
              </Link>
            ))
          }
        </div>
      </section>
      <section className="mx-4 my-8">
        <h1 className="text-4xl my-2">Recent Episodes</h1>
        <div className="grid grid-cols-3 gap-3">
          {
            recentEpisodes?.results.filter(Boolean).map((anime, index) => (
              <Link key={index} href={`anime/${anime.id}`}>
                <Image 
                  src={anime.image as string} 
                  alt={anime.title as string} 
                  width={300} 
                  height={400} 
                  unoptimized
                  className="rounded-md mb-1"
                />
                <h2 className="text-xs">{anime.title as string}</h2>
              </Link>
            ))
          }
        </div>
      </section>
    </main>
  )
}
