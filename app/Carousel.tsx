"use client";
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CarouselWithContent() {
  const [trendingAnime, setTrendingAnime] = useState<any>(null);
  useEffect(() => {
    axios.get("https://kitsu.io/api/edge/trending/anime").then((res: any) => {
      setTrendingAnime(res.data);
    });
  }, []);

  if (!trendingAnime) {
    return (
      <div className="h-[500px] w-full flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <Carousel
      className="h-[50vh] lg:h-[500px]"
      autoplay
      loop
      placeholder={null}
    >
      {trendingAnime?.data.map((anime: any, index: number) => (
        <div key={index} className="relative h-full w-full">
          <Image
            src={anime.attributes.coverImage.large}
            alt={anime.attributes.canonicalTitle}
            width={anime.attributes.coverImage.meta.dimensions.large.width}
            height={anime.attributes.coverImage.meta.dimensions.large.height}
            className="h-full w-full object-cover"
            priority
            unoptimized
          />
          <div className="absolute bottom-2 left-2 m-4">
            <h1 className="font-bold text-3xl">
              {anime.attributes.canonicalTitle}
            </h1>
            <p className="text-justify line-clamp-2 lg:line-clamp-4">
              {anime.attributes.synopsis}
            </p>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
