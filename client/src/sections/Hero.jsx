import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopbannerVideo from "../assets/TopBannerImg/TopBannerVideo.mp4";
import { motion, useAnimation } from "framer-motion";
import products from "../data/products.json";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import img1 from "../assets/img/img1.png";
import img2 from "../assets/img/img2.png";
import img3 from "../assets/img/img3.png";
import img4 from "../assets/img/img4.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axiosInstance from "../api/axiosInstance";
import { img } from "framer-motion/m";
import { ChevronDown } from "lucide-react";

function Hero() {
  // const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [imageIndex, setImageIndex] = useState(0);
  const defaultImages = [img1, img2, img3, img4];
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(
          "/dashboard/banner/get-active-banners?sectionType=hero",
        );

        const banners = res?.data?.data || [];

        const heroImages = banners.flatMap(
          (banner) => banner.items || [],
          // .filter((item) => item.isActive !== false)
          // .map((item) => item.image)
          // .filter(Boolean),
        );

        // console.log("Backend Images:", heroImages);

        // ✅ MAIN FIX: always fallback properly
        setImages(heroImages.length ? heroImages : defaultImages);
      } catch (err) {
        console.log("Banner fetch error:", err);

        // fallback on error
        setImages(defaultImages);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");
  //       // console.log("PRODUCTS:", res.data);
  //       setselectedProducts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const selectedProducts = sideslider.filter(
  //   (item, index, self) =>
  //     index === self.findIndex((obj) => obj.category === item.category),
  // );

  // Animate on imageIndex change
  useEffect(() => {
    controls.start({
      x: `-${imageIndex * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [imageIndex, controls]);

  // Auto-slide
  // useEffect(() => {
  //   if (isHovered || selectedProducts.length === 0) return;

  //   const interval = setInterval(() => {
  //     setImageIndex((prevIndex) => (prevIndex + 1) % selectedProducts.length);
  //   }, 2500);

  //   return () => clearInterval(interval);
  // }, [isHovered, selectedProducts.length, imageIndex]);

  // Manual navigation
  const handlePrev = () => {
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProducts.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % selectedProducts.length);
  };

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    //   <section className="w-full mx-auto sm:py-0 bg-gray-50 mt-24">
    //     <div className="mx-auto w-full px-0 sm:px-0 md:px-0 lg:px-0">
    //       <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[800px] overflow-hidden">
    //         {/* Video */}
    //         <video
    //           className="w-full h-full absolute inset-0 object-cover"
    //           src={TopbannerVideo}
    //           autoPlay
    //           loop
    //           muted
    //           playsInline
    //         />

    //         {/* Optional dark overlay */}
    //         <div className="absolute inset-0 bg-black/35" />

    //         {/* Text block */}
    //         <div className="absolute inset-0 z-10 flex items-center">
    //           <div className="px-4 sm:px-6 md:px-10 lg:px-12 w-full max-w-[100%]">
    //             {/* Gradient Handwritten Heading */}
    //             <h1
    //               className="font-montez w-full
    // text-[28px] sm:text-[40px] md:text-[64px] lg:text-[96px]
    // leading-[1.1] tracking-wide
    // bg-gradient-to-r from-[#FF5667] via-[#E8E8E8] to-[#8494FB]
    // bg-clip-text text-transparent"
    //             >
    //               Craft Your Own Masterpieces <br />
    //               with Premium Resin
    //             </h1>

    //             {/* Description */}
    //             <p className="mt-4 text-[14px] sm:text-[20px] text-white/90 max-w-[800px]  leading-6 font-light">
    //               Welcome to Ivoryinks.com, your trusted destination for
    //               premium resin art materials in Bangalore and across India. We
    //               are passionate about empowering artists, hobbyists, and small
    //               business owners with high-quality resin supplies that inspire
    //               creativity and bring artistic visions to life.
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    //     <section className="relative w-full mx-auto bg-gray-50  overflow-hidden">
    //       <div className="pt-[88px] sm:pt-[92px] md:pt-[96px] lg:pt-[100px]">
    //         {/* 🔥 Continuous Swiper Background */}
    //         <Swiper
    //           key={images.length}
    //           modules={[Autoplay, EffectFade]}
    //           effect="fade"
    //           fadeEffect={{ crossFade: true }}
    //           slidesPerView={1}
    //           loop={true}
    //           autoplay={{
    //             delay: 2000,
    //             disableOnInteraction: false,
    //             pauseOnMouseEnter: false, // optional (keeps running)
    //           }}
    //           speed={1100} // smoother fade
    //         >
    //           {images.map((img, i) => (
    //             <SwiperSlide key={i}>
    //               <div className="w-full overflow-hidden">
    //                 <div
    //                   className="
    //   w-full
    //   h-[170px]
    //   sm:h-[240px]
    //   md:h-[340px]
    //   lg:h-[420px]
    //   xl:h-[500px]
    //   2xl:h-[560px]
    //   min-[1920px]:h-[700px]
    //   min-[2560px]:h-[760px]
    //   min-[3840px]:h-[950px]
    //   overflow-hidden
    // "
    //                 >
    //                   <img
    //                     src={typeof img === "string" ? img : img?.url}
    //                     alt="banner"
    //                    className="w-full h-full object-cover object-center md:object-center"
    //                   />
    //                 </div>
    //               </div>
    //             </SwiperSlide>
    //           ))}
    //         </Swiper>

    //         {/* Overlay */}
    //         {/* <div className="absolute inset-0 bg-black/35 z-10" /> */}

    //         {/* Content */}
    //         {/* <div className="absolute inset-0 z-20 flex items-center">
    //           <div className="px-4 sm:px-6 md:px-10 lg:px-12 w-full">
    //             <h1
    //               className="font-montez
    //           text-[28px] sm:text-[40px] md:text-[64px] lg:text-[96px]
    //           leading-[1.1] tracking-wide
    //           bg-gradient-to-r from-[#FF5667] via-[#E8E8E8] to-[#8494FB]
    //           bg-clip-text text-transparent"
    //             >
    //               Craft Your Own Masterpieces <br />
    //               with Premium Resin
    //             </h1>

    //             <p className="mt-4 text-[14px] sm:text-[20px] text-white/90 max-w-[800px] leading-6 font-light">
    //               Welcome to Ivoryinks.com, your trusted destination for
    //               premium resin art materials in Bangalore and across India...
    //             </p>
    //           </div>
    //         </div> */}
    //       </div>

    //       {/* 🔽 Scroll Down Arrow (Desktop Only) */}
    //       <div className="hidden lg:flex absolute right-4 lg:right-6 xl:right-10 bottom-6 lg:bottom-10 xl:bottom-12 z-30 items-center justify-center">
    //         <button
    //           onClick={handleScrollDown}
    //           className="bg-white shadow-md rounded-full p-2.5 lg:p-3 hover:bg-gray-100 transition animate-bounce"
    //         >
    //           <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6" />
    //         </button>
    //       </div>
    //     </section>

    <section className="relative w-full mx-auto bg-gray-50 overflow-hidden mt-[96px]">
      <Swiper
        key={images.length}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop={images.length > 1}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={1100}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-[170px] sm:h-[240px] md:h-[340px] lg:h-[420px] xl:h-[500px] 2xl:h-[560px] min-[1920px]:h-[700px] min-[2560px]:h-[760px] min-[3840px]:h-[950px] overflow-hidden">
              <img
                src={typeof img === "string" ? img : img?.url}
                alt="banner"
                className="w-full h-full object-cover object-top block"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hidden lg:flex absolute right-4 lg:right-6 xl:right-10 bottom-6 lg:bottom-10 xl:bottom-12 z-30 items-center justify-center">
        <button
          onClick={handleScrollDown}
        className="bg-[#e3e0f3] shadow-md rounded-full p-2.5 lg:p-3 hover:bg-[#e3e0f3]  border border-[#bdbcd1] transition animate-bounce"
        >
          <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
    </section>
  );
}

export default Hero;
