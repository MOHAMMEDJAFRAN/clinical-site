"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import CitySearchDropdown from "../ui/Citysearch";
import { doctors } from "../../public/assets/assets";

const Header = () => {
  const router = useRouter();
  const suggestionsRef = useRef(null);

  const [formData, setFormData] = useState({
    doctor: "",
    city: "",
    specialization: "",
    date: "",
  });

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDatePlaceholder, setShowDatePlaceholder] = useState(true);

  // Function to filter doctors based on input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "doctor") {
      if (value.length > 0) {
        const suggestions = doctors.filter((doc) =>
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
  };

  const handleSearch = () => {
    const query = new URLSearchParams(formData).toString();
    router.push(`/doctor?${query}`);
  };

  const handleClearDate = () => {
    setFormData({ ...formData, date: "" });
    setShowDatePlaceholder(true);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate today's date and one week ahead
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

        {/* Horizontal Form Layout */}
        <div className="flex flex-wrap gap-3 items-center justify-between ">
          {/* City Dropdown */}
          <div className="relative lg:flex w-full sm:w-[35%] text-black gap-3 justify-between">
            <CitySearchDropdown
              selectedCity={formData.city} // ✅ Pass selected city
              onSelectCity={handleCitySelect}
              cities={[...new Set(doctors.map((doc) => doc.city))]} // ✅ Ensure unique city list
            />
          </div>

          {/* Doctor Input with Suggestions */}
          <div className="relative w-full sm:w-[35%]" ref={suggestionsRef}>
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full border text-black border-gray-300 rounded-sm py-3 px-3"
            />
            {showSuggestions && filteredDoctors.length > 0 && (
              <ul className="absolute w-full bg-white text-black border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredDoctors.map((doc) => (
                  <li
                    key={doc._id}
                    className="p-2 cursor-pointer hover:bg-blue-200"
                    onClick={() => handleDoctorSelect(doc.name)}
                  >
                    {doc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date selection field */}
          <div className="relative w-full text-black sm:w-[20%]">
            <input
              type={showDatePlaceholder ? "text" : "date"}
              name="date"
              min={today}
              max={maxDate}
              value={formData.date}
              placeholder={showDatePlaceholder ? "Select Date" : ""}
              onFocus={() => setShowDatePlaceholder(false)}
              onBlur={(e) => {
                if (!e.target.value) {
                  setShowDatePlaceholder(true);
                }
              }}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm py-3 px-3"
            />
            {formData.date && (
              <button
                className="absolute right-15 font-extrabold top-3 text-gray-600 hover:text-red-600"
                onClick={handleClearDate}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Button */}
          <div className="w-full flex justify-end mt-1">
            <Button label="Search" onClick={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
