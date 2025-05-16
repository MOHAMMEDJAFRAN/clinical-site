"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import CitySearchDropdown from "../ui/Citysearch";
import axios from "axios";

const Header = () => {
  const router = useRouter();
  const suggestionsRef = useRef(null);

  const [formData, setFormData] = useState({
    doctor: "",
    city: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    city: "",
    date: "",
  });

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [clinicCities, setClinicCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDatePlaceholder, setShowDatePlaceholder] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all doctors and extract clinic cities on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch doctors with populated merchant data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/doctors`, {
          params: { populate: 'merchant' }
        });
        
        setAllDoctors(response.data);
        
        // Extract unique clinic cities from merchants
        const cities = [...new Set(
          response.data
            .filter(doc => doc.merchant?.city)
            .map(doc => doc.merchant.city)
        )];
        
        setClinicCities(cities);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is filled
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "doctor") {
      if (value.length > 0) {
        const suggestions = allDoctors.filter((doc) =>
          doc.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDoctors(suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }

    if (name === "date") {
      setShowDatePlaceholder(value === "");
    }
  };

  const handleDoctorSelect = (doctorName) => {
    setFormData({ ...formData, doctor: doctorName });
    setShowSuggestions(false);
  };

  const handleCitySelect = (city) => {
    setFormData({ ...formData, city: city });
    if (errors.city) {
      setErrors({ ...errors, city: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      city: "",
      date: "",
    };
    let isValid = true;

    if (!formData.city) {
      newErrors.city = "Clinic city is required";
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSearching(true);
    
    try {
      const searchParams = {
        city: formData.city, // Will filter by merchant city in backend
        date: formData.date
      };

      if (formData.doctor) {
        searchParams.doctor = formData.doctor;
      }

      const query = new URLSearchParams(searchParams).toString();
      router.push(`/doctor?${query}`);
    } catch (error) {
      console.error("Search error:", error);
      alert(error.response?.data?.message || "An error occurred during search");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearDate = () => {
    setFormData({ ...formData, date: "" });
    setShowDatePlaceholder(true);
    setErrors({ ...errors, date: "Date is required" });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const maxDate = oneWeekLater.toISOString().split("T")[0];

  return (
    <div
      className="relative w-full h-[800px] flex items-center justify-center mt-20 mb-[-30] bg-cover bg-center inset-shadow-lg"
      style={{ backgroundImage: "url('/assets/bg-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative w-full max-w-5xl bg-white shadow-lg rounded-lg border-1 border-black p-6 opacity-80 inset-shadow-sm inset-shadow-gray-500/50">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Make Your Appointment
        </h2>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Clinic City Dropdown - Mandatory */}
          <div className="relative lg:flex w-full sm:w-[35%] text-black gap-3 justify-between">
            <CitySearchDropdown
              selectedCity={formData.city}
              onSelectCity={handleCitySelect}
              cities={clinicCities}
              isLoading={isLoading}
              placeholder="Select Clinic City"
            />
            {errors.city && (
              <p className="absolute text-red-500 text-xs mt-[-65] sm:mt-[-16]">{errors.city}</p>
            )}
          </div>

          {/* Doctor Input with Suggestions - Optional */}
          <div className="relative w-full sm:w-[35%]" ref={suggestionsRef}>
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name (Optional)"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full border text-black border-gray-300 rounded-sm py-3 px-3"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                  <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"/>
                </svg>
              </div>
            )}
            {showSuggestions && filteredDoctors.length > 0 && (
              <ul className="absolute w-full bg-white text-black border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredDoctors.map((doc) => (
                  <li
                    key={doc._id}
                    className="p-2 cursor-pointer hover:bg-blue-200"
                    onClick={() => handleDoctorSelect(doc.name)}
                  >
                    {doc.name} - {doc.specialization} ({doc.merchant?.clinicname || 'No clinic'})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date selection field - Mandatory */}
          <div className="relative w-full text-black sm:w-[20%]">
            {showDatePlaceholder && !formData.date ? (
              <div 
                className="absolute w-full border text-gray-500 border-gray-300 rounded-sm py-3 px-3 bg-white cursor-pointer"
                onClick={() => {
                  setShowDatePlaceholder(false);
                  setTimeout(() => document.querySelector('input[name="date"]')?.focus(), 50);
                }}
              >
                Select Date *
              </div>
            ) : null}
            <input
              type="date"
              name="date"
              min={today}
              max={maxDate}
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm py-3 px-3"
              onFocus={() => setShowDatePlaceholder(false)}
              onBlur={(e) => {
                if (!e.target.value) {
                  setShowDatePlaceholder(true);
                }
              }}
              onClick={(e) => {
                if (window.innerWidth <= 640) {
                  e.target.showPicker();
                }
              }}
            />
            {formData.date && (
              <button
                className="absolute right-15 font-extrabold top-3 text-gray-600 hover:text-red-600"
                onClick={handleClearDate}
              >
                ✕
              </button>
            )}
            {errors.date && (
              <p className="absolute text-red-500 text-xs mt-0 sm:mt-[-65]">{errors.date}</p>
            )}
          </div>

          {/* Search Button */}
          <div className="w-full flex justify-end mt-3">
            <Button 
              label={isSearching ? "Searching..." : "Search"} 
              onClick={handleSearch}
              disabled={isSearching || isLoading}
            >
              {isSearching && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                  <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"/>
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Full-page loading overlay */}
      {(isSearching || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white text-blue-800 p-4 rounded-lg shadow-lg flex items-center">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
              <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"/>
            </svg>
            <span>{isLoading ? "Loading data..." : "Searching doctors..."}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;