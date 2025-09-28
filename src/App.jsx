import NavLayout from "./layout/NavLayout";
import Skills from "./components/ui/Skills";
import HeroSection from "./components/hero/HeroSection";
import ContactSection from "./components/ContactSection/ContactSection";
import PricingSection from "./components/PricingSection/PricingSection";
import FooterLayout from "./layout/FooterLayout";
import GoToTop from "./components/GoToTop";
import { GooeyCursor } from "./components/ui/GooeyCursor";
import { useEffect, useState } from "react";
import ProjectsSection from "./components/ProjectsSection/ProjectSection";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const App = () => {
  const isMobile = useIsMobile(); // Check if the screen is mobile-sized
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <GoToTop />
      {!isMobile && <GooeyCursor />}
      <div
        id="home"
        className="flex flex-col gap-20 sm:gap-30"
        style={{
          cursor: isMobile ? "default" : "none",
          overflow: "hidden", // Prevents scrollbars from interfering
        }}
      >
        <div className="container mx-auto px-4 sm:px-0">
          <NavLayout setIsChecked={setIsChecked} isChecked={isChecked} />
        </div>

        <div className="container mx-auto -mt-7 px-4 sm:px-0">
          <HeroSection />
        </div>

        <div className="container bg-container mx-auto px-4 sm:px-0">
          <Skills />
        </div>

        <div className="bg-container mx-auto px-4 sm:px-0">
          <ProjectsSection />
        </div>

        <div className="bg-container px-4 mx-auto">
          <PricingSection />
        </div>

        <div className="bg-container px-4 sm:px-0 relative">
          <ContactSection />
        </div>

        <div className="sm:px-0">
          <FooterLayout />
        </div>
      </div>
    </>
  );
};

export default App;
