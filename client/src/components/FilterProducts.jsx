import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const options = [
  { label: "Recommended", value: "recommended" },
  { label: "Price (Low to High)", value: "price_low" },
  { label: "Price (High to Low)", value: "price_high" },
  { label: "Latest", value: "latest" },
  { label: "Ratings (High to Low)", value: "rating_high" },
  { label: "Ratings (Low to High)", value: "rating_low" },
  { label: "Alphabetical (A to Z)", value: "atoz" },
  { label: "Alphabetical (Z to A)", value: "ztoa" },
];

function FilterProducts({ text = "Best Accessories", sort }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative z-[100px] flex flex-col md:flex-row md:justify-between md:items-center w-full mb-5 gap-3 mt-24 md:mt-0">
      {/* Heading */}
      <div className="block md:block">
        <p className="text-lg md:text-xl font-stack-sans font-medium text-[#7A1F2B]">
          {text}
        </p>
      </div>

      {/* Sort */}
      <div
        ref={dropdownRef}
        className="relative flex justify-between md:justify-start items-center gap-2 w-full md:w-auto border border-[#747877] rounded-[5px] bg-[#FFFFFF] px-3 py-2 shadow-sm"
      >
        <span className="text-[#747877] text-xs md:text-base">Sort by:</span>

        <button
          type="button"
          className="flex justify-between items-center w-full md:w-[200px]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-[#7A1F2B] text-sm md:text-base">
            {selected.label}
          </span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full md:right-0 md:left-auto md:w-[280px] bg-white border border-[#F0EEFF] rounded-[5px] overflow-hidden shadow-md z-[99999] max-h-[280px] overflow-y-auto">
            {options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className="w-full text-left hover:bg-[#dadde0] px-4 py-2 text-sm text-[#747877] hover:text-[#7A1F2B]"
                onClick={() => {
                  setSelected(opt);
                  sort?.(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterProducts;
