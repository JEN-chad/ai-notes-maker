import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

const PdfViewer = ({ fileUrl }) => {
  const [showToolbar, setShowToolbar] = useState(false);

  const toggleToolbar = () => {
    setShowToolbar((prev) => !prev);
  };

  return (
    <div className="relative w-full h-full">
      {/* Toggle Button */}
      <button
        onClick={toggleToolbar}
        className="absolute top-3 right-3 z-20 bg-black/70 text-white px-3 py-1 rounded-md text-xs sm:text-sm md:text-base hover:bg-black transition"
      >
        {showToolbar ? "Hide Toolbar" : "Show Toolbar"}
      </button>

      {/* PDF iframe */}
      {!fileUrl ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2Icon className="size-24 animate-spin text-gray-600" />
        </div>
      ) : (
        <iframe
          key={showToolbar ? "with-toolbar" : "without-toolbar"} // forces reload when toggled
          src={`${fileUrl}${showToolbar ? "#toolbar=1" : "#toolbar=0"}`}
          className="w-full h-full border-0"
          title="PDF Viewer"
        />
      )}
    </div>
  );
};

export default PdfViewer;
