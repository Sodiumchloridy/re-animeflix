import { ANIME } from "@consumet/extensions";
import Image from "next/image";
import Link from "next/link";

export default async function Search({ searchParams }: { searchParams: any }) {
  let query = decodeURIComponent(searchParams.query);
  const gogoanime = new ANIME.Gogoanime();
  const searchResponse = await gogoanime.search(query);

  return (
    <main className="w-[90%] mx-auto min-h-[200px]">
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
    </main>
  );
}
