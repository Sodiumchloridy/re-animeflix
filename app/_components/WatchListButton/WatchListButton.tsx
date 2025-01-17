"use client";

import { useState, useEffect, useRef } from "react";
import { handleAddToList, handleRemoveFromList } from "./action";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

type Anime = {
  id: string;
  title: string;
};

export default function WatchListButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const { data: session, status } = useSession();
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const isAdded = (session?.watchList ?? []).some(
        (anime: Anime) => anime.id === id
      );
      setIsInWatchList(isAdded);
      // console.log(session?.watchList);
    }
  }, [status, id, session]);

  const handleAdd = async () => {
    try {
      if (!session) {
        setError("Please login to add anime to your list.");
        dialogRef.current?.showModal();
        return;
      }
      await handleAddToList(id, title);
      // Only refresh on watch-list page by checking routes name
      if (pathname === "/watch-list") {
        router.refresh(); // Refresh page if on the watch list page
      }
      setTimeout(() => setIsInWatchList(true), 2000);
      
    } catch (error) {
      setError("Failed to add anime.");
      dialogRef.current?.showModal();
    }
  };

  const handleRemove = async () => {
    try {
      await handleRemoveFromList(id);
      // Only refresh on watch-list page by checking routes name
      if (pathname === "/watch-list") {
        router.refresh(); // Refresh page if on the watch list page
      }
      setTimeout(() => setIsInWatchList(false), 2000);

    } catch (error) {
      setError("Failed to remove anime.");
      dialogRef.current?.showModal();
    }
  };

  return (
    <>
      {isInWatchList ? (
        <button
          type="button"
          title="Remove from List"
          onClick={handleRemove}
          className="bg-red-500 hover:bg-red-700 text-white font-normal py-2 px-4 rounded-full mt-2"
        >
          Remove from List
        </button>
      ) : (
        <button
            type="button"
            title="Add to List"
            className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full mt-2"
            onClick={handleAdd}
        >
          Add to List
        </button>
      )}
      {
        <dialog ref={dialogRef} className="z-50 text-center p-4 rounded-xl">
          <p className="text-red-500">{error}</p>
          <button onClick={() => dialogRef.current?.close()} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full mt-4">Ok!</button>
        </dialog>}
    </>
  );
}
