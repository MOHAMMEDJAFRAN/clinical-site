"use client";

import dynamic from "next/dynamic";
// import ProtectedRoute from "./components/ProtectedRoute";

// Dynamically import components to avoid hydration issues
const Navbar = dynamic(() => import("./components/Navbar"), { ssr: false });
const Header = dynamic(() => import("./components/Header"), { ssr: false });
const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default function Home() {
  return (
    // <ProtectedRoute>
      <main className="bg-image h-screen min-h-screen flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Navbar />
        <Header />
        <Footer />
      </main>
    // </ProtectedRoute>
  );
}
