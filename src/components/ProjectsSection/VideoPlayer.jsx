import React, { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
import MuxPlayer from "@mux/mux-player-react";

const VideoPlayer = ({ video, isPlaying, setPlayingVideoId }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef(null); // Create a ref for the container

  // This useEffect hook handles the Intersection Observer logic
  useEffect(() => {
    const playerNode = playerContainerRef.current;

    // The callback function to execute when the video's visibility changes
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        // If the video is not intersecting (is off-screen) AND it is the one playing
        if (!entry.isIntersecting && isPlaying) {
          // Tell the parent component to pause the video
          setPlayingVideoId(null);
        }
      });
    };

    // Observer options: threshold of 0.5 means the callback will trigger
    // when 50% of the element is out of view.
    const observerOptions = {
      root: null, // observes intersections relative to the viewport
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // Start observing the player container if it exists
    if (playerNode) {
      observer.observe(playerNode);
    }

    // Cleanup function: disconnect the observer when the component unmounts
    return () => {
      if (playerNode) {
        observer.unobserve(playerNode);
      }
    };
  }, [isPlaying, setPlayingVideoId]); // Dependencies for the effect

  const getPlaybackId = (url) => {
    try {
      const path = new URL(url).pathname;
      return path.substring(1);
    } catch (e) {
      console.error("Invalid video URL provided:", url);
      return null;
    }
  };

  const playbackId = getPlaybackId(video.videoEmbed);

  const handlePlay = () => {
    if (!isPlaying) {
      setPlayingVideoId(video.id);
    }
  };

  if (!playbackId) {
    return (
      <div className="aspect-[9/16] w-full rounded-lg bg-gray-800 flex items-center justify-center text-white">
        Error: Invalid Video URL
      </div>
    );
  }

  return (
    // Attach the ref to the container div
    <div
      ref={playerContainerRef}
      className="aspect-[9/16] w-full rounded-lg overflow-hidden"
    >
      <MuxPlayer
        playbackId={playbackId}
        paused={!isPlaying}
        onPlay={handlePlay}
        accent-color="#008ff9"
        onEnterFullScreen={() => setIsFullscreen(true)}
        onExitFullScreen={() => setIsFullscreen(false)}
        poster={
          video.poster ||
          `https://image.mux.com/${playbackId}/thumbnail.png?width=720&height=1280&fit_mode=smartcrop`
        }
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
