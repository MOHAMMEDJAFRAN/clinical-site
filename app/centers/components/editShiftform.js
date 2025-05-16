import { useState, useEffect } from 'react';

const EditShiftForm = ({ 
  shift, 
  doctor,
  onSave, 
  onCancel, 
  isLoading, 
  error 
}) => {
  const [timeRange, setTimeRange] = useState(shift.timeRange);
  const [shiftName, setShiftName] = useState(shift.shiftName || 'Shift');
  const [status, setStatus] = useState(shift.status || 'Available');

  useEffect(() => {
    setTimeRange(shift.timeRange);
    setShiftName(shift.shiftName || 'Shift');
    setStatus(shift.status || 'Available');
  }, [shift]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...shift,
      timeRange,
      shiftName,
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2 text-gray-800">
          Edit Shift for {doctor.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Date: {new Date(shift.date).toLocaleDateString()}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shift Name
        </label>
        <input
          type="text"
          value={shiftName}
          onChange={(e) => setShiftName(e.target.value)}
          className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Range
        </label>
        <input
          type="text"
          placeholder="e.g., 9:00 AM - 5:00 PM"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full"
        >
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
          <option value="Booked">Booked</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Update Shift'}
        </button>
      </div>
    </form>
  );
};

export default EditShiftForm;