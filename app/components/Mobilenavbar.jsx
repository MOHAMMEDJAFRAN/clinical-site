"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

const MobileNavbar = ({ showMenu, setShowMenu, token, setToken }) => {
  const router = useRouter();

  return (
    showMenu && (
      <motion.div
        initial={{ x: "100vw", opacity: 0 }} // Start from right
        animate={{ x: 0, opacity: 1 }} // Slide in
        exit={{ x: "100vw", opacity: 0 }} // Slide out
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] md:w-[40%]  text-white shadow-lg z-50 flex flex-col p-3"
      >
        {/* Close Button */}
        <button className="absolute top-5 right-5 text-black hover:text-red-700 cursor-pointer text-2xl" onClick={() => setShowMenu(false)}>
          <FaTimes />
        </button>

        {/* Menu Content */}
        <div className="mt-0 flex flex-col gap-6">
          {/* Profile Section */}
          {token ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-md">
              <p
                onClick={() => {
                  router.push("/profile");
                  setShowMenu(false);
                }}
                className="cursor-pointer  pt-10 text-black hover:text-blue-600"
              >
                Profile
              </p>
              <p
                onClick={() => {
                  router.push("/book-appointment");
                  setShowMenu(false);
                }}
                className="cursor-pointer mt-4 text-black hover:text-blue-600"
              >
                Bookings
              </p>
              {/* Booking Button */}
                <div className=" w-full px-17 mt-6 items-center">
                    <button
                        onClick={() =>  {
                        setToken(false)
                        router.push("/login");
                        setShowMenu(false);
                        }}
                        className="bg-blue-600 items-center text-white px-6 py-2 rounded-md hover:bg-blue-900 transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
              
            </div>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setShowMenu(false);
              }}
              className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-300 transition-all duration-300"
            >
              Login
            </button>
          )}

          
        </div>
      </motion.div>
    )
  );
};

export default MobileNavbar;
