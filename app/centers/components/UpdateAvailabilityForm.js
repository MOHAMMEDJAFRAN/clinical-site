'use client';

import { useState, useEffect } from 'react';

const UpdateAvailabilityForm = ({ 
  doctor, 
  availability, 
  onSave, 
  onCancel 
}) => {
  // Get today and next 7 days
  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = date.toISOString().split('T')[0];
      dates.push({
        value: formattedDate,
        display: new Intl.DateTimeFormat('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }).format(date)
      });
    }
    return dates;
  };

  const availableDates = getNextSevenDays();
  const [selectedDate, setSelectedDate] = useState(availableDates[0].value);
  const [updatedAvailability, setUpdatedAvailability] = useState({
    doctorId: doctor.id,
    date: selectedDate,
    shifts: ['', '', ''],
    status: 'Available'
  });
  
  // Track entered shift times separately to preserve them
  const [enteredShifts, setEnteredShifts] = useState({});

  useEffect(() => {
    const doctorAvailability = availability.find(
      avail => avail.doctorId === doctor.id && avail.date === selectedDate
    );

    // Check if we have saved entered shifts for this date
    const savedShifts = enteredShifts[selectedDate] || [];
    // Get previously saved status for this date if available
    const savedStatus = enteredShifts[`${selectedDate}-status`] || null;

    if (doctorAvailability) {
      // Ensure we always have 3 shifts, filling with empty strings if needed
      const shifts = [...doctorAvailability.shifts || []];
      while (shifts.length < 3) shifts.push('');
      
      setUpdatedAvailability({
        doctorId: doctor.id,
        date: selectedDate,
        shifts: savedShifts.length > 0 ? savedShifts : shifts.slice(0, 3), // Use entered shifts if available
        // Use saved status if available, otherwise use the one from availability or default to Available
        status: savedStatus || doctorAvailability.status || 'Available'
      });
    } else {
      // Use saved entered shifts or doctor's default shifts if available
      setUpdatedAvailability({
        doctorId: doctor.id,
        date: selectedDate,
        shifts: savedShifts.length > 0 ? savedShifts : [
          doctor.shiftTime1 || '', 
          doctor.shiftTime2 || '', 
          doctor.shiftTime3 || ''
        ].slice(0, 3), // Ensure exactly 3 shifts
        // Use saved status if available, otherwise default to Available
        status: savedStatus || 'Available'
      });
    }
  }, [doctor, selectedDate, availability, enteredShifts]);

  const handleShiftChange = (index, value) => {
    const updatedShifts = [...updatedAvailability.shifts];
    updatedShifts[index] = value;

    // Save entered shifts by date
    setEnteredShifts({
      ...enteredShifts,
      [selectedDate]: updatedShifts
    });

    setUpdatedAvailability({
      ...updatedAvailability,
      shifts: updatedShifts
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleStatusChange = (newStatus) => {
    // Save the status selection for this date
    setEnteredShifts({
      ...enteredShifts,
      [`${selectedDate}-status`]: newStatus
    });
    
    setUpdatedAvailability({
      ...updatedAvailability,
      status: newStatus,
      // Keep the shifts regardless of status change
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get all shifts whether empty or not
    const currentShifts = [...updatedAvailability.shifts];
    
    // For validation, filter out empty shifts
    const nonEmptyShifts = currentShifts.filter(shift => shift.trim() !== '');
    
    if (nonEmptyShifts.length === 0 && updatedAvailability.status === 'Available') {
      alert("Please enter at least one shift time or mark as Unavailable");
      return;
    }

    // Save all shifts, including empty ones if status is Available
    // This preserves the user's input
    const shiftsToSave = updatedAvailability.status === 'Available' 
      ? currentShifts 
      : [];

    // Always save the non-empty shifts when status is Available
    // Otherwise send empty shifts array for Unavailable
    onSave({
      ...updatedAvailability,
      shifts: updatedAvailability.status === 'Available' ? nonEmptyShifts : []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-auto">
        <h3 className="text-lg sm:text-xl text-gray-800 font-bold text-center mb-3">
          Update Availability for {doctor.name}
        </h3>
        
        {/* Date Selection Card */}
        <div className="mb-4 border rounded-lg p-3 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableDates.map((date) => (
              <button
                key={date.value}
                type="button"
                onClick={() => handleDateChange(date.value)}
                className={`py-2 px-3 text-xs sm:text-sm rounded-md transition flex flex-col items-center justify-center h-16 ${
                  selectedDate === date.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{date.display.split(',')[0]}</span>
                <span>{date.display.split(',')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor Status</label>
            <select
              value={updatedAvailability.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Shift {index + 1} Time {index === 0 && updatedAvailability.status === 'Available' && '(Required if Available)'}
              </label>
              <input
                type="text"
                value={updatedAvailability.shifts[index] || ''}
                onChange={(e) => handleShiftChange(index, e.target.value)}
                className="w-full text-gray-500 p-2 border border-gray-300 rounded-md"
                placeholder={`e.g. ${9 + index * 3}am to ${12 + index * 3}pm`}
                disabled={updatedAvailability.status === 'Unavailable'}
              />
            </div>
          ))}

          <div className="flex justify-between pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-100 text-gray-800 py-2 px-3 sm:px-4 rounded-md hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-600 transition text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAvailabilityForm;