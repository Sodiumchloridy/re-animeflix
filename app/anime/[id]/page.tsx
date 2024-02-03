import { ANIME } from "@consumet/extensions";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const gogoanime = new ANIME.Gogoanime();
  const animeInfo = await gogoanime.fetchAnimeInfo(params.id as string);
  console.log(animeInfo);
  const jikanSearch = await axios.get(
    `https://api.jikan.moe/v4/anime?q=${animeInfo.title}`
  );
  const animeData = jikanSearch.data.data[0];

  if (!animeInfo)
    return (
      <div>
        Sorry, an unexpected error occured, we were unable to fetch the anime.
      </div>
    );

  return (
    <main className="min-h-screen mt-28">
      <div className="block md:flex h-fit mx-8">
        <Image
          className="h-72 w-auto rounded-md mr-8"
          src={animeData.images.webp.large_image_url as string}
          alt={animeData?.title as string}
          width={500}
          height={500}
          unoptimized
        />
        <div>
          <h1 className="mr-8 z-10 text-2xl font-bold text-pretty">
            {animeData?.title as string}
          </h1>
          <p>Score: {animeData.score}/10 (on MAL)</p>
          <p>Status: {animeData.status}</p>
          <p>Broadcasts on {animeData.broadcast.string}</p>
          <p className="mt-8 text-justify">Synopsis: {animeData.synopsis}</p>
        </div>
      </div>
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
