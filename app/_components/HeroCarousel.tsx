"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export interface FeaturedAnime {
  id: string;
  title: string;
  image: string;
  bannerImage?: string;
  description?: string;
  genres?: string[];
  type?: string;
  episodes?: number;
  year?: number | string;
}

interface HeroCarouselProps {
  items: FeaturedAnime[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  // Helper to calculate fanned card positions (LunarAnime style 3D fan stack)
  const getCardOffset = (index: number) => {
    const total = items.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 via-[#0e1019] to-[#090a0f] border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.6)] mb-10 p-6 sm:p-10 flex flex-col items-center justify-between min-h-[480px] sm:min-h-[540px]">
      {/* Background Backdrop Image with Ambient Radial Glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-opacity duration-1000">
        <Image
          src={currentItem.bannerImage || currentItem.image}
          alt={currentItem.title}
          fill
          className="object-cover filter blur-xl scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-transparent" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs tracking-widest uppercase font-bold text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          FEATURED / #{String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-zinc-500">{items.length} TITLES</span>
      </div>

      {/* 3D Fanned Cards Section (LunarAnime inspired) */}
      <div className="relative z-10 w-full max-w-2xl h-52 sm:h-60 my-4 flex items-center justify-center perspective-1000">
        {items.map((item, index) => {
          const offset = getCardOffset(index);
          const isVisible = Math.abs(offset) <= 3;
          if (!isVisible) return null;

          const isCenter = offset === 0;
          const translateX = offset * 45; // Pixel offset
          const rotateZ = offset * 6; // Rotation degree
          const scale = isCenter ? 1.05 : 1 - Math.abs(offset) * 0.12;
          const opacity = isCenter ? 1 : 1 - Math.abs(offset) * 0.25;
          const zIndex = 20 - Math.abs(offset);

          return (
            <div
              key={item.id || index}
              onClick={() => setCurrentIndex(index)}
              style={{
                transform: `translateX(${translateX}px) rotate(${rotateZ}deg) scale(${scale})`,
                opacity,
                zIndex,
              }}
              className={`absolute top-0 w-32 sm:w-40 aspect-[2/3] rounded-2xl overflow-hidden border transition-all duration-700 ease-out cursor-pointer shadow-2xl ${
                isCenter
                  ? "border-purple-400/80 shadow-purple-500/30 ring-2 ring-purple-500/50"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
          );
        })}
      </div>

      {/* Center Details Section */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-3">
        {/* Metadata Badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <span>• {currentItem.type || "TV"}</span>
          {currentItem.episodes && <span>• {currentItem.episodes} EP</span>}
          {currentItem.year && <span>• {currentItem.year}</span>}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight line-clamp-2 max-w-2xl drop-shadow-md">
          {currentItem.title}
        </h2>

        {/* Genre Tags */}
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {currentItem.genres?.slice(0, 4).map((genre, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <Link
            href={`/anime/${currentItem.id}?ep=1`}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span>WATCH NOW</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href={`/anime/${currentItem.id}`}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300"
          >
            BROWSE DETAILS
          </Link>
        </div>
      </div>

      {/* Slide Indicators Dots */}
      <div className="relative z-10 flex items-center gap-2 pt-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
