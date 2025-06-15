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
      
      // Append all non-file fields
      Object.entries(doctorData).forEach(([key, value]) => {
        if (key !== 'photoFile' && value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      // Append photo file if exists
      if (doctorData.photoFile instanceof File) {
        formData.append('photo', doctorData.photoFile);
      }

      const response = await apiClient.post(
        `/api/v1/Doctors/newDoc/${merchantId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      // Ensure response has data with _id
      if (!response.data?.data?._id) {
        throw new Error('Invalid response format from server');
      }
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error creating doctor:', error);
      return {
        success: false,
        error: handleServiceError(error)
      };
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

  updateDoctor: async (doctorId, doctorData) => {
    try {
      const formData = new FormData();
      
      // Append all non-file fields
      Object.entries(doctorData).forEach(([key, value]) => {
        if (key !== 'photoFile' && value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      // Handle photo upload if new file provided
      if (doctorData.photoFile instanceof File) {
        formData.append('photo', doctorData.photoFile);
      } else if (doctorData.photo === null) {
        // Explicitly handle photo removal
        formData.append('photo', '');
      }

      const response = await apiClient.put(
        `/api/v1/Doctors/update/${doctorId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      // Ensure the response contains the updated doctor data with _id
      if (!response.data?.data?._id) {
        throw new Error('Updated doctor data not received from server');
      }
      
      return {
        success: true,
        data: response.data.data // Make sure this contains the full doctor object with _id
      };
    } catch (error) {
      return {
        success: false,
        error: handleServiceError(error)
      };
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
        { shiftUpdates },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating shifts:', error);
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