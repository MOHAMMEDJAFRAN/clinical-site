'use client';

import { FaHome, FaUserMd, FaUsers, FaChartLine, FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function CentersLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavItem = ({ href, icon, text }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    
    return (
      <li>
        <Link
          href={href}
          className={`flex items-center p-3 rounded-lg transition-all duration-300 group ${
            isActive
              ? 'bg-blue-50 text-blue-700 shadow-inner border-l-4 border-blue-600'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className={`mr-3 ${isActive ? 'text-blue-700' : 'text-blue-600 group-hover:text-blue-800'}`}>
            {icon}
          </span>
          <span className="font-medium">{text}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden"> {/* Changed to h-screen and overflow-hidden */}
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all"
        aria-label="Open menu"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar - Now fixed height */}
      <aside 
        ref={mobileMenuRef}
        className={`fixed md:relative z-30 w-64 bg-gradient-to-b from-blue-300 to-blue-500 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: '100vh' }} // Make sidebar full height
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo and Sidebar Title */}
          <div className="flex items-center space-x-3 mb-10 p-3 rounded-lg bg-blue-800 bg-opacity-30">
            <div className="text-2xl font-bold text-white">ROYAL</div>
            <div className="text-lg text-blue-200">CLINIC</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <h3 className="text-xs uppercase tracking-wider text-white mb-4 px-2">Main Navigation</h3>
            <ul className="space-y-2">
              <NavItem href="/centers/dashboard" icon={<FaHome />} text="Dashboard" />
              <NavItem href="/centers/doctor-availability/1" icon={<FaUserMd />} text="Doctor Availability" />
              <NavItem href="/centers/staff/1" icon={<FaUsers />} text="Manage Staff" />
              <NavItem href="/centers/Analytics/1" icon={<FaChartLine />} text="Analytics" />
            </ul>
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-4 border-t border-blue-700">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <FaUserCircle className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-blue-200">Clinic Administrator</p>
              </div>
            </div>
            <Link href="/login" className="flex items-center space-x-2 text-blue-200 hover:text-white p-2 mt-2 rounded-lg transition-colors">
              <FaSignOutAlt />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Section - Now scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10 flex-shrink-0"> {/* Added flex-shrink-0 */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative text-gray-500 hover:text-blue-600"
                >
                  <FaBell className="text-xl" />
                  {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Notifications</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">New appointment scheduled</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">Doctor availability updated</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">System maintenance scheduled</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => setHasUnreadNotifications(false)}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FaUserCircle />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-medium text-gray-800">Admin User</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50"> {/* Only this part scrolls */}
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Link href="/centers/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">
              {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}