"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DoctorCard = ({ doctor, layout = "horizontal" }) => {
  const router = useRouter();

  return (
    <div
      className={`bg-gray-300 shadow-md inset-shadow-sm inset-shadow-gray-300/50 rounded-lg p-4 
      flex flex-col sm:flex-row sm:items-center sm:gap-6 ${
        layout === "horizontal" ? "sm:flex-row" : "flex-col"
      } gap-4`}
    >
      {/* Doctor Image */}
      <img
        src={doctor.image || "/assets/user.png"}
        alt={doctor.name}
        className="w-16 h-16 bg-white rounded-full mx-auto sm:mx-0"
      />

      {/* Doctor Details */}
      <div className="flex flex-col flex-grow text-center sm:text-left">
        <h3 className="text-md text-black font-semibold">{doctor.name}</h3>
        <p className="text-xs text-gray-500">{doctor.speciality}</p>
        <p className="text-xs text-gray-400">{doctor.city}</p>
        <p className="text-xs text-gray-400">{doctor.availableTime}</p>
      </div>

      {/* Channel Button */}
      <button
        className="px-4 text-md lg:text-lg py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600 shadow-lg shadow-blue-500/20 hover:shadow-red-500/20 cursor-pointer mt-4 sm:mt-0 sm:w-auto w-full"
        onClick={() => router.push(`/doctorinfo?id=${doctor._id}`)}
      >
        Channel
      </button>
    </div>
  );
};

export default DoctorCard;
