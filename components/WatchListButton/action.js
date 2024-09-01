'use server';

import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const handleAddToList = async (id, title) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error('Login required');
    }

    const client = await clientPromise;
    const db = client.db('re-animeflix');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username: session.user.name });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.animes.some(anime => anime.id === id)) {
      await usersCollection.updateOne(
        { username: session.user.name },
        { $push: { animes: { id, title } } }
      );
    }

    return { message: 'Anime added to watch list' };
  } catch (error) {
    console.error('Failed to add anime to watch list:', error);
    throw new Error('Failed to add anime to watch list');
  }
};

export const handleRemoveFromList = async (id) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error('Login required');
    }

    const client = await clientPromise;
    const db = client.db('re-animeflix');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username: session.user.name });

    if (!user) {
      throw new Error('User not found');
    }

    await usersCollection.updateOne(
      { username: session.user.name },
      { $pull: { animes: { id } } }
    );

    return { message: 'Anime removed from watch list' };
  } catch (error) {
    console.error('Failed to remove anime from watch list:', error);
    throw new Error('Failed to remove anime from watch list');
  }
};
