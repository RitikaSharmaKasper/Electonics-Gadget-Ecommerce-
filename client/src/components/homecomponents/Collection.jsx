import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion, useAnimation } from "framer-motion";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import {
  getProductUrl,
  getCardImage,
  getPrices,
  formatPrice,
} from "../../utils/homePageUtils";

{
  /* <================--------- icons ----------=====================> */
}
import { IoDiamond } from "react-icons/io5";
import { GoStarFill } from "react-icons/go";
import { IoEarthSharp } from "react-icons/io5";
import { FaTruck, FaShieldAlt, FaHeart, FaClock } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

{
  /* <================--------- Images ----------=====================> */
}
import resin from "../../assets/img/1.png";
import mold from "../../assets/img/2.jpg";
import pigment from "../../assets/img/3.jpg";
import tool from "../../assets/img/4.png";
import brush from "../../assets/img/5.png";
import glitter from "../../assets/img/6.jpg";

function Collection() {
  const ref = useRef(null);
  const sliderRef = useRef(null);
  const [leftArrow, setLeftArrow] = useState(false);
  const [rightArrow, setRightArrow] = useState(true);
  const [temp, setTemp] = useState(270);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for dynamic premium features
  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  // fetch premium features from settings
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setFeaturesLoading(true);
        const response = await axiosInstance.get("/settings/homepage-features");
        if (response.data.success && response.data.data) {
          setFeatures(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching premium features:", err);
      } finally {
        setFeaturesLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  const slideToEnd = () => {
    if (ref.current) {
      const card = ref.current.querySelector("a");
      const cardWidth = card?.offsetWidth || 0;
      const gap = parseInt(getComputedStyle(ref.current).gap || "0", 10) || 0;

      const scrollStep = cardWidth + gap;

      const currentScroll = ref.current.scrollLeft;
      const nextScroll = currentScroll + scrollStep;

      ref.current.scrollTo({
        left: nextScroll,
        behavior: "smooth",
      });

      if (nextScroll > 0) setLeftArrow(true);
      if (nextScroll >= ref.current.scrollWidth - ref.current.clientWidth) {
        setRightArrow(false);
      } else {
        setRightArrow(true);
      }
    }
  };

  const slideToStart = () => {
    if (ref.current) {
      const card = ref.current.querySelector("a");
      const cardWidth = card?.offsetWidth || 0;
      const gap = parseInt(getComputedStyle(ref.current).gap || "0", 10) || 0;

      const scrollStep = cardWidth + gap;

      const currentScroll = ref.current.scrollLeft;
      const nextScroll = currentScroll - scrollStep;

      ref.current.scrollTo({
        left: nextScroll,
        behavior: "smooth",
      });

      if (nextScroll <= 0) {
        setLeftArrow(false);
      } else {
        setLeftArrow(true);
      }
      setRightArrow(true);
    }
  };

  function actualPrice(price, discountPercent) {
    return price - (price * discountPercent) / 100;
  }

  // for categories fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get("/category/all-categories", {
          params: {
            page: 1,
            limit: 20,
          },
        });

        let fetchedCategories = [];

        if (response.data?.success && response.data?.data) {
          fetchedCategories = response.data.data;
        } else if (Array.isArray(response.data)) {
          fetchedCategories = response.data;
        }

        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || "Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isHovered) return;
    let index = 0;
    const slideInterval = setInterval(() => {
      controls.start({
        x: `-${index * 100}%`,
        transition: { duration: 0.5, ease: "easeInOut" },
      });

      index = (index + 1) % 4;
    }, 2000);

    return () => clearInterval(slideInterval);
  }, [controls, isHovered]);

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 7;
  const step = 1;

  const scrollRight = () => {
    setStartIndex((prev) => {
      const maxIndex = categories.length - visibleCount;
      return prev + step > maxIndex ? maxIndex : prev + step;
    });
  };

  const scrollLeft = () => {
    setStartIndex((prev) => {
      return prev - step < 0 ? 0 : prev - step;
    });
  };

  const renderIcon = (icon) => {
    if (!icon || icon.trim() === "") {
      return <IoDiamond />;
    }
    return <span className="text-[18px]">{icon}</span>;
  };

  return (
    <section className="relative group ">
      {!featuresLoading && features.length === 3 && (
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 px-4 sm:px-6 lg:px-40 py-3 bg-[#f1d5d9] ">
          {features.map((feature, index) => (
            <div
              key={feature._id || index}
              className="flex items-center gap-2 text-[18px] sm:text-[18px] text-[#7A1F2B] font-stack-sans"
            >
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      )}
      {/* <========------ slider -------=========> */}
      <div className="mx-auto bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto text-center ">
          <div className="flex justify-center mb-6"></div>
          <span className="lg:text-[31px] md:text-[31px] text-[31px] font-stack-sans text-[#7A1F2B] mb-3 font-medium">
            Explore Stationary
          </span>
        </div>

        {/* <========-------- Category --------=========> */}

        <div className="relative mt-6 px-2 sm:px-6">
          <style>{`
            /* ---- Unique entrance: soft rise + gentle scale settle, staggered per card ---- */
            @keyframes riseSettle {
              0% {
                opacity: 0;
                transform: translateY(22px) scale(0.88);
              }
              60% {
                opacity: 1;
                transform: translateY(-4px) scale(1.03);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            .category-item {
              animation: riseSettle 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
            }

            /* ---- Soft, slow-drifting border (no spin, no shimmer) ---- */
            @keyframes haloDrift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            .category-halo {
              position: absolute;
              inset: -3px;
              border-radius: 28%;
              padding: 1.5px;
background: linear-gradient(to bottom, #dadde0, #7A1F2B);
              background-size: 300% 300%;
              opacity: 0.45;
              transition: opacity 0.35s ease;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              animation: haloDrift 8s ease-in-out infinite;
            }

            .group:hover .category-halo {
              opacity: 0.85;
            }

            /* ---- Name label: subtle letter-spacing expand instead of plain color change ---- */
            .category-label {
              transition: letter-spacing 0.35s ease, color 0.3s ease;
            }
            .group:hover .category-label {
              letter-spacing: 0.04em;
            }

            /* Give the animations room without breaking Swiper's own clipping/snap logic */
            .category-swiper {
              padding-top: 14px;
              padding-bottom: 4px;
            }
          `}</style>

          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            spaceBetween={8}
            watchOverflow={true}
            breakpoints={{
              // Small phones
              0: {
                slidesPerView: 3,
                spaceBetween: 6,
              },
              // Large phones
              400: {
                slidesPerView: 3.5,
                spaceBetween: 8,
              },
              // Small tablets / phablets
              576: {
                slidesPerView: 4.5,
                spaceBetween: 8,
              },
              // Tablets (portrait)
              768: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
              // Tablets (landscape) / small laptops
              1024: {
                slidesPerView: 7,
                spaceBetween: 10,
              },
              // Laptops / desktops
              1280: {
                slidesPerView: 8,
                spaceBetween: 12,
              },
              // Large desktops
              1536: {
                slidesPerView: 9,
                spaceBetween: 14,
              },
            }}
            className="category-swiper relative"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category._id}>
                <Link
                  to={`/products/${encodeURIComponent(category.name)}`}
                  state={{ category: category.name }}
                >
                  <div
                    className="category-item flex flex-col items-center group"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {/* Image Container - Fixed Size. Hover-lift lives here (not on .category-item),
                        so the entrance animation and the hover transform never fight over the
                        same element, and the lift only ever applies to the exact item under the cursor. */}
                    <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] flex-shrink-0 transition-transform duration-300 ease-out hover:-translate-y-2">
                      {/* Static subtle border (kept, no longer the only hover cue) */}
                      <div className="absolute inset-0 rounded-[28%] border-2 border-[#52151d]/20 transition-all duration-300"></div>

                      {/* Subtle, slowly drifting gradient border */}
                      <div className="category-halo"></div>

                      {/* Image */}
                      <div className="relative w-full h-full rounded-[28%] overflow-hidden hover:border border-[#7A1F2B] duration-300">
                        <img
                          src={
                            category.categoryImage?.url ||
                            "/placeholder-category.jpg"
                          }
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Category Name */}
                    <span className="category-label mt-2 text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] text-center capitalize text-[#7A1F2B] font-medium group-hover:text-[#5d5e5] transition-colors duration-300">
                      {category.name}
                    </span>

                    {/* Category Details */}
                    <span className="mt-0.5 max-w-[120px] sm:max-w-[150px] text-center text-[10px] sm:text-[11px] md:text-[12px] text-[#747877] line-clamp-2 group-hover:text-[#7A1F2B] transition-colors duration-300">
                      {category.details}
                    </span>

                    {/* Bottom Decorative Line */}
                    <div className="mt-1.5 w-0 h-0.5 bg-gradient-to-b from-[#dadde0] to-[#dadde0]/50 group-hover:w-10 transition-all duration-500 rounded-full"></div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Previous Button */}
          <div className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#7A1F2B] text-white shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm hover:scale-110 transition-all duration-300">
            ❮
          </div>

          {/* Next Button */}
          <div className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#7A1F2B] text-white shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm hover:scale-110 transition-all duration-300">
            ❯
          </div>
        </div>

        {categories.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 py-8">
            No categories available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}

export default Collection;