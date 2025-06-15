'use client';

import { FaHome, FaUserMd, FaUsers, FaChartLine, FaBell, FaSpinner, FaAccessibleIcon , FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaRegQuestionCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CentersLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [clinicData, setClinicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mobileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isNotificationActionLoading, setIsNotificationActionLoading] = useState(false);

  // Extract clinicId from localStorage
  const getClinicId = () => {
    const profileData = localStorage.getItem('profileData');
    if (profileData) {
      try {
        const parsedData = JSON.parse(profileData);
        return parsedData.id || null;
      } catch (error) {
        console.error('Error parsing profile data:', error);
        return null;
      }
    }
    return null;
  };

  // Fetch clinic data and notifications
  useEffect(() => {
    const fetchData = async () => {
      const clinicId = getClinicId();
      if (!clinicId) {
        toast.error('Clinic ID not found. Please login again.');
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch clinic profile
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/layout/profile/${clinicId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
          }
        );

        if (profileResponse.data?.success) {
          setClinicData(profileResponse.data.data);
          localStorage.setItem('profileData', JSON.stringify(profileResponse.data.data));
        }

        // Fetch notifications
        const notificationsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/layout/notifications/${clinicId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
          }
        );

        if (notificationsResponse.data?.success) {
          setNotifications(notificationsResponse.data.data);
          setHasUnreadNotifications(notificationsResponse.data.data.some(n => !n.isRead));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          router.push('/login');
        } else {
          toast.error('Failed to load clinic data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const markNotificationsAsRead = async () => {
    try {
      setIsNotificationActionLoading(true);
      const clinicId = getClinicId();
      if (!clinicId) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/layout/notifications/mark-read`,
        { clinicId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setHasUnreadNotifications(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to update notifications');
    } finally {
      setIsNotificationActionLoading(false);
    }
  };

  const clearAllNotifications = async () => {
    try {
      setIsNotificationActionLoading(true);
      const clinicId = getClinicId();
      if (!clinicId) return;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/layout/notifications/clear-all`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          data: { clinicId },
          withCredentials: true
        }
      );
      
      setNotifications([]);
      setHasUnreadNotifications(false);
      setNotificationsOpen(false);
      toast.success('All notifications cleared successfully');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    } finally {
      setIsNotificationActionLoading(false);
    }
  };

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileData');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                                          
                                            </div>
                                          </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all"
        aria-label="Open menu"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar */}
      <aside 
        ref={mobileMenuRef}
        className={`fixed md:relative z-30 w-64 bg-gradient-to-b from-blue-300 to-blue-500 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: '100vh' }}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-1 right-1 text-gray-300 hover:text-white"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo and Sidebar Title */}
          <div className="flex items-center space-x-3 mb-10 p-3 rounded-lg bg-blue-800 bg-opacity-30">
            <div className="text-2xl font-bold text-white">
              {clinicData?.clinicName || 'Loading...'}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <h3 className="text-xs uppercase tracking-wider text-white mb-4 px-2">Main Navigation</h3>
            <ul className="space-y-2">
              <NavItem href="/centers/dashboard" icon={<FaHome />} text="Dashboard" />
              <NavItem href="/centers/doctor-availability/1" icon={<FaUserMd />} text="Doctor Availability" />
              <NavItem href="/centers/staff/1" icon={<FaUsers />} text="Manage Staff" />
              <NavItem href="/centers/Analytics/1" icon={<FaChartLine />} text="Analytics" />
              <NavItem href="/centers/outstandingPatients" icon={<FaAccessibleIcon  />} text="Outstanding Patients" />
              <NavItem href="/centers/complient" icon={<FaRegQuestionCircle />} text="Complients" />
            </ul>
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-4 border-t border-blue-700">
            <Link 
              href={`/centers/profile`}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <FaUserCircle className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium">{clinicData?.clinicName}</p>
                <p className="text-xs text-blue-200">Clinic Administrator</p>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-blue-200 hover:text-white p-2 mt-2 rounded-lg transition-colors w-full"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10 flex-shrink-0">
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
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700">Recent Appointments</p>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAllNotifications}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center"
                          title="Clear all notifications"
                        >
                          {/* <FaTrash className="mr-1" /> Clear All */}
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm text-blue-600 font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.time)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          No recent appointments
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          markNotificationsAsRead();
                          setNotificationsOpen(false);
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Link 
              href={`/centers/${getClinicId()}/dashboard`} 
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>
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