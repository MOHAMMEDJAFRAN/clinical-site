"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { specialityData } from "../../public/assets/assets";

const SpecialityMenu = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const router = useRouter();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <div
      ref={ref}
      className="flex w-full flex-col items-center gap-6 py-16 text-gray-800 overflow-hidden"
      id="speciality"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={controls}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl text-blue-800 mt-[-50] font-semibold text-center px-4"
      >
        Recommended Specialities
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="sm:w-1/3 w-4/5 text-center  text-sm md:text-base text-gray-600"
      >
        Find the Right Specialist for Your Health Needs
      </motion.p>

      {/* Horizontal Scroll with Drag Effect */}
      <motion.div
        className="flex justify-center items-center gap-6 pt-5 w-full px-4 overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={controls}
            transition={{ delay: index * 0.1, duration: 2 }}
            className="snap-center flex-shrink-0 flex flex-col items-center w-24 md:w-32"
          >
            <Link
              href={`/doctors/${item.speciality}`}
              onClick={() => window.scrollTo(0, 0)}
              className="flex flex-col items-center font-semibold text-purple-950 text-sm md:text-xl cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gray-300 sm:w-24 sm:h-24 mb-2 shadow-lg rounded-full overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.speciality}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <p className="text-gray-700 text-xs sm:text-base">{item.speciality}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SpecialityMenu;
