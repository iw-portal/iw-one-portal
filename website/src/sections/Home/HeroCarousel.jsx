import { useEffect, useState } from "react";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";

import carousel1 from "../../iw-brand-kit/home/Greeter1.png";
import carousel2 from "../../iw-brand-kit/home/Greeter2.png";
import carousel3 from "../../iw-brand-kit/home/Greeter3.png";
import carousel4 from "../../iw-brand-kit/home/Greeter4.png";
import carousel5 from "../../iw-brand-kit/home/Greeter5.png";

const slides = [
  {
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/11/newslide1.jpg",
    text: "At Inclusive World, we nurture desires, interests & dreams",
    align: "left",
    color: "text-white",
    size: "text-4xl",
  },
  {
    image: "https://inclusiveworld.org/wp-content/uploads/2020/11/triumph.jpg",
    text: "We Celebrate Triumphs",
    align: "left",
    color: "text-[#ad3500]",
    size: "text-4xl",
  },
  {
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/11/newsslide4_1-1.jpg",
    text: "We uphold the dignity of individuals",
    align: "right",
    color: "text-black",
    size: "text-4xl",
  },
  // {
  //   image:
  //     "https://inclusiveworld.org/wp-content/uploads/2020/11/personcenteredslide.jpg",
  //   text: "We practice person centered culture",
  //   align: "right",
  //   color: "text-white",
  //   size: "text-3xl",
  //   offset: "right-40 sm:right-20 md:right-18 lg:right-22 xl:right-50",
  // },
  {
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/11/personcenteredslide.jpg",
    text: "We practice person centered culture",
    align: "right",
    color: "text-white",
    size: "text-3xl",
    offset: "right-12 sm:right-16 md:right-20 lg:right-24 xl:right-32",
  },
  {
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/11/newsslide5-1.jpg",
    text: "We focus on holistic development",
    align: "right",
    color: "text-black",
    size: "text-4xl",
  },
];

const HeroCarousel = () => {
  // const slides = [carousel1, carousel2, carousel3, carousel4, carousel5];
  const [currentIndex, setCurrentIndex] = useState(1);

  const slide = slides[currentIndex];
  const isLeft = slide.align === "left";

  const positionClass = isLeft
    ? "left-6 sm:left-12 md:left-20 text-left"
    : slide.offset
      ? `${slide.offset} text-right`
      : "right-6 sm:right-12 md:right-20 text-right";

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    // <div className="relative w-full overflow-hidden">
    //   <div className="relative w-full h-[220px] sm:h-[300px] md:h-[420px] lg:h-[520px]">
    //     {slides.map((image, index) => (
    //       <div
    //         key={index}
    //         className={`absolute inset-0 duration-700 ${
    //           index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
    //         }`}
    //       >
    //         {/* Image */}
    //         <img
    //           src={image}
    //           alt={`carousel ${index}`}
    //           className="w-full h-full object-contain transition-transform duration-[5000ms]"
    //         />

    //         {/* Dark overlay */}
    //         {/* <div className="absolute inset-0 bg-black/30" /> */}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    // <div className="relative w-full overflow-hidden">
    <div className="relative w-full mt-6 max-w-7xl mx-auto overflow-hidden rounded-3xl">
      <div className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] lg:h-[600px]">
        {/* Images */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`carousel ${index}`}
              className="w-full h-full object-cover object-[center_30%]"
            />

            {/* Subtle gradient for readability */}
            <div className="absolute inset-0" />
            {/* <div
              className={`absolute inset-0 ${
                isLeft
                  ? "bg-gradient-to-r from-black/40 via-black/10 to-transparent"
                  : "bg-gradient-to-l from-black/40 via-black/10 to-transparent"
              }`} */}
            {/* /> */}
          </div>
        ))}

        {/* TEXT (changes per slide, position stays fixed) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-20 max-w-xl text-white
    ${positionClass}
  `}
        >
          <h1
            key={currentIndex} // 👈 forces re-animation on change
            // className={`${slides[currentIndex].size} font-semibold leading-tight transition-all duration-700 opacity-100 translate-y-0 ${slides[currentIndex].color}`}
            className={`${slide.size} font-semibold leading-tight transition-all duration-700 ${slide.color}`}
          >
            {slides[currentIndex].text}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
