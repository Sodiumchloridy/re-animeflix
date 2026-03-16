"use client";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface PlayerProps {
    option: {
        url: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export default function VideoPlayer({ option, ...rest }: PlayerProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current && videoRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current.appendChild(videoElement);

            const proxyUrl = option.url.startsWith('http') 
                ? `/api/proxy?url=${encodeURIComponent(option.url)}`
                : option.url;

            const player = playerRef.current = videojs(videoElement, {
                controls: true,
                responsive: true,
                fluid: true,
                sources: [{
                    src: proxyUrl,
                    type: "application/vnd.apple.mpegurl"
                }],
                ...rest
            }, () => {
                videojs.log("player is ready");
            });
        }
        
    }, [option, rest]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        return () => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player className="w-full h-[70vh]">
            <div ref={videoRef} className="w-full h-full" />
        </div>
    );
}