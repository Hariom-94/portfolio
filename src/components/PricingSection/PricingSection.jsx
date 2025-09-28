import SectionHeader from "../ui/SectionHeader";
import PricingCard from "./PricingCard";
import pricingPlans from "./pricingPlans.json";

const PricingSection = () => {
  return (
    <div id="pricing" className="flex flex-col gap-10 max-w-full">
      <div className="pricing-bg"></div>
      <SectionHeader
        heading="Pricing & Packages"
        description="Explore our flexible pricing options tailored to meet your video editing needs. From one-time projects to ongoing collaborations, we offer transparent and competitive rates to deliver high-quality results. Choose a package that fits your vision, "
      />

      <div className="pricing-container flex flex-col md:flex-row gap-10 sm:gap-3 lg:gap-8 justify-center md:mt-10">
        {pricingPlans.map((p) => {
          return <PricingCard {...p} key={p.name} />;
        })}
      </div>
    </div>
  );
};

export default PricingSection;
