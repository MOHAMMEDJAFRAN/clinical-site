import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 100000000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const handleServiceError = (error) => {
  if (error.response) {
    const errorData = error.response.data || {
      message: error.message || 'An unknown error occurred'
    };
    console.error('API Error:', errorData);
    throw errorData;
  } else if (error.request) {
    console.error('Network Error:', error.message);
    throw { message: 'please check your connection' };
  } else {
    console.error('Request Error:', error.message);
    throw { message: error.message || 'Request configuration error' };
  }
};

export const doctorService = {
  // ✅ Create a new doctor
  // In your doctorService.js
  createDoctor: async (merchantId, doctorData) => {
    try {
      const formData = new FormData();
      
      // Append all fields
      Object.keys(doctorData).forEach(key => {
        if (key !== 'photoFile') {
          formData.append(key, doctorData[key]);
        }
      });
      
      // Append photo file if exists
      if (doctorData.photoFile) {
        formData.append('photo', doctorData.photoFile);
      }

      const response = await apiClient.post(
        `/api/v1/Doctors/newDoc/${merchantId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Get all doctors for a clinic
  getDoctorsByClinic: async (merchantId) => {
    try {
      const response = await apiClient.get(`/api/v1/Doctors/allDoc/${merchantId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Get doctor details
  getDoctorDetails: async (doctorId) => {
    try {
      const response = await apiClient.get(`/api/v1/Doctors/doc/${doctorId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Update doctor profile
  updateDoctor: async (doctorId, doctorData) => {
    try {
      const formData = new FormData();
      
      // Append basic fields
      Object.entries(doctorData).forEach(([key, value]) => {
        if (key !== 'photoFile' && key !== 'shiftTimes') {
          formData.append(key, value);
        }
      });
      
      // Handle photo upload
      if (doctorData.photoFile) {
        formData.append('photo', doctorData.photoFile);
      }

      const response = await apiClient.put(
        `/api/v1/Doctors/update/${doctorId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Delete doctor
  deleteDoctor: async (doctorId) => {
    try {
      const response = await apiClient.delete(`/api/v1/Doctors/del/${doctorId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Get doctor shifts
  getDoctorShifts: async (doctorId) => {
    try {
      const response = await apiClient.get(`/api/v1/Doctors/${doctorId}/shifts`);
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Get doctor availability
  getDoctorAvailability: async (doctorId, date) => {
    try {
      const response = await apiClient.get(`/api/v1/Doctors/${doctorId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Add shifts to doctor
  addDoctorShifts: async (doctorId, shiftTimes) => {
    try {
      const response = await apiClient.post(
        `/api/v1/Doctors/${doctorId}/shifts`,
        { shiftTimes }
      );
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Update shifts
  updateDoctorShifts: async (doctorId, shiftUpdates) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/Doctors/update/${doctorId}/shifts`,
        { shiftUpdates }
      );
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Remove shifts
  removeDoctorShifts: async (doctorId, shiftIds) => {
    try {
      const response = await apiClient.delete(`/api/v1/Doctors/delShift/${doctorId}`, {
        data: { shiftIds }
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // ✅ Replace all shifts for dates
  replaceDoctorShifts: async (doctorId, shiftTimes) => {
    try {
      const response = await apiClient.put(
        `/api/v1/Doctors/allShift/${doctorId}/shifts`,
        { shiftTimes }
      );
      return response.data;
    } catch (error) {
      return handleServiceError(error);
    }
  }
};