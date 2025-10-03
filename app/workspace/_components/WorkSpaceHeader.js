import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";


const WorkSpaceHeader = () => {
  return (
    <div className="flex items-center justify-between shadow-md p-4">
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={50} // base size for mobile
          height={50}
          className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18"
        />
        <span className="text-black font-semibold text-xl sm:text-2xl md:text-3xl lg:text-3xl">
          SemSmart
        </span>
      </div>
      <UserButton />
      
    </div>
  );
};

export default WorkSpaceHeader;
