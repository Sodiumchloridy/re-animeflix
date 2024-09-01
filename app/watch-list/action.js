'use server';
import { ANIME } from '@consumet/extensions';
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const fetchWatchList = async () => {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return [];
    }
    console.log("action session user:", session);
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("re-animeflix");
    const usersCollection = db.collection("users");

    // Fetch the user from the database
    const user = await usersCollection.findOne({ username: session.user.name });
    console.log("Action User:", user);
    if (!user || !user.animes) {
      return [];
    }
    const watchList = user.animes;
    const gogoanime = new ANIME.Gogoanime();

    // Fetch the anime details asynchronously
    const animes = await Promise.all(
      watchList.map(async (anime) => {
        const searchResponse = await gogoanime.search(anime.title);
        return searchResponse.results[0]; // Assuming the first result is the correct one
      })
    );
    console.log("Watch list:", animes);
    return animes;

  } catch (err) {
    console.error("Error fetching watch list:", err);
    return [];
  }
};