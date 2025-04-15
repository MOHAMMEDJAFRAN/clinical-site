'use client';

import { usePathname } from 'next/navigation';
import { FaHome, FaFileAlt, FaBuilding, FaQuestionCircle, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Section */}
      <aside className="w-64 bg-white p-6 shadow-xl">
        <div className="flex flex-col space-y-4 h-full">
          {/* Logo and Sidebar Title */}
          <div className="flex items-center space-x-2 mb-8 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-white">VitalCare</div>
            <div className="text-lg text-red-300">Hub</div>
          </div>

          {/* Main Navigation */}
          <div className="mt-8 space-y-8">
            <h3 className="text-lg font-semibold text-gray-500 px-4">MAIN NAVIGATION</h3>
            <ul className="space-y-4">
              {[
                { href: "/admin/dashboard", icon: <FaHome />, text: "Dashboard" },
                { href: "/admin/appointments", icon: <FaFileAlt />, text: "Appointment History" },
                { href: "/admin/manage-clinical-centers", icon: <FaBuilding />, text: "Manage Clinical" },
                { href: "/admin/manage-queries", icon: <FaQuestionCircle />, text: "Manage New Queries" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-800 shadow-inner border-l-4 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm'
                    }`}
                  >
                    <span className={`mr-3 transition-colors duration-300 ${
                      isActive(item.href) ? 'text-blue-700' : 'text-blue-600 group-hover:text-blue-800'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                    {isActive(item.href) && (
                      <span className="ml-auto">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Spacer */}
          <div className="flex-grow"></div>
        </div>
      </aside>

      {/* Main Content Section */}
      <div className="flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <nav className="bg-white p-4 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Search and Notification buttons commented out as per your previous code */}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {/* User Profile with Link */}
            <Link href="/admin/profile" className="mt-auto p-2 bg-gray-100 rounded-lg shadow-inner hover:bg-gray-200 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-sm text-gray-500">Super Admin</p>
                </div>
              </div>
            </Link>
          </div>
        </nav>

        {/* Content Area */}
        <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}