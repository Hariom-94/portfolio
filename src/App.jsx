import { useState, useEffect } from 'react';
import TimelineNav from './components/TimelineNav.jsx';
import Hero from './components/Hero.jsx';
import ClientChannels from './components/ClientChannels.jsx';
import FeaturedReel from './components/FeaturedReel.jsx';
import ColorGradeCompare from './components/ColorGradeCompare.jsx';
import PortfolioGrid from './components/PortfolioGrid.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import SoftwareSkills from './components/SoftwareSkills.jsx';
import RulerScrollbar from './components/RulerScrollbar.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import YouTubeVideos from './components/YoutubeVideo.jsx';
import { clientChannels } from './data.js';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_YT_API_KEY;
const VIDEO_IDS = ['5aBsZV3nkQg', 'lhpKiC3spTo'];

export default function App() {
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
  const videosViews = videos?.map((v) => v.statistics.viewCount);
  const TOTAL_VIEWS = videosViews?.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue),
    0,
  );
  // console.log(videosViews);
  // console.log(TOTAL_VIEWS);
  return (
    <div className="min-h-screen font-body">
      <TimelineNav />
      <main>
        <Hero TOTAL_VIEWS={TOTAL_VIEWS} />
        <SoftwareSkills />
        <ClientChannels />
        <FeaturedReel />
        <ColorGradeCompare
          leftSrc="https://stream.mux.com/UClLjGQRb2BocMxlocLmqDx02O01ZdR014ge3bhVyPuGIM/high.mp4"
          shortsLeftSrc="https://stream.mux.com/UClLjGQRb2BocMxlocLmqDx02O01ZdR014ge3bhVyPuGIM/high.mp4"
          rightSrc="https://stream.mux.com/ah802h00ozFV1F00EYJHl1Mm02xmhOt7NGMaoN9FdvoDBnI/high.mp4"
          shortsRightSrc="https://stream.mux.com/ah802h00ozFV1F00EYJHl1Mm02xmhOt7NGMaoN9FdvoDBnI/high.mp4"
        />
        <PortfolioGrid />
        <Contact />
        <RulerScrollbar topOffset={60} />
      </main>
      <Footer />
      <CustomCursor />
    </div>
  );
}
