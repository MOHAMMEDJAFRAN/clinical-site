import Select from "react-select";
import React from "react";

const CitySearchDropdown = ({ selectedCity, onSelectCity, cities }) => {
  // Format city options for react-select
  const cityOptions = [
    { value: "", label: "All Cities" }, // Option to reset selection
    ...[...new Set(cities)].map(city => ({ value: city, label: city })),
  ];

  // Find the selected city in options
  const selectedOption = cityOptions.find(option => option.value === selectedCity) || null;

  // Handle selection change
  const handleChange = (selectedOption) => {
    onSelectCity(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="mb-0 w-sm">
      <Select
        value={selectedOption} // ✅ Display the selected city
        onChange={handleChange}
        options={cityOptions}
        placeholder="Search & Select City"
        isClearable
        isSearchable
        className="w-sm text-sm md:text-base"
        styles={{
          control: (base, { isFocused }) => ({
            ...base,
            borderColor: isFocused ? "#007bff" : "#ccc",
            boxShadow: isFocused ? "0 0 5px rgba(0, 123, 255, 0.5)" : "none",
            padding: "6px",
            fontSize: "14px",
            minHeight: "40px",
          }),
          menu: (base) => ({
            ...base,
            fontSize: "14px",
            zIndex: 10, // Prevents overlap issues
          }),
        }}
      />
    </div>
  );
};

export default CitySearchDropdown;
