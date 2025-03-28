"use client";

import { useState } from "react";
import Image from "next/image";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const [birthdate, setBirthdate] = useState("1990-01-01");
  const [gender, setGender] = useState("Male");
  const [userProfilePic, setUserProfilePic] = useState(null);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 py-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl p-6 md:p-10">
        <div className="flex flex-col items-center gap-6">
          {/* Profile Picture */}
          <div className="relative w-36 h-36">
            <Image
              src={userProfilePic || "/assets/profile_pic.png"}
              alt="Profile Picture"
              className="rounded-full object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-105"
              width={144}
              height={144}
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-gradient-to-r from-green-400 to-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600"
            >
              <i className="fas fa-edit"></i><img className="w-8 h-8" src="/assets/edit.png" alt="" />
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>

          {/* Profile Information */}
          <div className="w-full flex flex-col items-center md:items-start gap-6">
            <div className="w-full flex justify-between items-center">
              <label className="font-medium text-gray-700">Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-3 rounded-md w-3/4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              ) : (
                <p className="text-lg text-gray-800">{name}</p>
              )}
            </div>

            <div className="w-full flex justify-between items-center">
              <label className="font-medium text-gray-700">Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-3 rounded-md w-3/4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              ) : (
                <p className="text-lg text-gray-800">{email}</p>
              )}
            </div>

            <div className="w-full flex justify-between items-center">
              <label className="font-medium text-gray-700">Phone:</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 p-3 rounded-md w-3/4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              ) : (
                <p className="text-lg text-gray-800">{phone}</p>
              )}
            </div>

            <div className="w-full flex justify-between items-center">
              <label className="font-medium text-gray-700">Birthdate:</label>
              {isEditing ? (
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="border border-gray-300 p-3 rounded-md w-3/4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              ) : (
                <p className="text-lg text-gray-800">{birthdate}</p>
              )}
            </div>

            <div className="w-full flex justify-between items-center">
              <label className="font-medium text-gray-700">Gender:</label>
              {isEditing ? (
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border border-gray-300 p-3 rounded-md w-3/4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-lg text-gray-800">{gender}</p>
              )}
            </div>
          </div>

          {/* Edit/Save Button */}
          <div className="w-full flex justify-between items-center mt-6 gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-gradient-to-r text-sm lg:text-lg from-blue-500 to-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-gradient-to-l hover:from-blue-600 hover:to-green-600 transition-all"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r   from-green-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-gradient-to-l hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Edit Profile
              </button>
            )}

            {/* Change Password Button */}
            <button
              onClick={() => alert("Password change logic here")}
              className="bg-gradient-to-r text-sm lg:text-lg from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-gradient-to-l hover:from-yellow-500 hover:to-yellow-600 transition-all"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
