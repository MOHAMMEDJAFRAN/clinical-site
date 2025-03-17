"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import { doctors } from "../../public/assets/assets"; 

const Header = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctor: "",
    city: "",
    specialization: "",
    date: "",
  });

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
  };

  const handleDoctorSelect = (doctorName) => {
    setFormData({ ...formData, doctor: doctorName });
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const query = new URLSearchParams(formData).toString();
    router.push(`/doctor?${query}`);
  };

  const cityOptions = [
    { value: "Colombo", label: "Colombo" },
    { value: "Kandy", label: "Kandy" },
    { value: "Galle", label: "Galle" },
    { value: "Jaffna", label: "Jaffna" },
    { value: "Kurunegala", label: "Kurunegala" },
    { value: "Sammanthurai", label: "Sammanthurai" },
  ];

  const specializationOptions = [
    { value: "General physician", label: "General physician" },
    { value: "Gynecologist", label: "Gynecologist" },
    { value: "Dermatologist", label: "Dermatologist" },
    { value: "Pediatricians", label: "Pediatricians" },
    { value: "Neurologist", label: "Neurologist" },
    { value: "Dentist", label: "Dentist" },
  ];

  return (
    <div
      className="relative w-full h-[400px] flex items-center justify-center mt-[-30] bg-cover bg-center inset-shadow-lg"
      style={{ backgroundImage: "url('/assets/head-background2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 rounded-lg"></div>

      <div className="relative w-full max-w-5xl bg-white shadow-lg rounded-lg border-1 border-black p-6 opacity-90 inset-shadow-sm inset-shadow-gray-500/50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Make Your Appointment
        </h2>

        {/* Horizontal Form Layout */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Doctor Input with Suggestions */}
          <div className="relative w-full sm:w-[20%]">
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full border text-black border-gray-300 rounded-md py-2 px-3"
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
          <div className="w-full text-black  sm:w-[20%]">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300  rounded-md py-2 px-3"
            />
          </div>

          {/* City Dropdown */}
          <div className="w-full text-black sm:w-[20%]">
            <Dropdown
              name="city"
              value={formData.city}
              options={cityOptions}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          {/* Specialization Dropdown */}
          <div className="w-full text-black sm:w-[20%]">
            <Dropdown
              name="specialization"
              value={formData.specialization}
              options={specializationOptions}
              onChange={handleChange}
              placeholder="Specialization"
            />
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-[15%]">
            <Button label="Search" onClick={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
