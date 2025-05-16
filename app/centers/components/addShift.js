import { useState, useEffect } from 'react';

const AddShiftForm = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  doctor, 
  selectedDate, 
  existingShifts,
  onDateChange, 
  onSave, 
  onCancel, 
  isLoading, 
  error 
}) => {
  const [newShifts, setNewShifts] = useState([]);
  const maxShifts = 3;

  // Initialize form when existing shifts or date changes
  useEffect(() => {
    setNewShifts([createEmptyShift(0)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, existingShifts]);

  const createEmptyShift = (index) => ({
    timeRange: '',
    shiftName: `Shift ${existingShifts.length + index + 1}`,
    date: selectedDate,
    status: 'Available',
    isActive: true
  });

  const handleAddShift = () => {
    if ((existingShifts.length + newShifts.length) >= maxShifts) return;
    setNewShifts([...newShifts, createEmptyShift(newShifts.length)]);
  };

  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  

  const handleRemoveShift = (index) => {
    if (newShifts.length <= 1) return;
    const updated = [...newShifts];
    updated.splice(index, 1);
    
    // Recalculate shift names after removal
    const updatedWithCorrectNames = updated.map((shift, i) => ({
      ...shift,
      shiftName: `Shift ${existingShifts.length + i + 1}`
    }));
    
    setNewShifts(updatedWithCorrectNames);
  };

  const handleShiftChange = (index, field, value) => {
    const updated = [...newShifts];
    updated[index] = { ...updated[index], [field]: value };
    setNewShifts(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const shiftsToSave = newShifts
      .filter(s => s.timeRange.trim())
      .map(shift => ({
        ...shift,
        date: selectedDate
      }));
    
    if (shiftsToSave.length === 0) {
      alert('Please add at least one valid shift');
      return;
    }
    
    onSave(shiftsToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="p-2 border-2 text-gray-500 border-gray-200 rounded-md w-full"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Shifts (Max 3)
          </label>
          <span className="text-sm text-gray-500">
            {existingShifts.length + newShifts.length}/{maxShifts}
          </span>
        </div>

        {/* Existing Shifts */}
        {existingShifts.map((shift, index) => (
          <div key={`existing-${index}`} className="mb-3 p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Shift Name</label>
                <input
                  type="text"
                  value={shift.shiftName}
                  readOnly
                  className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full bg-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Time Range</label>
                <input
                  type="text"
                  value={shift.timeRange}
                  readOnly
                  className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full bg-gray-100"
                />
              </div>
              <div className="w-8"></div>
            </div>
          </div>
        ))}

        {/* New Shifts */}
        <div className="space-y-3">
          {newShifts.map((shift, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-gray-500 mb-1">Shift Name</label>
                <input
                  type="text"
                  value={shift.shiftName}
                  onChange={(e) => handleShiftChange(index, 'shiftName', toSentenceCase(e.target.value))}
                  className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-gray-500 mb-1">Time Range</label>
                <input
                  type="text"
                  placeholder="e.g., 9:00am - 5:00pm"
                  value={shift.timeRange}
                  onChange={(e) => handleShiftChange(index, 'timeRange', e.target.value)}
                  className="p-2 border text-gray-500 text-sm border-gray-300 rounded w-full"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveShift(index)}
                className={`mt-5 p-2 rounded ${
                  newShifts.length <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'
                }`}
                disabled={newShifts.length <= 1}
                title={newShifts.length <= 1 ? "At least one shift is required" : "Remove shift"}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add Shift Button */}
        <button
          type="button"
          onClick={handleAddShift}
          className={`mt-3 w-full text-center py-2 px-4 rounded ${
            (existingShifts.length + newShifts.length) >= maxShifts
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
          disabled={(existingShifts.length + newShifts.length) >= maxShifts}
        >
          + Add New Shift
        </button>
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
          {isLoading ? 'Saving...' : 'Save Shifts'}
        </button>
      </div>
    </form>
  );
};

export default AddShiftForm;