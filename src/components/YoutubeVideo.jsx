import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_YT_API_KEY;

// Add as many video IDs as you like
const VIDEO_IDS = ['at-T2PJQgOg'];

function YouTubeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/videos',
          {
            params: {
              part: 'snippet,statistics',
              id: VIDEO_IDS.join(','),
              key: API_KEY,
            },
          },
        );

        setVideos(response.data.items);
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  // console.log(videos[0].statistics.viewCount);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>API Error: {error}</p>;

  return (
    <ul>
      {videos.map((video) => (
        <li key={video.id}>
          <img
            src={video.snippet.thumbnails.default.url}
            alt={video.snippet.title}
          />
          <strong>{video.snippet.title}</strong>
          <p>Channel: {video.snippet.channelTitle}</p>
          <p>Views: {Number(video.statistics.viewCount).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}

export default YouTubeVideos;
