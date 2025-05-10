// components/AddShiftForm.js
import { useState } from 'react';

const AddShiftForm = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  doctor, 
  selectedDate, 
  onDateChange, 
  onSave, 
  onCancel, 
  isLoading, 
  error 
}) => {
  const [shifts, setShifts] = useState([{ timeRange: '', shiftName: '' }]);

  const handleAddShift = () => {
    setShifts([...shifts, { timeRange: '', shiftName: '' }]);
  };

  const handleRemoveShift = (index) => {
    if (shifts.length <= 1) return;
    setShifts(shifts.filter((_, i) => i !== index));
  };

  const handleShiftChange = (index, field, value) => {
    const updated = [...shifts];
    updated[index][field] = value;
    setShifts(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(shifts.filter(s => s.timeRange.trim()));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="p-2 border-2 border-gray-200 rounded-md w-full"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shifts
        </label>
        
        {shifts.map((shift, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Shift name (optional)"
              value={shift.shiftName}
              onChange={(e) => handleShiftChange(index, 'shiftName', e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Time range (e.g., 9.00am - 5.00pm)"
              value={shift.timeRange}
              onChange={(e) => handleShiftChange(index, 'timeRange', e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveShift(index)}
              className="bg-red-100 text-red-600 p-2 rounded"
              disabled={shifts.length <= 1}
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddShift}
          className="text-blue-500 text-sm mt-1"
        >
          + Add another shift
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Shifts'}
        </button>
      </div>
    </form>
  );
};

export default AddShiftForm;