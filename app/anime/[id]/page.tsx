import Image from "next/image";
import VideoPlayer from "./VideoPlayer";
import Link from "next/link";
import WatchListButton from "@/app/_components/shared/WatchListButton/WatchListButton";
import { getAnimeInfo, getEpisodeSources } from "@/app/lib/anime-client";
import { redirect } from "next/navigation";

export default async function AnimePage({
  params,
  searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = await params;
  const { ep } = await searchParams;

  const animeInfo = await getAnimeInfo(id);
  if (!ep || Number(ep) < 1 || !animeInfo.episodes?.length || Number(ep) > animeInfo.episodes.length) {
    return redirect(`/anime/${id}?ep=1`);
  }

  const episodeId = animeInfo.episodes[Number(ep) - 1].id;
  const currentEpisodeSource = await getEpisodeSources(episodeId);

  // Select Video Url
  const videoUrl =
    currentEpisodeSource?.sources.find(
      (source) => source.quality === "default"
    ) || currentEpisodeSource?.sources[0];

  while (!animeInfo || !videoUrl)
    return (
      <div>
        Sorry, an unexpected error occured, we were unable to fetch the anime.
      </div>
    );

  return (
    <main className="bg-black mt-0">
      <div className="w-full flex justify-center my-16 bg-gray-900">
        <VideoPlayer option={{ url: videoUrl.url as string }} />
      </div>

      {/* Anime Information Section */}
      <section className="block sm:flex h-fit px-8 text-white">
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
            {animeInfo.hasSub
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
          <WatchListButton
            id={animeInfo.id}
            title={animeInfo.title as string}
          />
        </div>
      </section>

      {/* Episodes Section */}
      <section className="px-8 mb-10">
        <h1 className="text-3xl my-4">Episodes</h1>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(100px,1fr))]">
          {animeInfo.episodes?.map((episode: any) => {
            const isActive: Boolean =
              Number(ep) == (episode.number as number);
            return (
              <Link
                className={`hover:scale-105 transition-transform duration-200 rounded-md p-3 grid place-items-center  ${
                  isActive ? "bg-red-900" : "bg-red-600"
                }`}
                key={episode.number}
                href={`/anime/${id}?ep=${episode.number}`}
              >
                <p>{episode.number}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
