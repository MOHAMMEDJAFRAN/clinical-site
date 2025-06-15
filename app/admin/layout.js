'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaFileAlt, FaBuilding, FaQuestionCircle, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // 👈 Add Axios

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // 🆕 Admin Info State
  const [admin, setAdmin] = useState({
    name: '',
    role: '',
    profileImage: ''
  });

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  // 🆕 Fetch Admin Info
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-profile/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, role, profileImage } = res.data.data;
        setAdmin({ name, role, profileImage });
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchAdminProfile();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar */}
      <aside 
        ref={mobileMenuRef}
        className={`fixed md:relative z-30 w-64 bg-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex flex-col space-y-4 h-full">
          {/* Sidebar Title */}
          <div className="flex items-center space-x-2 mb-8 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-white">VitalCare</div>
            <div className="text-lg text-red-300">Hub</div>
          </div>

          {/* Navigation */}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className={`mr-3 ${isActive(item.href) ? 'text-blue-700' : 'text-blue-600 group-hover:text-blue-800'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-grow"></div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <nav className="bg-white p-4 shadow-md flex justify-between items-center">
          <div className="md:hidden text-lg font-semibold text-gray-800">
            {pathname.split('/').pop() || 'Dashboard'}
          </div>

          <div className="hidden md:flex items-center space-x-4"></div>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {/* 👤 Dynamic Photo */}
                {admin.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={admin.profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                )}

                {/* 👤 Dynamic Name/Role */}
                <div className="hidden sm:block text-left">
                  <p className="font-medium text-gray-800">{admin.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{admin.role || 'Admin'}</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  {/* <Link href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    <FaCog className="mr-2" /> Settings
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="p-4 sm:p-6 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
