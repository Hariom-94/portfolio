import { BsPatchCheckFill } from "react-icons/bs";
import "./PricingSection.css";

const PricingCard = ({
  name,
  savePercentage,
  originalPrice,
  discountedPrice,
  features,
  ctaText,
  blur,
  message,
}) => {
  return (
    <div className="pricing-card p-5 flex flex-col min-w-[90%] max-w-[90%] mx-auto">
      <div className={`top-left-blur`}></div>
      <div className={`bottom-right-blur`}></div>
      <div className="pricing-info mb-7">
        <div className="type">{name}</div>
        <div className="discount text-sm md:text-md">
          <span className="offer">Save {savePercentage}%</span>{" "}
          <span>₹{originalPrice}</span>
        </div>
        <div className="price mt-5 text-sm sm:text-md">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            ₹{discountedPrice}
          </span>
          /project
        </div>
      </div>
      <div className="pricing-content flex flex-col mt-auto">
        <ul>
          {features.map((f, index) => (
            <li
              key={index}
              className="text-sm flex list-none gap-3 text-white items-center"
            >
              <BsPatchCheckFill fill="white" className="w-[20px]" />
              <span className="flex-1">{f}</span>
            </li>
          ))}
        </ul>

        {/* This will now work correctly */}
        <a
          href={`https://wa.me/+917364877930?text=${encodeURIComponent(
            message
          )}`}
          className="btn primary text-center mt-10 md:text-sm"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default PricingCard;
