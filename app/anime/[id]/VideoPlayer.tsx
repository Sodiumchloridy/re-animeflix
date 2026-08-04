"use client";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface PlayerProps {
    option: {
        url: string;
        isEmbed?: boolean;
        title?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export default function VideoPlayer({ option, ...rest }: PlayerProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    const isIframeEmbed = 
        option.isEmbed || 
        option.url.includes("embed") || 
        option.url.includes("vidsrc") || 
        !option.url.includes(".m3u8");

    useEffect(() => {
        if (isIframeEmbed) {
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
            return;
        }

        if (!playerRef.current && videoRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current.appendChild(videoElement);

            const proxyUrl = option.url.startsWith('http') 
                ? `/api/proxy?url=${encodeURIComponent(option.url)}`
                : option.url;

            playerRef.current = videojs(videoElement, {
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
        } else if (playerRef.current) {
            const proxyUrl = option.url.startsWith('http') 
                ? `/api/proxy?url=${encodeURIComponent(option.url)}`
                : option.url;
                
            playerRef.current.src({ src: proxyUrl, type: "application/vnd.apple.mpegurl" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option.url, isIframeEmbed]);

    useEffect(() => {
        return () => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    if (isIframeEmbed) {
        return (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black">
                <iframe
                    key={option.url}
                    src={option.url}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    tabIndex={0}
                    style={{ colorScheme: "dark" }}
                    aria-label={option.title || "Anime Video Player"}
                    className="w-full h-full border-0"
                />
            </div>
        );
    }

    return (
        <div data-vjs-player className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div ref={videoRef} className="w-full h-full" />
        </div>
    );
}