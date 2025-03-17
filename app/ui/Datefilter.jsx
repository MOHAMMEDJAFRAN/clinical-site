"use client";
import React, { useState } from "react";

const DateFilter = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    onSelectDate(newDate); // Pass selected date to parent
  };

  return (
    <div className="mb-0">
      <input
        type="date"
        placeholder="Select Date"
        value={selectedDate}
        onChange={handleDateChange}
        className="w-full p-2 border border-gray-500 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
};

export default DateFilter;
