import React from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-screen w-44 md:w-64 lg:w-72">
        <Sidebar />
      </div>

      {/* Main content */}
      
      <div
        className="flex-1 ml-44 md:ml-64 lg:ml-72 min-w-0"
        style={{ overflow: "auto" }}
      >
        <Header />
        <div>
          {children}
      </div>
      
      </div>
    </div>
  );
};

export default DashboardLayout;
