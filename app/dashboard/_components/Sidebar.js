import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UploadPdfDialog from "./UploadPdfDialog";

const Sidebar = () => {
  return (
    <div className="shadow-xl h-screen p-4 md:p-7 flex flex-col">
      {/* Logo + Name */}
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

      {/* Upload button */}
      <div className="mt-14 md:mt-8 lg:mt-10">
        <UploadPdfDialog>
          <Button className="w-full text-sm sm:text-base md:text-lg hover:bg-black hover:text-white lg:text-xl">
            + Upload PDF
          </Button>
        </UploadPdfDialog>
        <div className="flex items-center gap-2 p-3 hover:cursor-pointer hover:bg-slate-100 rounded-lg lg:mt-7 md:mt-5 mt-4">
          <Layout className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
            Workspace
          </span>
        </div>
        <div className="flex items-center gap-2 p-3 hover:cursor-pointer hover:bg-slate-100 rounded-lg lg:mt-5 md:mt-3 mt-2">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
            Upgrade
          </span>
        </div>
      </div>
      <div className="absolute bottom-24 w-[80%] flex flex-col gap-2 items-center">
        <Progress
          value={33}
          className="w-full h-3 rounded border border-gray-400 bg-transparent [&>div]:bg-gray-800"
        />
        <h1 className="md:text-xl text-sm">2 out of 5 Left</h1>
        <p className="lg:text-xl md:text-[17px] text-xs text-gray-400">
          Upgrade to upload more
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
