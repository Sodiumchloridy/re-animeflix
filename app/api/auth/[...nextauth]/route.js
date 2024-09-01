import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("re-animeflix");
        const user = await db
          .collection("users")
          .findOne({ username: credentials.username });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id, name: user.username, email: user.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      try {
        const client = await clientPromise;
        const db = client.db("re-animeflix");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
          username: session.user.name,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const watchList = user.animes
        return { ...session, ...token, watchList };
      } catch (error) {
        console.error("Failed to add anime to watch list:", error);
        throw new Error("Failed to add anime to watch list");
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
