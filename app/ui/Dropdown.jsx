"use client";

import Select from "react-select";

const Dropdown = ({ name, value, options, onChange, placeholder }) => {
  const handleChange = (selectedOption) => {
    onChange({ target: { name, value: selectedOption ? selectedOption.value : "" } });
  };

  return (
    <Select
      name={name}
      value={options.find((option) => option.value === value)}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      isClearable
      className="w-full"
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuShouldScrollIntoView={false} // Prevents auto-scrolling
      maxMenuHeight={200} // ✅ Sets max height for dropdown (scroll appears if needed)
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#ccc",
          padding: "5px",
          fontSize: "14px",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999, // ✅ Ensures dropdown appears above other elements
        }),
        option: (base) => ({
          ...base,
          color: "black", // ✅ Ensures dropdown appears above other elements
        }),
        
      }}
    />
  );
};

export default Dropdown;
