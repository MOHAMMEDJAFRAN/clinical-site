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
    <div className="relative w-50">
      <input
        type="date"
        name="date"
        placeholder="Select Date"
        value={selectedDate}
        onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = "text"; // Hide date format when empty
                }
              }}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
        />
    </div>

    
  );
};

export default DateFilter;
