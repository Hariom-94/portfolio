import "./HeroSection.css";

const HeroSection = () => {
  return (
    <div className="hero-section flex flex-col items-center">
      <div className="hero-heading text-center">
        <h1 className="text-[2.5rem] leading-12 md:text-5xl lg:text-6xl font-bold">
          Crafting Stories That Captivate
        </h1>
        <h2 className="mt-3 md:mt-5 text-2xl md:text-3xl font-medium">
          Your <span className="font-bold">Vision</span>, My{" "}
          <span className="font-bold">Edits</span>
        </h2>
      </div>
      <p className="max-w-[75ch] mx-auto text-sm sm:text-lg mt-6 md:mt-12 text-center leading-6 md:leading-8">
        Hi, I'm <span>Hariom</span>, a passionate video editor with{" "}
        <span>1+ years</span> of experience transforming raw footage into{" "}
        <span>stunning</span>, <span>cinematic</span>, <span>impactful</span>{" "}
        videos for brands, creators, and storytellers. Let's bring your ideas to
        life!
      </p>
      <div className="actions text-sm flex items-center gap-6 mt-15 md:mt-20 lg:mt-25">
        <a href="#projects" className="btn primary">
          View My Work
        </a>
        <a href="#pricing" className="btn secondary">
          Pricing
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
