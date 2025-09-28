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
    <div className="pricing-card p-5 md:min-w-1/5 xl:min-w-1/3 flex flex-col min-w-[90%] max-w-[90%] mx-auto">
      {/* <div className={`top-${blur}-blur`}></div> */}
      <div className={`top-left-blur`}></div>
      <div className={`bottom-right-blur`}></div>
      {/* <div
        className={`bottom-${blur === "left" ? "right" : "left"}-blur`}
      ></div> */}
      <div className="pricing-info mb-7">
        <div className="type">{name}</div>
        <div className="discount text-sm sm:text-md">
          <span className="offer">Save {savePercentage}%</span>{" "}
          <span>₹{originalPrice}</span>
        </div>
        <div className="price mt-5 text-sm sm:text-md">
          <span className="text-4xl sm:text-5xl font-bold">
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
              <BsPatchCheckFill fill="white" />
              {f}
            </li>
          ))}
        </ul>

        {/* This will now work correctly */}
        <a
          href={`https://wa.me/+917364877930?text=${encodeURIComponent(
            message
          )}`}
          className="btn primary text-center mt-10"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default PricingCard;
