import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";

// Mock data for the videos. You would replace this with your actual video data.
const videos = [
  {
    id: 1,
    poster:
      "https://1drv.ms/i/c/958d205303c76c02/EVQgibkRz4xEreA_70lC0gIBKpRJkLqq3sRwyStbSLfSJQ",
    videoEmbed:
      "https://player.mux.com/m3L2HIK4SxNdl00q1eggbzVnz4CaOkOaTo5y3EQ76ju8?metadata-video-title=genZ+Nepal&video-title=genZ+Nepal",
  },
  {
    id: 2,
    poster:
      "https://image.mux.com/TbBrc2IYoJ54Vla3ePlLqPw2EKfifUqT37n01apxnkXQ/thumbnail.png?time=2",
    videoEmbed:
      "https://player.mux.com/TbBrc2IYoJ54Vla3ePlLqPw2EKfifUqT37n01apxnkXQ?metadata-video-title=TRUTH+BEHIND+AMAZON+LOGO&video-title=TRUTH+BEHIND+AMAZON+LOGO",
  },
];

const VideoGrid = () => {
  // This state keeps track of which video (by ID) is currently allowed to play.
  const [playingVideoId, setPlayingVideoId] = useState(null);

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-8">
      {videos.map((video) => (
        <VideoPlayer
          key={video.id}
          video={video}
          setPlayingVideoId={setPlayingVideoId}
          // The `isPlaying` prop is true only if this video's ID matches the one in the state.
          isPlaying={playingVideoId === video.id}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
