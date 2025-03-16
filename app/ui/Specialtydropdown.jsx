"use client";
import React from "react";

const SpecialityDropdown = ({ specialities, selectedSpeciality, onSelectSpeciality }) => {
  return (
    <div className="mb-4">
      <select
        className="w-full p-2 border rounded bg-white text-black"
        value={selectedSpeciality}
        onChange={(e) => onSelectSpeciality(e.target.value)}
      >
        <option value="">All Specialities</option>
        {specialities.map((speciality, index) => (
          <option key={index} value={speciality}>
            {speciality}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpecialityDropdown;
