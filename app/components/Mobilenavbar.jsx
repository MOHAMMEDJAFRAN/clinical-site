"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTimes, FaQrcode } from "react-icons/fa";

const MobileNavbar = ({ showMenu, setShowMenu, token, setToken, onScanQR }) => {
  const router = useRouter();

  return (
    showMenu && (
      <motion.div
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100vw", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] md:w-[40%] bg-white text-white shadow-lg z-50 flex flex-col p-3"
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-5 text-black hover:text-red-700 cursor-pointer text-2xl" 
          onClick={() => setShowMenu(false)}
        >
          <FaTimes />
        </button>

        {/* QR Scanner Button - Added on left side */}
        <button
          onClick={() => {
            onScanQR();
            setShowMenu(false);
          }}
          className="absolute top-5 left-5 text-black hover:text-blue-600 cursor-pointer text-2xl"
          title="Scan QR Code"
        >
          <FaQrcode />
        </button>

        {/* Menu Content */}
        <div className="mt-16 flex flex-col gap-6">
          {/* Profile Section */}
          {token ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-md">
              <p
                onClick={() => {
                  router.push("/profile");
                  setShowMenu(false);
                }}
                className="cursor-pointer font-bold pt-10 text-black hover:text-blue-600"
              >
                Profile
              </p>
              <p
                onClick={() => {
                  router.push("/my-appointment");
                  setShowMenu(false);
                }}
                className="cursor-pointer font-bold mt-4 text-black hover:text-blue-600"
              >
                Bookings
              </p>
              {/* Logout Button */}
              <div className="w-full px-17 mt-6 items-center">
                <button
                  onClick={() => {
                    setToken(false);
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
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-md">
              <p
                onClick={() => {
                  router.push("/register");
                  setShowMenu(false);
                }}
                className="cursor-pointer font-bold pt-10 text-black hover:text-blue-600"
              >
                Register
              </p>
              <p
                onClick={() => {
                  router.push("/login");
                  setShowMenu(false);
                }}
                className="cursor-pointer font-bold mt-4 text-black hover:text-blue-600"
              >
                Login
              </p>
            </div>
          )}
        </div>
      </motion.div>
    )
  );
};

export default MobileNavbar;