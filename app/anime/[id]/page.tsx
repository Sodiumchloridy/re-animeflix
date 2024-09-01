import { ANIME } from "@consumet/extensions";
import Image from "next/image";
import VideoPlayer from "./VideoPlayer";
import Link from "next/link";
import WatchListButton from "@/components/WatchListButton/WatchListButton";

export default async function AnimePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: any;
}) {
  // Init variables
  if (!searchParams.ep) searchParams.ep = 1;
  const gogoanime = new ANIME.Gogoanime();
  let animeInfo;
  let currentEpisodeSource;

  //Fetch Anime Info
  animeInfo = await gogoanime.fetchAnimeInfo(params.id as string).catch((e) => {
    console.log(e);
  });

  // Fetch Episode Sources
  currentEpisodeSource = await gogoanime
    .fetchEpisodeSources(
      animeInfo?.episodes?.[searchParams.ep - 1].id as string
    )
    .catch((e) => {
      console.log(e);
    });

  // Select Video Url
  let videoUrl =
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
    <main className="bg-black">
      <div className="w-full flex justify-center my-16 bg-gray-900">
        <VideoPlayer url={videoUrl?.url as string} />
      </div>

      {/* Anime Information Section */}
      <section className="block sm:flex h-fit px-16 text-white">
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
          <WatchListButton
            id={animeInfo.id}
            title={animeInfo.title as string}
          />
        </div>
      </section>

      {/* Episodes Section */}
      <section className="px-16 mb-10">
        <h1 className="text-3xl my-4">Episodes</h1>
        <div className="grid gap-3 grid-cols-10">
          {animeInfo.episodes?.map((episode: any) => {
            const isActive: Boolean =
              searchParams.ep == (episode.number as number);
            return (
              <Link
                className={`rounded-md p-3 grid place-items-center  ${
                  isActive ? "bg-red-900" : "bg-red-600"
                }`}
                key={episode.number}
                href={`/anime/${params.id}?ep=${episode.number}`}
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
