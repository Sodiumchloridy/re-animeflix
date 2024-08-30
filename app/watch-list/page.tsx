"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ANIME } from "@consumet/extensions";

const matchAnime = async (watchList: any) => {
  const gogoanime = new ANIME.Gogoanime();
  const searchResponse = await gogoanime.search(watchList);

  return searchResponse;
};

export default function WatchList() {
  const [watchList, setWatchList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const response = await fetch("/api/watch-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWatchList(data.watchList);
        } else {
          const data = await response.json();
          setError(data.message || "Failed to fetch watch list");
        }
      } catch (err) {
        console.error("Error fetching watch list:", err);
        setError("An unexpected error occurred");
      }
    };

    fetchWatchList();
  }, []);

  return (
    <div className="p-16 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Watch List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {watchList.length > 0 ? (
        <ul className="space-y-2">
          {watchList.map((anime) => (
            <li key={anime.id} className="p-2 border-b border-gray-600">
              {anime.title}
              <span className="text-sm text-gray-400">(ID: {anime.id})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No animes in your watch list.</p>
      )}
    </div>
  );
}

{
  /* <main className="w-[90%] mx-auto min-h-[200px] mb-10">
<h1 className="mt-16 mb-4 text-xl">
  Found {searchResponse.results.length} Results.
</h1>
<div className="grid grid-cols-8 gap-2">
  {searchResponse.results.map((anime) => {
    return (
      <Link key={anime.id} href={`/anime/${anime.id}?ep=1`}>
        <Image
          className="aspect-[3/4] rounded-md"
          src={anime.image as string}
          alt={anime.title as string}
          width={300}
          height={400}
          unoptimized
        />
        <h1 className="line-clamp-3">{anime.title as string}</h1>
        <h1>{anime.releaseDate}</h1>
      </Link>
    );
  })}
</div>
</main> */
}
