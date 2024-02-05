import { ANIME } from "@consumet/extensions";
import Image from "next/image";
import Link from "next/link";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const gogoanime = new ANIME.Gogoanime();
  const animeInfo = await gogoanime.fetchAnimeInfo(params.id as string);
  if (!animeInfo)
    return (
      <div>
        Sorry, an unexpected error occured, we were unable to fetch the anime.
      </div>
    );

  return (
    <main className="min-h-screen mt-16">
      {/* Anime Information Section */}
      <div className="block sm:flex h-fit mx-8">
        <Image
          className="h-[40vh] object-cover rounded-md sm:h-72 sm:w-auto"
          src={animeInfo.image as string}
          alt={animeInfo.title as string}
          width={500}
          height={500}
          unoptimized
        />
        <div className="m-0 mt-8 sm:ml-8 sm:mt-0">
          <h1 className="z-10 text-2xl font-bold text-pretty">
            {animeInfo.title as string}
          </h1>
          <p>Status: {animeInfo.status}</p>
          <p>Season: {animeInfo.type}</p>
          <p>
            Type:{" "}
            {animeInfo.subOrDub?.toUpperCase() || animeInfo.hasSub
              ? "SUB"
              : "DUB"}
          </p>
          <p>Synonyms: {animeInfo.otherName || animeInfo.synonyms}</p>
          <div className="flex gap-2 flex-wrap">
            <p>Genres: </p>
            {animeInfo.genres?.map((genre: string, index: number) => (
              <h1
                className="bg-gray-700 w-fit h-fit rounded-md px-2 text-xs self-center"
                key={index}
              >
                {genre}
              </h1>
            ))}
          </div>
          <p className="mt-4 text-justify line-clamp-4">
            Synopsis: {animeInfo.description}
          </p>
        </div>
      </div>

      {/* Episodes Section */}
      <section className="mx-4 my-8">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {animeInfo.episodes?.map((episode, index) => (
            <Link
              className="bg-gray-900 rounded-md p-3"
              key={index}
              href={`/watch/${episode.id}`}
            >
              <p>Episode {episode.number}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
