"use client"; // Required for Next.js 13+ Client Components

import { useState, useEffect } from "react";
import Image from "next/image";

const Advertisement = () => {
  const images = [
    "/advertisement/ad1.jpg",
    "/advertisement/4.jpg",
    "/advertisement/ad3.jpg",
    "/advertisement/slider__image101.jpg"
  ]; // Add your advertisement image paths here

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative  w-full max-w-6xl mx-auto mt-20 p-4">
      {/* Image Slider */}
      <div className="relative w-full h-20 sm:h-22 md:h-32 lg:h-42 xl:h-52 rounded-lg border-2 border-gray-600 overflow-hidden inset-shadow-sm inset-shadow shadow-lg shadow-gray-600">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={img} alt={`Ad ${index + 1}`} fill className="object-fit rounded-lg" />
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 ">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all inset-shadow-sm duration-300 ${
              index === currentIndex ? "bg-gray-600 w-2 h-2" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Advertisement;
