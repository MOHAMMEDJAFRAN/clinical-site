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
    <div className="relative w-6xl border-2 border-black rounded-2xl shadow-md mx-auto mt-25">
      {/* Image Slider */}
      <div className="relative w-full h-32 md:h-48 px-0.5 py overflow-hidden rounded-2xl shadow-md">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={img} alt={`Ad ${index + 1}`} layout="fill" objectFit="fit" />
          </div>
        ))}

        {/* Dots Navigation */}
      <div className="flex justify-center mt-45 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 cursor-pointer z-50 rounded-full ${
              index === currentIndex ? "bg-gray-600" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
      </div>

      
    </div>
  );
};

export default Advertisement;
