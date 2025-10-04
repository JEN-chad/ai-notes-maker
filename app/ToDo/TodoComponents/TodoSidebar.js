"use client";

import React from "react";
import Image from "next/image";
import { Layout, ListTodo } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

const TodoSidebar = () => {
  const { user } = useUser();

  // Fetch user files
  const filesList = useQuery(
    api.fileStorage.GetUserFiles,
    user ? { userEmail: user.primaryEmailAddress?.emailAddress } : undefined
  );

  const uploadedCount = filesList?.length || 0;
  const limit = 10;

  // prevent negative numbers
  const remaining = Math.max(limit - uploadedCount, 0);

  return (
    <div className="shadow-xl h-screen p-4 md:p-7 flex flex-col relative">
      {/* Logo + Name */}
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18"
        />
        <span className="text-black font-semibold text-xl sm:text-2xl md:text-3xl lg:text-3xl">
          SemSmart
        </span>
      </div>

      {/* Menu */}
      <div className="mt-14 md:mt-8 lg:mt-10">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 p-3 hover:cursor-pointer hover:bg-slate-100 rounded-lg lg:mt-7 md:mt-5 mt-4">
            <Layout className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
              Workspace
            </span>
          </div>
        </Link>

        <Link href="/ToDo">
          <div className="flex items-center gap-2 p-3 hover:cursor-pointer hover:bg-slate-100 rounded-lg lg:mt-5 md:mt-3 mt-2">
            <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
              ToDo
            </span>
          </div>
        </Link>
      </div>

      {/* Storage Indicator */}
      <div className="absolute bottom-24 w-[80%] flex flex-col gap-2 items-center">
        <Progress
          value={Math.min((uploadedCount / limit) * 100, 100)} // cap at 100%
          className="w-full h-3 rounded border border-gray-400 bg-transparent [&>div]:bg-gray-800"
        />
        <h1 className="md:text-xl text-sm">
          {remaining} out of {limit} Left
        </h1>
        <p className="lg:text-xl md:text-[17px] text-xs text-gray-400">
          {remaining === 0
            ? "Clear some files to upload more"
            : `uploaded PDF Files ${uploadedCount} `}
        </p>
      </div>
    </div>
  );
};

export default TodoSidebar;
