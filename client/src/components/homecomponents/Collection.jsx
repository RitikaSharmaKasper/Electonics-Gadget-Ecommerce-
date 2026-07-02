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

// Icon mapping for dynamic icons
// const iconMap = {
//   '💎': IoDiamond,
//   '⭐': GoStarFill,
//   '🌍': IoEarthSharp,
//   '🚚': FaTruck,
//   '🛡️': FaShieldAlt,
//   '❤️': FaHeart,
//   '⏰': FaClock,
//   // Also support text-based icons
//   'diamond': IoDiamond,
//   'star': GoStarFill,
//   'earth': IoEarthSharp,
//   'truck': FaTruck,
//   'shield': FaShieldAlt,
//   'heart': FaHeart,
//   'clock': FaClock,
// };

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
  // const stationeryCategories = [
  //   { name: "Notebook", details: "Single-line, Graph, Lab, A4, A5" },
  //   { name: "Pencil", details: "HB, 2B, 4B, 6B, Colour sets" },
  //   { name: "Colour Chalk", details: "Regular, Dustless, White, Red, Blue" },
  //   { name: "Sharpener", details: "Single-hole, Double-hole, Metal, Plastic" },
  //   { name: "Eraser", details: "Vinyl, Dust-free, Pencil-top, Kneaded" },
  //   { name: "Charts", details: "Alphabet, Number, Science, Tables, GK" },
  //   { name: "Pen", details: "Ball, Gel, Fountain, Marker, Highlighter" },
  //   { name: "Maps", details: "Political, Physical, World, India, State" },
  //   { name: "Slates", details: "Wooden, Plastic, Magic, Whiteboard" },
  //   { name: "Globes", details: "Political, Physical, Illuminated, Desk" },
  // ];

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
        // Fallback to default features if API fails
        // setFeatures([
        //   { icon: '💎', text: 'Premium Quality Resin' },
        //   { icon: '⭐', text: 'Bubble Free Finish' },
        //   { icon: '🌍', text: 'Pan India Delivery' },
        // ]);
      } finally {
        setFeaturesLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  // console.log(features)

  const slideToEnd = () => {
    if (ref.current) {
      const card = ref.current.querySelector("a"); // your Link is wrapping each card
      const cardWidth = card?.offsetWidth || 0;
      const gap = parseInt(getComputedStyle(ref.current).gap || "0", 10) || 0;

      const scrollStep = cardWidth + gap;

      const currentScroll = ref.current.scrollLeft;
      const nextScroll = currentScroll + scrollStep;

      ref.current.scrollTo({
        left: nextScroll,
        behavior: "smooth",
      });

      // Arrow visibility logic
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

      // Arrow visibility logic
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

        // console.log(response);

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
        setCategories([]); // Empty array, no static data
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

      index = (index + 1) % 4; // cycle all product images
    }, 2000);

    return () => clearInterval(slideInterval);
  }, [controls, isHovered]);

  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (ref.current) {
  //       const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;

  //       if (ref.current.scrollLeft >= maxScroll) {
  //         // reset to start when reached end
  //         ref.current.scrollTo({ left: 0, behavior: "smooth" });
  //       } else {
  //         // scroll forward
  //         ref.current.scrollBy({ left: 250, behavior: "smooth" });
  //       }
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  // this is axios is used to data fetch in backend

  // const newProducts = useSelector((state) => state.products.products);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");
  //       //  console.log("PRODUCTS:", res.data);
  //       setnewProducts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");

  //       const raw = res.data;
  //       const products = Array.isArray(raw)
  //         ? raw
  //         : Array.isArray(raw?.data)
  //           ? raw.data
  //           : Array.isArray(raw?.products)
  //             ? raw.products
  //             : Array.isArray(raw?.data?.products)
  //               ? raw.data.products
  //               : [];

  //       // console.log("RAW:", raw);
  //       // console.log("PRODUCTS:", products);

  //       setnewProducts(products);
  //     } catch (error) {
  //       console.log(error);
  //       setnewProducts([]);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const collections = newProducts.filter(
  //   (item, index, self) =>
  //     index === self.findIndex((obj) => obj.category === item.category),
  // );
  // const collections = (newProducts || []).filter((item, index, self) => {
  //   const cat = item?.category?.name ?? item?.category; // supports object or string
  //   if (!cat) return false;

  //   return (
  //     index ===
  //     self.findIndex((obj) => (obj?.category?.name ?? obj?.category) === cat)
  //   );
  // });

  // const categories = [
  //   { id: 1, name: "Resin", img: resin },
  //   { id: 2, name: "Molds", img: mold },
  //   { id: 3, name: "Pigments", img: pigment },
  //   { id: 4, name: "Tools", img: tool },
  //   { id: 5, name: "Brushes", img: brush },
  //   { id: 6, name: "Glitters", img: glitter },
  //   { id: 7, name: "Resin", img: resin },
  //   { id: 8, name: "Brushes", img: brush },
  //   { id: 9, name: "Glitters", img: glitter },
  //   { id: 10, name: "Resin", img: resin },
  //   { id: 11, name: "Resin", img: resin },
  // ];

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

  // Function to render the appropriate icon component
  const renderIcon = (icon) => {
    if (!icon || icon.trim() === "") {
      return <IoDiamond />; // Fallback icon
    }

    // Check if icon is in the map
    // if (iconMap[icon]) {
    //   const IconComponent = iconMap[icon];
    //   return <IconComponent />;
    // }

    // If icon is an emoji or text, render as text
    return <span className="text-[18px]">{icon}</span>;
  };

  

  return (
    <section className="relative group ">
      {!featuresLoading && features.length === 3 && (
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 px-4 sm:px-6 lg:px-40 py-3 bg-[#f0eeff] ">
          {features.map((feature, index) => (
            <div
              key={feature._id || index}
              className="flex items-center gap-2 text-[24px] sm:text-[24px] text-[#5D5D6B] font-montez"
            >
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      )}
      {/* <========------ slider -------=========> */}
      <div className="mx-auto bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto text-center ">
          <div className="flex justify-center mb-6">
            {/* <div className="w-12 h-1 bg-[#1C3753]"></div> */}
          </div>
          <span className="lg:text-[31px] md:text-[31px] text-[31px] font-playpen-sans text-[#126B6D] mb-3 font-medium">
           Explore Stationary
            {/* <span className="font-serif italic text-[#1C3753]"> 
              Masterpieces
             </span> */}
          </span>
          {/* <p className="text-gray-600 md:text-lg text-sm">
            Customer Picks This Week
          </p> */}
        </div>

        {/* <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={"auto"}
            navigation={{
              nextEl: ".collections-next",
              prevEl: ".collections-prev",
            }}
            loop={false}
            className="pb-6 "
          >
            {collections.map((p, index) => {
              const key = p.uuid || p.id || p.SKU || `collection-${index}`;
              const { base, effective, discountPercent } = getPrices(p);

              return (
                <SwiperSlide
                  key={key}
                  className="!w-[224px] max-sm:!w-40 rounded-md overflow-hidden"
                >
                  <Link
                    className=" border block group/image h-full rounded-md shadow-sm"
                    // to={getProductUrl(p)}
                    to={`/product/${p._id}`}
                  >
                    <div className="relative w-full h-[224px] max-sm:h-40 overflow-hidden">
                      <img
                        className="w-full h-full object-contain group-hover/image:scale-110 transition-all duration-300"
                        src={getCardImage(p)}
                        alt={p.productTittle || "Product"}
                        loading="lazy"
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    </div>

                    <div className="w-full py-2 px-3">
                      <h3 className="text-[16px] font-serif text-gray-800 line-clamp-1 mb-2">
                        {p?.productTittle || "Untitled"}
                      </h3>

                      <div className="flex items-center flex-wrap ">
                        <span className="text-gray-900 font-medium text-[28px] tracking-tight">
                          {formatPrice(effective)}
                        </span>

                        {discountPercent > 0 && (
                          <>
                            <span className=" text-[#168408] text-[16px] px-2 py-0.5 rounded">
                              {discountPercent}% Off
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col items-start justify-start">
                        <span className="text-gray-400 text-[16px] line-through font-light">
                          {formatPrice(base)}
                        </span>

                        <div className="flex gap-1 ">
                          <Stack spacing={1}>
                            <Rating
                              name="size-small"
                              defaultValue={2}
                              size="small"
                            />
                          </Stack>
                          <span className="text-[12px] text-[#686868]">
                            (345)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="collections-prev absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-[#D5E5F5] shadow-sm hover:bg-gray-50 transition-all duration-200 z-10 border border-gray-200">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <button className="collections-next absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-[#D5E5F5] shadow-sm hover:bg-gray-50 transition-all duration-200 z-10 border border-gray-200">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div> */}
        {/* <========-------- Category --------=========> */}

      <div className="relative mt-6 px-2 sm:px-6 overflow-visible">
  <style>{`
    @keyframes floatUp {
      0%, 100% { 
        transform: translateY(0px); 
      }
      50% { 
        transform: translateY(-12px); 
      }
    }
    .category-item {
      animation: floatUp 3s ease-in-out infinite;
    }
    .category-item:nth-child(2n) {
      animation-duration: 3.5s;
      animation-delay: 0.5s;
    }
    .category-item:nth-child(3n) {
      animation-duration: 4s;
      animation-delay: 1s;
    }
    .category-item:nth-child(4n) {
      animation-duration: 2.8s;
      animation-delay: 0.3s;
    }
    .category-item:nth-child(5n) {
      animation-duration: 3.8s;
      animation-delay: 0.8s;
    }
    .category-item:nth-child(6n) {
      animation-duration: 3.2s;
      animation-delay: 1.2s;
    }
    /* Fix for swiper overflow */
    .swiper {
      overflow: visible !important;
    }
    .swiper-slide {
      overflow: visible !important;
    }
  `}</style>

  <Swiper
    modules={[Navigation]}
    navigation={{
      nextEl: ".custom-next",
      prevEl: ".custom-prev",
    }}
    spaceBetween={12}
    breakpoints={{
      0: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 2.5,
        spaceBetween: 12,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 18,
      },
      1280: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
    }}
    className="relative !overflow-visible"
  >
    {categories.map((category, index) => (
      <SwiperSlide key={category._id} className="!overflow-visible">
        <Link
          to={`/products/${encodeURIComponent(category.name)}`}
          state={{ category: category.name }}
        >
          <div 
            className="category-item flex flex-col items-center group"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* Image Container - Fixed Size with proper overflow */}
            <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] lg:w-[150px] lg:h-[150px] flex-shrink-0">
              {/* Outer Border */}
              <div className="absolute inset-0 rounded-full border-2 border-[#126B6D]/20  transition-all duration-300 shadow-sm group-hover:shadow-[0_0_25px_rgba(18,107,109,0.2)]"></div>
              
              {/* Decorative ring - Theme color */}
              <div className="absolute inset-[-4px] rounded-full border-2 border-[#FF7F66]/0  transition-all duration-500 pointer-events-none"></div>
              
              {/* Image */}
              <div className="w-full h-full rounded-full overflow-hidden  hover:border border-[#248f91]">
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

            {/* Category Name - Primary Color */}
            <span className="mt-3 text-[14px] sm:text-[15px] md:text-[16px] text-center capitalize text-[#126B6D] font-medium group-hover:text-[#FF7F66] transition-colors duration-300">
              {category.name}
            </span>
            
            {/* Category Details - Neutral Color with accent */}
            <span className="mt-1 max-w-[150px] text-center text-[11px] sm:text-[12px] text-[#747877] line-clamp-2 group-hover:text-[#126B6D] transition-colors duration-300">
              {category.details}
            </span>

            {/* Bottom Decorative Line - Theme Color */}
            <div className="mt-2 w-0 h-0.5 bg-gradient-to-r from-[#126B6D] to-[#FF7F66] group-hover:w-10 transition-all duration-500 rounded-full"></div>
          </div>
        </Link>
      </SwiperSlide>
    ))}

    {/* Previous Button - Theme Colors */}
    <div className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#126B6D] text-white shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm  hover:scale-110 transition-all duration-300">
      ❮
    </div>

    {/* Next Button - Theme Colors */}
    <div className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#126B6D] text-white shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm  hover:scale-110 transition-all duration-300">
      ❯
    </div>
  </Swiper>
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
