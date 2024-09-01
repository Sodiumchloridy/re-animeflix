import { fetchWatchList } from "./action";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function WatchList() {
  console.log("consolelog")
  const session = await getServerSession(authOptions as any);
  console.log("session", session);
  if (!session) {
    return (
      <main className="w-[90%] mx-auto min-h-[200px] mb-10">
        <h1 className="mt-16 mb-4 text-xl">
          Please login to view your watch list
        </h1>
      </main>
    );
  }

  const animes = await fetchWatchList();
  console.log("animes", animes);
  return (
    <main className="w-[90%] mx-auto min-h-[200px] mb-10">
      <h1 className="mt-16 mb-4 text-xl">My Watch List</h1>
      <div className="grid grid-cols-8 gap-2">
        {animes.map((anime) => (
          <Link key={anime?.id} href={`/anime/${anime?.id}?ep=1`}>
            <Image
              className="aspect-[3/4] rounded-md"
              src={anime?.image as string}
              alt={anime?.title as string}
              width={300}
              height={400}
              unoptimized
            />
            <h1 className="line-clamp-3">{anime?.title as string}</h1>
            <h1>{anime?.releaseDate}</h1>
          </Link>
        ))}
      </div>
    </main>
  );
}
