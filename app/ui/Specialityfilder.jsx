"use client";
import React from "react";

const SpecialityFilter = ({ specialities, selectedSpeciality, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-white">Specialization</h3>
      <div className="flex flex-col gap-3">
        {specialities.map((speciality, idx) => (
          <button
            key={idx}
            className={`p-2 w-full rounded-lg text-sm transition-all ${
              selectedSpeciality === speciality
                ? "bg-blue-500 text-white"
                : "bg-gray-500 text-white hover:bg-blue-500"
            }`}
            onClick={() => onSelect(speciality)}
          >
            {speciality}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecialityFilter;
