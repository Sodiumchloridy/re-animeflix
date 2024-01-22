import { ANIME } from "@consumet/extensions"
import VideoPlayer from "./VideoPlayer";

export default async function WatchPage({params}: {params: {id: string}}){
    const animesaturn = new ANIME.AnimeSaturn();
    const episodeSources = await animesaturn.fetchEpisodeSources(decodeURIComponent(params.id))
    return(
    <div className="w-full flex justify-center">
        <div className="w-[80%]">
            <VideoPlayer url={episodeSources.sources[1].url}/>
        </div>
    </div>
)}