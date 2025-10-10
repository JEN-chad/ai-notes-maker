import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const WorkSpaceHeader = ({ fileName }) => {
  return (
    <div className="relative flex items-center justify-between shadow-md p-4">
      {/* Left Logo — hidden on mobile */}
      <Link href={"/dashboard"} className="hidden sm:flex items-center gap-2 md:gap-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18"
        />
        <span className="text-black font-semibold text-xl sm:text-2xl md:text-3xl">
          SemSmart
        </span>
      </Link>

      {/* Centered File Name */}
      <h2 className="absolute left-1/2 -translate-x-1/2 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 text-center truncate max-w-[60%]">
        {fileName}
      </h2>

      {/* Right User Button */}
      <UserButton />
    </div>
  );
};

export default WorkSpaceHeader;
