"use client";
import ReactPlayer from "react-player";

export default function VideoPlayer({ url }: { url: string }) {
  return <ReactPlayer url={url} controls width="100%" height="auto" />;
}
