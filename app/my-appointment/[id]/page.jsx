"use client";
import { useState,useEffect } from "react";
import { useParams } from "next/navigation";
import { Appointment, doctors } from "../../../public/assets/assets";

const TABS = ["Active", "Canceled", "Completed"]; //want confamed tab add Confirmed
const DEFAULT_DOCTOR_IMAGE = "/assets/user.png";

export default function Appointments() {
  const { id } = useParams();
  const userId = parseInt(id); // route param is string, convert to number
  const [activeTab, setActiveTab] = useState("Active");
  const [appointmentsData, setAppointmentsData] = useState(Appointment);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ bookingId: null, newTime: null });

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // Simulate real API with static JSON data
        // Replace this with `await fetch("/api/appointments?userId=" + userId)` in real use
        const response = Appointment;
        setAppointmentsData(response);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchAppointments();
  }, [userId]);

  const userAppointments =
    appointmentsData.find((user) => user.userId === userId)?.my_appointments || [];

  const filteredAppointments = userAppointments.filter(
    (appt) => appt.status.toLowerCase() === activeTab.toLowerCase()
  );

  const DoctorImage = ({ doctorId, className }) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    return (
      <img 
        src={doctor?.image || DEFAULT_DOCTOR_IMAGE} 
        alt={doctor?.name || "Doctor"} 
        className={className}
        onError={(e) => {
          e.target.src = DEFAULT_DOCTOR_IMAGE;
        }}
      />
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDoctorCity = (doctorId) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor?.city || "Unknown";
  };

  const handleCancel = (bookingId) => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedData = appointmentsData.map((user) => {
        if (user.userId !== userId) return user;
        return {
          ...user,
          my_appointments: user.my_appointments.map((appt) =>
            appt.bookingId === bookingId ? { ...appt, status: "Canceled" } : appt
          ),
        };
      });
      setAppointmentsData(updatedData);
      setIsLoading(false);
      setShowCancelConfirm(false);
      setSelectedAppointment(null);
      setActiveTab("Canceled");
    }, 1000);
  };

  const handleReschedule = (bookingId, newTime) => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedData = appointmentsData.map((user) => {
        if (user.userId !== userId) return user;
        return {
          ...user,
          my_appointments: user.my_appointments.map((appt) =>
            appt.bookingId === bookingId
              ? { ...appt, appointmentTime: newTime, status: "Active" }
              : appt
          ),
        };
      });
      setAppointmentsData(updatedData);
      setIsLoading(false);
      setShowRescheduleConfirm(false);
      setSelectedAppointment(null);
    }, 1000);
  };

  const getDoctorShiftTimes = (doctorId) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    if (!doctor) return [];
    return [
      doctor.shift_time_1,
      doctor.shift_time_2,
      doctor.shift_time_3
    ].filter(time => time);
  };

  const openCancelConfirmation = (appointment) => {
    setAppointmentToCancel(appointment.bookingId);
    setShowCancelConfirm(true);
  };

  const openRescheduleConfirmation = (bookingId, newTime) => {
    setRescheduleData({ bookingId, newTime });
    setShowRescheduleConfirm(true);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">🩺 My Appointments</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-medium capitalize border-b-2 pb-2 px-1
              ${activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No {activeTab.toLowerCase()} appointments.</p>
        ) : (
          filteredAppointments.map((appt) => {
            return (
              <div
                key={appt.bookingId}
                onClick={() => {
                  setSelectedAppointment(appt);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 500);
                }}
                className="border bg-gray-300 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <DoctorImage 
                    doctorId={appt._id} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-blue-600 text-lg">{appt.doctorName}</h3>
                        <p className="text-gray-800 text-sm">{appt.clinic}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="mt-2 text-gray-600 text-sm">
                      <p><span className="text-gray-600">Date:</span> {appt.appointmentDate}</p>
                      <p><span className="text-gray-600">Time:</span> {appt.appointmentTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30">
          <svg className="animate-spin h-16 w-16 text-blue-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
            <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"/>
          </svg>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && !isLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl text-black font-semibold">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 font-semibold hover:text-red-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <DoctorImage 
                doctorId={selectedAppointment._id} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-blue-600">{selectedAppointment.doctorName}</h3>
                <p className="text-gray-800 text-sm">{selectedAppointment.clinic}</p>
                <p className="text-gray-600 text-sm">City: {getDoctorCity(selectedAppointment._id)}</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-600 text-sm border-t pt-4">
              <div className="flex">
                <span className="text-gray-600 w-24">Date</span>
                <span>{selectedAppointment.appointmentDate}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Time</span>
                <span>{selectedAppointment.appointmentTime}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Patient</span>
                <span>{selectedAppointment.patientName}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Contact</span>
                <span>{selectedAppointment.patientContact}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {selectedAppointment.status.toLowerCase() === "active" && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => openCancelConfirmation(selectedAppointment)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Cancel Appointment
                </button>

                <div className="relative group">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm">
                    Reschedule
                  </button>
                  <div className="absolute left-0 mt-1 w-44 bg-white border rounded-lg shadow-lg hidden group-hover:block z-20">
                    {getDoctorShiftTimes(selectedAppointment._id).map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          openRescheduleConfirmation(selectedAppointment.bookingId, time);
                        }}
                        className="block w-full text-gray-500 text-left px-4 py-2 hover:bg-blue-100 text-sm"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl  text-black font-semibold mb-4">Confirm Cancellation</h2>
            <p className="mb-6 text-gray-400">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border bg-gray-400 border-gray-300 rounded-lg hover:bg-gray-500 transition"
              >
                No
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    handleCancel(appointmentToCancel);
                  }, 500);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Confirmation Modal */}
      {showRescheduleConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-semibold text-black  mb-4">Confirm Reschedule</h2>
            <p className="mb-6  text-gray-400 ">Are you sure you want to reschedule to {rescheduleData.newTime}?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRescheduleConfirm(false)}
                className="px-4 py-2 border bg-gray-400 rounded-lg hover:bg-gray-500 transition"
              >
                No
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    handleReschedule(rescheduleData.bookingId, rescheduleData.newTime);
                  }, 500);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Yes, Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}