import Link from "next/link";
import { IAnimeResult } from "@consumet/extensions";

export default function AnimeCard({ anime }: { anime: IAnimeResult }) {
    return (
        <Link
            href={`anime/${anime.id}?ep=1`}
            className="group relative flex flex-col rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:bg-white/10 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
        >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={anime.image as string}
                    alt={anime.title as string}
                    width={300}
                    height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-sm font-medium text-white/90 group-hover:text-purple-300 line-clamp-2 drop-shadow-md transition-colors">
                        {anime.title as string}
                    </h2>
                </div>
            </div>
        </Link>
    );
}
