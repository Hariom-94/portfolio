import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import SectionHeader from "../ui/SectionHeader";
import "./ProjectSection.css";
import data from "./videos.json";
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import VideoGrid from "./VideoGrid";

// Helper function to safely extract the playback ID from a Mux URL
const getPlaybackId = (url) => {
  try {
    const path = new URL(url).pathname;
    // Look for a pattern that resembles a playback ID
    const playbackIdMatch = path.match(/([a-zA-Z0-9]+)(\?.*)?$/);
    return playbackIdMatch ? playbackIdMatch[1] : null;
  } catch (e) {
    console.error("Invalid video URL provided:", url);
    return null;
  }
};

const ProjectsSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(data[0]);
  // State to control the main player's play/pause status
  const [isPlaying, setIsPlaying] = useState(false);
  const playerContainerRef = useRef(null);

  // This effect pauses the video when it's scrolled out of view
  useEffect(() => {
    const playerElement = playerContainerRef.current;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          // Video is out of view, so we pause it.
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (playerElement) {
      observer.observe(playerElement);
    }

    return () => {
      if (playerElement) {
        observer.unobserve(playerElement);
      }
    };
  }, []); // Empty dependency array means this runs only once on mount

  // Handler for selecting a new video from the playlist
  const handleSelectVideo = (video) => {
    // Automatically play the newly selected video
    setIsPlaying(video === selectedVideo ? (isPlaying ? false : true) : true);
    setSelectedVideo(video);
  };

  const currentPlaybackId = getPlaybackId(selectedVideo.videoEmbed);

  const glassStyle =
    "bg-black/5 backdrop-blur-lg border border-blue-500/20 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]";

  return (
    <div className="featured-projects text-white font-sans px-4" id="projects">
      <div className="bg"></div>
      <div className="max-w-7xl mx-auto">
        <SectionHeader heading="Featured Projects" />
        <div className="mt-15 sm:mt-20">
          <h3 className="text-sm sm:text-xl">Long Form</h3>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Video Player */}
            <div
              className={`long-video-player lg:col-span-2 p-4 sm:p-6 ${glassStyle}`}
            >
              <div
                ref={playerContainerRef}
                className="aspect-video w-full rounded-lg overflow-hidden"
              >
                {currentPlaybackId ? (
                  <MuxPlayer
                    playbackId={currentPlaybackId}
                    poster={
                      selectedVideo.poster ||
                      `https://image.mux.com/${currentPlaybackId}/thumbnail.png?fit_mode=smartcrop`
                    }
                    paused={!isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{ height: "100%", width: "100%" }}
                    accent-color="#008ff9"
                    autoPlay={isPlaying}
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <p>Error loading video.</p>
                  </div>
                )}
              </div>

              {/* Video Details */}
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-3">
                  {selectedVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag px-3 py-1 text-xs sm:text-sm bg-blue-500/20 text-blue-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="font-bold mt-7">{selectedVideo.title}</h4>
                <p className="mt-4 text-white text-sm sm:text-base">
                  {selectedVideo.description}
                </p>
              </div>
            </div>

            {/* Right Column: Video Playlist */}
            <div className="lg:col-span-1">
              <div className="flex flex-col gap-4">
                {data.map((video) => (
                  <a
                    href="#projects"
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className={`relative w-full p-4 sm:p-5 text-left transition-all duration-300 ${glassStyle} ${
                      selectedVideo.id === video.id
                        ? "border-blue-500/80 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                        : "border-blue-500/20 hover:border-blue-500/50 hover:bg-black/30"
                    }`}
                  >
                    <div className="flex gap-5">
                      <div className="relative min-w-[150px] max-w-[150px]">
                        {selectedVideo.id === video.id && isPlaying ? (
                          <FaRegCirclePause
                            // fill="#008ff9"
                            fill="#ffffff"
                            className="pause-btn"
                          />
                        ) : (
                          <FaRegCirclePlay
                            // fill="#008ff9"
                            fill="#ffffff"
                            className="play-btn"
                          />
                        )}
                        <img src={video.poster} className="poster" alt="" />
                      </div>
                      <div className="">
                        <h4 className="font-bold text-base sm:text-lg text-gray-100">
                          {video.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-15 sm:mt-20">
          <h3 className="text-sm sm:text-xl">Short Form</h3>
          <VideoGrid />
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
