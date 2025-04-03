"use client";
import React, { useState } from "react";

const DateFilter = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Calculate today's date and one week ahead
  const today = new Date().toISOString().split("T")[0];
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const maxDate = oneWeekLater.toISOString().split("T")[0];

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setShowPlaceholder(false);
    onSelectDate(newDate); // Pass selected date to parent
  };

  const handleClearDate = () => {
    setSelectedDate("");
    setShowPlaceholder(true);
    onSelectDate(""); // Reset date in parent
  };

  return (
    <div className="relative w-full sm:w-50">
      <input
        type={showPlaceholder ? "text" : "date"}
        name="date"
        placeholder="Select Date"
        min={today}
        max={maxDate}
        value={selectedDate}
        onFocus={(e) => {
          e.target.type = "date";
          setShowPlaceholder(false);
        }}
        onBlur={(e) => {
          if (!e.target.value) {
            e.target.type = "text"; // Hide date format when empty
            setShowPlaceholder(true);
          }
        }}
        onChange={handleDateChange}
        className="w-full border border-gray-300 rounded-md py-3 px-3"
      />
      {selectedDate && (
        <button
          className="absolute right-15 font-extrabold top-3 text-gray-500 hover:text-red-600"
          onClick={handleClearDate}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default DateFilter;
