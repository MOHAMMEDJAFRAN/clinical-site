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
    <div className="mb-5">
      <Select
        value={selectedOption} // ✅ Display the selected city
        onChange={handleChange}
        options={cityOptions}
        placeholder="Search & Select City"
        isClearable
        isSearchable
        className="w-full"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#ccc",
            padding: "5px",
            fontSize: "14px",
          }),
        }}
      />
    </div>
  );
};

export default CitySearchDropdown;
