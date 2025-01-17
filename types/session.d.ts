import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    watchList?: Anime[];
  }
}

interface Anime {
  id: string;
    title: string;
}