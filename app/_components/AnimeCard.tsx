import Link from "next/link";
import Image from "next/image";

export interface AnimeCardData {
  id: string;
  title: string;
  image: string;
  status?: string;
  episodeNumber?: number;
  type?: string;
  airingAt?: number;
}

export default function AnimeCard({ anime }: { anime: AnimeCardData }) {
  const isReleasing = anime.status === "RELEASING" || anime.status === "Ongoing";

  return (
    <Link
      href={`/anime/${anime.id}?ep=1`}
      className="group relative flex flex-col rounded-2xl bg-[#12151e] border border-white/10 overflow-hidden hover:border-purple-500/50 hover:shadow-[0_10px_25px_rgba(147,51,234,0.2)] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
        <Image
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={anime.image}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {anime.type && (
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider text-zinc-200 uppercase">
              {anime.type}
            </span>
          )}
          {anime.episodeNumber && (
            <span className="px-2 py-0.5 rounded-md bg-purple-600/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
              EP {anime.episodeNumber}
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      </div>

      <div className="p-3 flex flex-col justify-between flex-1 bg-[#12151e] space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${isReleasing ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`}
            title={anime.status || "Status"}
          />
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-purple-300 line-clamp-1 transition-colors leading-tight">
            {anime.title}
          </h3>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
          <span className="capitalize">{anime.type || "TV"}</span>
          {anime.status && (
            <span className="text-zinc-500 text-[10px] capitalize">{anime.status.toLowerCase()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
