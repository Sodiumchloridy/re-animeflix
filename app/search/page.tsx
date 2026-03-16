import AnimeCard from "../_components/AnimeCard";
import { searchAnime } from "../lib/anime-client";

export default async function Search({ searchParams }: { searchParams: any }) {
  let query = decodeURIComponent(searchParams.query);
  const searchResponse = await searchAnime(query);

  return (
    <main className="w-full flex-1 animate-in fade-in duration-700 font-sans">
      <h1 className="mb-8 text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Found {searchResponse.results.length} Results for "{query}"
      </h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {searchResponse.results.map((anime: any) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </main>
  );
}
