"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DoctorCard = ({ doctor, layout = "horizontal" }) => {
  const router = useRouter();

  return (
    <div
      className={`bg-gray-300 shadow-md rounded-lg p-4 flex ${
        layout === "horizontal" ? "flex-row items-center" : "flex-col items-center"
      } gap-4`}
    >
      {/* Doctor Image */}
      <img
        src={doctor.image || "/assets/user.png"}
        alt={doctor.name}
        className="w-16 h-16 bg-white rounded-full"
      />

      {/* Doctor Details */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg text-black font-semibold">{doctor.name}</h3>
        <p className="text-sm text-gray-500">{doctor.speciality}</p>
        <p className="text-sm text-gray-400">{doctor.city}</p>
      </div>

      {/* Channel Button */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => router.push(`/doctorinfo?id=${doctor._id}`)}
      >
        Channel
      </button>
    </div>
  );
};

export default DoctorCard;
