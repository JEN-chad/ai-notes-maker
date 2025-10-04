"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardPage = () => {
  const { user } = useUser();

  const filesList = useQuery(
    api.fileStorage.GetUserFiles,
    user ? { userEmail: user.primaryEmailAddress?.emailAddress } : undefined
  );

  console.log(filesList);

  return (
    <div className="px-5 py-7">
      <h1 className="font-medium text-2xl mb-6">Workspace</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filesList && filesList.length > 0
          ? filesList.map((file) => (
              <Link
                href={"/workspace/" + file.fileId}
                key={file.fileId} // Key must be on Link, not inner div
              >
                <div className="flex flex-col items-center text-center p-2 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out cursor-pointer bg-white">
                  <div className="relative w-14 h-14 mb-2">
                    <Image
                      src="/pdf.png"
                      alt="pdf file"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-sm font-medium truncate max-w-full">
                    {file?.fileName}
                  </h2>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div
                key={`skeleton-${item}`}
                className="flex flex-col items-center text-center p-2 border rounded-lg bg-slate-200 animate-pulse h-[90px]"
              >
                <div className="w-14 h-14 mb-2 bg-slate-300 rounded-md" />
                <div className="w-10 h-3 bg-slate-300 rounded-md" />
              </div>
            ))}
      </div>
    </div>
  );
};

export default DashboardPage;
