import { ANIME, ISearch, IAnimeResult } from "@consumet/extensions";
import Image from "next/image";
import Link from "next/link";

export default async function AnimePage({params} : {params: {id: string}}) {
    const animepahe = new ANIME.AnimePahe();
    const animeSearch:ISearch<IAnimeResult> = await animepahe.search(params.id);
    const animeInfo = await animepahe.fetchAnimeInfo(animeSearch.results[0].id)

    return (
        <main className="min-h-screen">
            <div className="relative w-full h-[35vh]"> 
                <Image
                    className="object-cover"
                    src={animeInfo?.cover as string}
                    alt={animeInfo?.title as string}
                    fill
                    unoptimized
                />
                <p className="absolute bottom-4 left-4 mr-8 z-10 text-2xl font-bold text-pretty">{animeInfo?.title as string}</p>
            </div>
            <p className="mx-4 mt-4 text-justify text-sm">{animeInfo.description}</p>
            <p className="mx-4 my-2 text-pretty text-sm">Status: {animeInfo.status}</p>
            <section className="mx-4 my-8">
                <div className="grid grid-cols-2 gap-3">
                    {
                        animeInfo?.episodes?.map((episode, index) => (
                            <Link key={index} href={`/watch/episode.id`}>
                                <Image
                                    className="rounded-md"
                                    src={episode.image as string}
                                    width={600}
                                    height={400}
                                    unoptimized
                                    alt={`Episode ${index + 1} Image`}
                                />
                                <h2>{episode.title}</h2>
                                <p>Episode {index + 1}</p>
                                <p>Duration: {episode.duration as string}</p>
                            </Link>
                        ))
                    }
                </div>
            </section>
        </main>
    )
}