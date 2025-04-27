'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiUser, FiChevronDown, FiLogOut, FiKey } from 'react-icons/fi';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: Clear auth token, redirect, etc.
    router.push('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button className="text-2xl text-gray-700 hover:text-gray-900 transition-colors">
            <FiMenu />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">ROYAL CLINIC</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <h2 className="text-lg font-light text-gray-500 hidden md:block">ROYAL CLINIC CENTER</h2>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <FiUser className="text-gray-600" />
              </div>
              <span className="font-medium text-gray-700 hidden sm:inline">User</span>
              <FiChevronDown className={`text-gray-500 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                <a 
                  href="/change-password" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiKey className="mr-2" />
                  Change Password
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiLogOut className="mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;