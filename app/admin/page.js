'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  FaFileAlt, 
  FaBuilding, 
  FaQuestionCircle, 
  FaHospital, 
  FaChartBar,
  FaCalendarAlt,
  FaArrowRight,
  FaPlus,
  FaFileDownload
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([
    { patient: "John Doe", doctor: "Dr. Smith", center: "Central Clinic", status: "Completed", date: "2025-03-10" },
    { patient: "Jane Smith", doctor: "Dr. Johnson", center: "North Clinic", status: "Ongoing", date: "2025-03-15" },
    { patient: "Robert Brown", doctor: "Dr. Davis", center: "East Clinic", status: "Cancelled", date: "2025-03-20" },
    { patient: "Emily Wilson", doctor: "Dr. Garcia", center: "South Clinic", status: "Completed", date: "2025-03-22" },
  ]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview and quick actions for system administration</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Appointments Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-1">Appointments</h2>
              <p className="text-gray-500">Total: <span className="font-bold text-gray-800">30</span></p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FaFileAlt className="text-orange-600 text-2xl" />
            </div>
          </div>
          <Link href="/admin/appointments" className="mt-4 inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors">
            View Appointments <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Clinical Centers Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-1">Clinical Centers</h2>
              <p className="text-gray-500">Manage centers and DICs</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBuilding className="text-blue-600 text-2xl" />
            </div>
          </div>
          <Link href="/admin/manage-clinical-centers" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            View Centers <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Queries Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-1">New Queries</h2>
              <p className="text-gray-500">Pending: <span className="font-bold text-gray-800">5</span></p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaQuestionCircle className="text-red-600 text-2xl" />
            </div>
          </div>
          <Link href="/admin/manage-queries" className="mt-4 inline-flex items-center text-red-600 hover:text-red-800 transition-colors">
            View Queries <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Clinic - Purple Theme */}
          <Link 
            href="/admin/clinical-centers/new" 
            className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg flex items-center gap-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FaPlus className="text-black text-xl" />
            </div>
            <div>
              <span className="font-medium block">Add New Clinic</span>
              <span className="text-xs opacity-80">Register a new clinical center</span>
            </div>
          </Link>

          {/* Generate Report - Teal Theme */}
          <Link 
            href="/admin/reports/generate" 
            className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg flex items-center gap-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FaFileDownload className="text-black text-xl" />
            </div>
            <div>
              <span className="font-medium block">Generate Report</span>
              <span className="text-xs opacity-80">Create system analytics report</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Recent Appointments</h3>
          <Link href="/admin/appointments" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
            View All <FaArrowRight className="ml-1" />
          </Link>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.center}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {appointment.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}