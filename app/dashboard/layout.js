"use client";

import React, { useState } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { Menu, X } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div
        className={`fixed h-screen w-64 bg-white shadow-md z-40 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block`}
      >
        {/* Close button (only visible on mobile) */}
        <div className="flex items-center justify-end p-4 md:hidden">
          <button
            onClick={closeSidebar}
            className="p-2 rounded hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <Sidebar />
      </div>

      {/* Transparent click area (no dark background) */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 md:hidden cursor-pointer"
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 shadow-md bg-white">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Hamburger icon — visible only on mobile */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Right Section (Profile icon) */}
          <div className="ml-auto">
            <Header />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
