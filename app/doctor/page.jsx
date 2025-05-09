"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CitySearchDropdown from "../ui/Citysearch";
import DateFilter from "../ui/Datefilter";
import BookingForm from "../components/Bookingform";
import axios from "axios";

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
  const [loadingClinic, setLoadingClinic] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorSuggestions, setDoctorSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultUserImage = "/assets/user.png";

  // Fetch doctors based on filters
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const params = {
        doctor: doctorNameInput,
        city: selectedCity,
        date: selectedDate
      };

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/doctors`, { params });
      
      // Process doctors with their availability status
      const processedDoctors = await Promise.all(
        response.data.map(async (doc) => {
          try {
            const shiftResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${doc._id}/shift-times/${selectedDate || new Date().toISOString().split('T')[0]}`
            );
            
            const hasAvailableShifts = shiftResponse.data.some(
              shift => shift.status === 'Available' && shift.isActive
            );
            
            return {
              ...doc,
              status: hasAvailableShifts ? 'Available' : 'Unavailable',
              shiftTimes: shiftResponse.data
            };
          } catch (error) {
            console.error(`Error fetching shifts for doctor ${doc._id}:`, error);
            return {
              ...doc,
              status: 'Unavailable',
              shiftTimes: []
            };
          }
        })
      );

      setFilteredDoctors(processedDoctors);
      
      // For suggestions (without availability check)
      if (doctorNameInput) {
        const suggestionResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/doctors`, 
          { params: { doctor: doctorNameInput } }
        );
        setDoctorSuggestions(suggestionResponse.data);
      } else {
        setDoctorSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCity(queryCity);
    setSelectedDate(queryDate);
    setDoctorNameInput(queryDoctor);
  }, [queryCity, queryDoctor, queryDate]);

  // Fetch doctors when filters change
  useEffect(() => {
    fetchDoctors();
  }, [doctorNameInput, selectedCity, selectedDate]);

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

  // Open booking form with loading spinner
  const openBookingForm = async (doctor) => {
    setLoadingClinic(true);
    try {
      // Fetch complete doctor details with shift times
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${doctor._id}`
      );
      setDoctorForBooking({
        ...response.data,
        availableDate: selectedDate || new Date().toISOString().split('T')[0]
      });
      setShowBookingForm(true);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      alert("Failed to load doctor details. Please try again.");
    } finally {
      setLoadingClinic(false);
    }
  };

  // Function to close booking form
  const closeBookingForm = () => {
    setShowBookingForm(false);
    setDoctorForBooking(null);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Loading Spinner Overlay */}
      {loadingClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30">
          <svg className="animate-spin h-16 w-16 text-blue-500" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path
              fill="currentColor"
              d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"
            />
          </svg>
        </div>
      )}

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
                cities={Array.from(new Set(filteredDoctors.map(doc => doc.city)))}
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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-16 w-16 text-blue-500" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                  opacity=".25"
                />
                <path
                  fill="currentColor"
                  d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"
                />
              </svg>
            </div>
          ) : (
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
                        src={doc.photo || defaultUserImage}
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
                      <p className="text-xs text-gray-600">{doc.clinicName}</p>
                      <p className="text-xs text-gray-600">{doc.city}</p>
                    </div>

                    {/* Channel Button */}
                    <div className="text-center mt-3 md:mt-0">
                      <p className="text-sm text-gray-600 font-semibold">{doc.availableDate}</p>
                      {doc.status === "Available" ? (
                        <button
                          className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-red-600 transition shadow-lg shadow-blue-500/30 hover:shadow-red-500/30"
                          onClick={() => openBookingForm(doc)}
                        >
                          Book Appointment
                        </button>
                      ) : (
                        <button
                          className="bg-gray-400 text-sm text-white px-4 py-2 rounded-lg mt-2 cursor-not-allowed shadow-md"
                          disabled
                          title={doc.shiftTimes.length === 0 ? "No available time slots" : "Doctor unavailable"}
                        >
                          Book Appointment
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center md:ml-100 col-span-2 text-gray-500 text-lg">
                  No doctors found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && doctorForBooking && (
        <BookingForm 
          doctor={doctorForBooking} 
          onClose={closeBookingForm} 
          onBookingSuccess={() => {
            fetchDoctors();
            closeBookingForm();
          }}
        />
      )}
    </Suspense>
  );
};

export default DoctorsPage;