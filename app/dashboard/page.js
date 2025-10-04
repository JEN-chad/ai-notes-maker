"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Trash2 } from "lucide-react";

const DashboardPage = () => {
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

  // Mutation for deleting file (takes Convex _id)
  const deleteFile = useMutation(api.fileStorage.DeleteFile);

  const handleDelete = async (id) => {
    try {
      await deleteFile({ id }); // pass _id, not custom fileId
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  return (
    <div className="px-5 py-7">
      <h1 className="font-medium text-2xl mb-6">Workspace</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filesList && filesList.length > 0
          ? filesList.map((file) => (
              <div
                key={file._id}
                className="relative flex flex-col items-center text-center p-2 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out bg-white"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(file._id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-100 hover:bg-red-200"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>

                {/* Clickable file link */}
                <Link
                  href={"/workspace/" + file.fileId}
                  className="flex flex-col items-center w-full"
                >
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
                </Link>
              </div>
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
      {remaining === 0 && (
        <div className="absolute bottom-30  left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-md shadow-md">
          <p className="text-xl font-medium">Clear some files 😓 to upload</p>
        </div>
      )}
      {uploadedCount === 0 && (
        <div className="absolute bottom-30 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md">
          <p className="text-xl font-medium">
            Start to upload files 😎 to prepare notes.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
