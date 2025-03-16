"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CitySearchDropdown from "../ui/Citysearch";
import DateFilter from "../ui/Datefilter";
import SpecialityDropdown from "../ui/Specialtydropdown";
import { doctors } from "../../public/assets/assets";

const DoctorsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query values
  const queryDoctor = searchParams.get("doctor") || "";
  const queryCity = searchParams.get("city") || "";
  const querySpecialization = searchParams.get("specialization") || "";
  const queryDate = searchParams.get("date") || "";

  // State to store selected filters
  const [selectedCity, setSelectedCity] = useState(queryCity);
  const [selectedSpeciality, setSelectedSpeciality] = useState(querySpecialization);
  const [selectedDoctor, setSelectedDoctor] = useState(queryDoctor);
  const [selectedDate, setSelectedDate] = useState(queryDate);

  const [doctorNameInput, setDoctorNameInput] = useState(queryDoctor);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSelectedCity(queryCity);
    setSelectedSpeciality(querySpecialization);
    setSelectedDoctor(queryDoctor);
    setSelectedDate(queryDate);
    setDoctorNameInput(queryDoctor);
  }, [queryCity, querySpecialization, queryDoctor, queryDate]);

  // Get unique specialities
  const specialities = [...new Set(doctors.map((doc) => doc.speciality))];

  // Function to update the query parameters when a filter is selected
  const updateQueryParams = (param, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Doctor name filter handling
  const handleDoctorNameChange = (e) => {
    const value = e.target.value;
    setDoctorNameInput(value);
    setShowSuggestions(value.length > 0);
  };

  const selectDoctorName = (name) => {
    setDoctorNameInput(name);
    setSelectedDoctor(name);
    setShowSuggestions(false);
    updateQueryParams("doctor", name);
  };

  // Filter doctors based on inputs
  const filteredDoctors = doctors.filter(
    (doc) =>
      (!doctorNameInput || doc.name.toLowerCase().includes(doctorNameInput.toLowerCase())) &&
      (!selectedCity || doc.city === selectedCity) &&
      (!selectedSpeciality || doc.speciality === selectedSpeciality) &&
      (!selectedDate || doc.availableDate === selectedDate)
  );

  const defaultUserImage = "/assets/user.png";

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col md:flex-row mt-20 h-screen scroll-smooth">
    {/* Left Sidebar (Filters) */}
    <div className="w-full md:w-1/4 bg-gray-200 border-2 shadow-2xl lg:w-1/4 rounded-2xl p-5 text-gray-500 fixed md:relative md:h-auto md:min-h-screen">
      <br />
      
      {/* City Filter */}
      <CitySearchDropdown
        selectedCity={queryCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          updateQueryParams("city", city);
        }}
        cities={doctors.map((doc) => doc.city)}
      />

      {/* Doctor Name Filter */}
      <div className="relative w-full mt-4">
        <input
          type="text"
          placeholder="Search Doctor Name"
          value={doctorNameInput}
          onChange={handleDoctorNameChange}
          className="w-full border text-black border-gray-300 bg-white rounded-md mb-5 py-2 px-3"
        />
        {showSuggestions && (
          <ul className="absolute w-full bg-white text-black border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {filteredDoctors.map((doc) => (
              <li
                key={doc._id}
                className="p-2 cursor-pointer hover:bg-blue-200"
                onClick={() => selectDoctorName(doc.name)}
              >
                {doc.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date Filter */}
      <DateFilter
        selectedDate={queryDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          updateQueryParams("date", date);
        }}
      />

      {/* Speciality Dropdown */}
      <SpecialityDropdown
        selectedCity={querySpecialization}
        specialities={specialities}
        selectedSpeciality={selectedSpeciality}
        onSelectSpeciality={(speciality) => {
          setSelectedSpeciality(speciality);
          updateQueryParams("specialization", speciality);
        }}
      />
    </div>

    {/* Right Side - Doctor Listings */}
    <div className="w-full md:ml-1/4 lg:ml-1/5 p-6 overflow-y-auto h-screen scroll-smooth">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-gray-200 rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between w-full"
            >
              {/* Doctor Image */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={doc.image ? doc.image : defaultUserImage}
                  alt={doc.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center md:text-left mt-3 md:mt-0 md:ml-4">
                <p className={`text-sm font-bold ${doc.status === "Available" ? "text-green-600" : "text-red-600"}`}>
                  ● {doc.status}
                </p>
                <h3 className="text-lg text-black font-semibold">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.speciality}</p>
                <p className="text-sm text-gray-600">{doc.hospital}</p>
                <p className="text-sm text-gray-600">{doc.city}</p>
              </div>

              {/* Channel Button */}
              <div className="text-center mt-3 md:mt-0">
                <p className="text-sm text-gray-600 font-semibold">{doc.availableDate}</p>
                {doc.status === "Available" ? (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-full mt-2 cursor-pointer hover:bg-red-600 transition"
                    onClick={() => router.push(`/doctorinfo?id=${doc._id}`)}
                  >
                    Channel
                  </button>
                ) : (
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-full mt-2 cursor-not-allowed"
                    onClick={() => alert("Doctor Unavailable")}
                  >
                    Channel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500 text-lg">No doctors found</p>
        )}
      </div>
    </div>
  </div>
  </Suspense>
    
  );
};

export default DoctorsPage;
