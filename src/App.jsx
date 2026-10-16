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

export default function App() {
  return (
    <div className="min-h-screen font-body">
      <TimelineNav />
      <main>
        <Hero />
        <SoftwareSkills />
        <ClientChannels />
        <FeaturedReel />
        <ColorGradeCompare
          leftSrc="UClLjGQRb2BocMxlocLmqDx02O01ZdR014ge3bhVyPuGIM"
          rightSrc="ah802h00ozFV1F00EYJHl1Mm02xmhOt7NGMaoN9FdvoDBnI"
        />
        <PortfolioGrid />
        <Contact />
        <RulerScrollbar topOffset={60} />
      </main>
      <Footer />
    </div>
  );
}
