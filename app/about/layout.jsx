"use client";
import React from "react";
import Navbar from "../components/Navbar";


const Layout = ({ children }) => {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>

      {/* Main Content */}
      <main className="flex-grow p-6 i">{children}</main>

    </div>
  );
};

export default Layout;
