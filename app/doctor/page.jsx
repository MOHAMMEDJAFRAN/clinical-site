"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CitySearchDropdown from "../ui/Citysearch";
import DateFilter from "../ui/Datefilter";
import { doctors } from "../../public/assets/assets";
import BookingForm from "../components/Bookingform";

const DoctorsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const suggestionsRef = useRef(null);

  // Extract query values
  const queryDoctor = searchParams.get("doctor") || "";
  const queryCity = searchParams.get("city") || "";
  const queryDate = searchParams.get("date") || "";

  // State for filters
  const [selectedCity, setSelectedCity] = useState(queryCity);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [doctorNameInput, setDoctorNameInput] = useState(queryDoctor);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [doctorForBooking, setDoctorForBooking] = useState(null);

  useEffect(() => {
    setSelectedCity(queryCity);
    setSelectedDate(queryDate);
    setDoctorNameInput(queryDoctor);
  }, [queryCity, queryDoctor, queryDate]);

  // Handle clearing suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handleBack = () => {
      router.back(); // Go back to the previous page
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [router]);

  // Update URL query parameters
  const updateQueryParams = (param, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle doctor name input changes
  const handleDoctorNameChange = (e) => {
    const value = e.target.value;
    setDoctorNameInput(value);
    setShowSuggestions(value.length > 0);
  };

  // Handle selecting a doctor from the suggestions
  const selectDoctorName = (name) => {
    setDoctorNameInput(name);
    setShowSuggestions(false);
    updateQueryParams("doctor", name);
  };

  const clearDoctorName = () => {
    setDoctorNameInput("");
    setShowSuggestions(false);
    updateQueryParams("doctor", "");
  };

  // Clear doctor name when empty
  useEffect(() => {
    if (!doctorNameInput) {
      updateQueryParams("doctor", "");
    }
  }, [doctorNameInput]);

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter(
    (doc) =>
      (!doctorNameInput || doc.name.toLowerCase().includes(doctorNameInput.toLowerCase())) &&
      (!selectedCity || doc.city === selectedCity) &&
      (!selectedDate || doc.availableDate === selectedDate)
  );

  // Filter doctors for suggestions (ignore city and date filters)
  const doctorSuggestions = doctors.filter(
    (doc) => !doctorNameInput || doc.name.toLowerCase().includes(doctorNameInput.toLowerCase())
  );


  const defaultUserImage = "/assets/user.png";

  // Function to open booking form
  const openBookingForm = (doctor) => {
    setDoctorForBooking(doctor);
    setShowBookingForm(true);
  };

  // Function to close booking form
  const closeBookingForm = () => {
    setShowBookingForm(false);
    setDoctorForBooking(null);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center h-screen scroll-smooth">
        {/* Sticky Filter Bar */}
        <div className="top-0 mt-30 fixed rounded-lg bg-white shadow-md p-4 w-auto">
          <div className="flex text-black flex-wrap gap-4 items-center justify-between">
            {/* City Filter */}
            <div className="relative lg:flex w-full sm:w-[35%] text-black">
              <CitySearchDropdown 
               selectedCity={queryCity}
               onSelectCity={(city) => {
                setSelectedCity(city);
                updateQueryParams("city", city);
                }}
               cities={doctors.map((doc) => doc.city)}
              />
            </div>

            {/* Doctor Name Filter */}
            <div className="relative w-full sm:w-60 md:w-72 lg:w-80" ref={suggestionsRef}>
              <input
                type="text"
                placeholder="Search Doctor Name"
                value={doctorNameInput}
                onChange={handleDoctorNameChange}
                className="w-full border text-black border-gray-300 bg-white rounded-sm py-3 px-3"
              />
              {doctorNameInput && (
                <button
                  className="absolute right-10 top-3 font-extrabold text-gray-500 hover:text-red-600"
                  onClick={clearDoctorName}
                >
                  ✕
                </button>
              )}
              {showSuggestions && (
                <ul className="absolute w-full bg-white text-black border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                  {doctorSuggestions.map((doc) => (
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
          </div>
        </div>

        {/* Doctor Listings */}
        <div className="flex-1 mt-80 sm:mt-60 lg:mt-50 overflow-y-auto p-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center md:flex-row md:items-center justify-between w-full inset-shadow-sm inset-shadow-gray-300"
                >
                  {/* Doctor Image */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
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
                    <h3 className="text-md text-black font-semibold">{doc.name}</h3>
                    <p className="text-xs text-gray-600">{doc.hospital}</p>
                    <p className="text-xs text-gray-600">{doc.city}</p>
                  </div>

                  {/* Channel Button */}
                  <div className="text-center mt-3 md:mt-0">
                    <p className="text-sm text-gray-600 font-semibold">{doc.availableDate}</p>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-red-600 transition shadow-lg shadow-blue-500/30 hover:shadow-red-500/30"
                      onClick={() => openBookingForm(doc)}
                    >
                      Channel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center md:ml-100 col-span-2 text-gray-500 text-lg">No doctors found</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && <BookingForm doctor={doctorForBooking} onClose={closeBookingForm} />}
    </Suspense>
  );
};

export default DoctorsPage;
