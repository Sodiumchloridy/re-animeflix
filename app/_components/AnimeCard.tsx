import Link from "next/link";
import WatchListButton from "./shared/WatchListButton/WatchListButton";
import { IAnimeResult } from "@consumet/extensions";

export default function AnimeCard({ anime }: { anime: IAnimeResult }) {
    return (
        <Link
            href={`anime/${anime.id}`}
            className="relative hover:scale-105 transition-transform duration-200"
        >
            <img
                className="aspect-[3/4] object-cover"
                src={anime.image as string}
                alt={anime.title as string}
                width={300}
                height={500}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/75 to-transparent text-white p-2 flex justify-between gap-2 items-end">
                <h2 className="text-sm line-clamp-3 mt-1">
                    {anime.title as string}
                </h2>
                <WatchListButton id={anime.id} title={anime.title as string} />
            </div>
        </Link>
    );
}
