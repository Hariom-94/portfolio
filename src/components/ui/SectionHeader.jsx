import React from "react";

const SectionHeader = ({ heading, description = "" }) => {
  return (
    <div className="max-w-[85ch] mx-auto">
      {/* heading set to `margin-top: 140px` can cause problem later. */}
      <h2 className="text-3xl sm:text-5xl font-bold text-center">{heading}</h2>

      {description && (
        <p className="max-w-[75ch] mx-auto text-sm sm:text-lg mt-6 md:mt-12 text-center leading-6 md:leading-8">
          {description}{" "}
          <span className="text-[#008ff9] font-medium">
            or contact us for a custom quote!
          </span>
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
