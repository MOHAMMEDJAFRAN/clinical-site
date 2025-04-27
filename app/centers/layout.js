// app/centers/layout.js
import { FaHome, FaUserMd, FaUsers, FaSearch} from 'react-icons/fa';
import Link from 'next/link';

export default function centersLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Section */}
      <aside className="w-80 bg-white p-6 shadow-md">
        <div className="flex flex-col space-y-4">
          {/* Logo and Sidebar Title */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="text-2xl font-bold text-gray-800">ROYAL</div>
            <div className="text-lg text-gray-800">CLINIC</div>
          </div>

          {/* Main Navigation */}
          <div className="mt-8 space-y-8"> {/* Increased space between title and first nav item */}
            <h3 className="text-lg font-semibold text-black">MAIN NAVIGATION</h3>
            <ul className="space-y-6"> {/* Increased space between items */}
              <li>
                <Link href="/centers/dashboard" className="flex items-center text-black hover:text-blue-800 relative group">
                  <FaHome className="mr-2" />
                  Dashboard
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </li>
              <li>
                <Link href="/centers/doctor-availability/1" className="flex items-center text-black hover:text-blue-800 relative group">
                  <FaUserMd className="mr-2" />
                  Manage Doctor Availability
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </li>
              <li>
                <Link href="/centers/staff/1" className="flex items-center text-black hover:text-blue-800 relative group">
                  <FaUsers className="mr-2" />
                  Manage Staff
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </li>

              <li>
                <Link href="/centers/Analytics/1" className="flex items-center text-black hover:text-blue-800 relative group">
                  <FaSearch className="mr-2" />
                  Analytics
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </li>
              
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content Section */}
      <div className="flex-1 p-0.5">
        {children}
      </div>
    </div>
  );
}
