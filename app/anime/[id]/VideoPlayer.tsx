"use client";
import ReactPlayer from "react-player";

export default function VideoPlayer({ url }: { url: string }) {
    while (!url)
        return (
            <div className="w-[100vw] h-[80vh] animate-pulse bg-blue-gray-500"></div>
        );
    return <ReactPlayer url={url} controls width="100%" height="80vh" />;
}
