"use client";
import ReactPlayer from "react-player";

export default function VideoPlayer({ url }: { url: string }) {
  const proxiedUrl = `${decodeURIComponent(url)}`;
  return <ReactPlayer url={proxiedUrl} controls width="100%" height="auto" />;
}
