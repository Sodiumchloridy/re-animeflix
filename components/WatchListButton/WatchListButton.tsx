"use client";

import { useState, useEffect } from "react";
import { handleAddToList, handleRemoveFromList } from "./action";
import { useSession } from "next-auth/react";

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

  useEffect(() => {
    if (status === "authenticated") {
      const isAdded = (session?.watchList ?? []).some(
        (anime: Anime) => anime.id === id
      );
      setIsInWatchList(isAdded);
    }
  }, [status, id, session]);

  const handleAdd = async () => {
    try {
      if (!session) {
        setError("Please login to add anime to your list");
        return;
      }
      await handleAddToList(id, title);
      setIsInWatchList(true);
    } catch (error) {
      setError("Failed to add anime");
    }
  };

  const handleRemove = async () => {
    try {
      await handleRemoveFromList(id);
      setIsInWatchList(false);
    } catch (error) {
      setError("Failed to remove anime");
    }
  };

  return (
    <div className="p-2">
      {isInWatchList ? (
        <button
          onClick={handleRemove}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Remove from List
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to List
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
