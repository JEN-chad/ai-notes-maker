"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

const DashboardPage = () => {
  const { user } = useUser();

  // Fetch user files
  const filesList = useQuery(
    api.fileStorage.GetUserFiles,
    user ? { userEmail: user.primaryEmailAddress?.emailAddress } : undefined
  );

  const uploadedCount = filesList?.length || 0;
  const limit = 10;
  const remaining = Math.max(limit - uploadedCount, 0);

  // Use the new batch deletion mutation
  const deleteBatch = useMutation(api.fileStorage.DeleteFile);

  // Track which file is being deleted
  const [deletingId, setDeletingId] = useState(null);

  // 🔹 Handles safe deletion with client-driven batching
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      let done = false;
      while (!done) {
        const res = await deleteBatch({ id });
        done = res.done;
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="px-4 sm:px-5 py-6 sm:py-7 w-full">
      {/* Title */}
      <h1 className="font-medium text-xl sm:text-2xl mb-6 text-center sm:text-left">
        Workspace
      </h1>

      {/* File Grid */}
      <div
        className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          xl:grid-cols-6
          gap-4 sm:gap-6
          w-full
        "
      >
        {filesList && filesList.length > 0
          ? filesList.map((file) => (
              <div
                key={file._id}
                className="
                  relative 
                  flex 
                  flex-col 
                  items-center 
                  text-center 
                  p-3 sm:p-2 
                  border 
                  rounded-lg 
                  shadow-sm 
                  hover:shadow-md 
                  transition 
                  duration-200 
                  ease-in-out 
                  bg-white 
                  w-full 
                  min-h-[100px]
                "
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(file._id)}
                  disabled={deletingId === file._id}
                  className={`absolute top-2 right-2 p-1 rounded-full ${
                    deletingId === file._id
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-red-100 hover:bg-red-200"
                  }`}
                >
                  {deletingId === file._id ? (
                    <Loader2 size={16} className="animate-spin text-gray-500" />
                  ) : (
                    <Trash2 size={16} className="text-red-600" />
                  )}
                </button>

                {/* File link */}
                <Link
                  href={"/workspace/" + file.fileId}
                  className="flex flex-col items-center w-full"
                >
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 mb-2">
                    <Image
                      src="/pdf.png"
                      alt="pdf file"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-full">
                    {file?.fileName}
                  </h2>
                </Link>
              </div>
            ))
          : // Skeleton loading placeholders
            [1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div
                key={`skeleton-${item}`}
                className="
                  flex 
                  flex-col 
                  items-center 
                  text-center 
                  p-3 
                  border 
                  rounded-lg 
                  bg-slate-200 
                  animate-pulse 
                  h-[90px] 
                  w-full
                "
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 mb-2 bg-slate-300 rounded-md" />
                <div className="w-10 h-3 bg-slate-300 rounded-md" />
              </div>
            ))}
      </div>

      {/* File upload limit messages */}
      {remaining === 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-3 sm:px-4 py-2 rounded-md shadow-md text-center">
          <p className="text-base sm:text-lg font-medium">
            Clear some files 😓 to upload
          </p>
        </div>
      )}

      {uploadedCount === 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-md shadow-md text-center">
          <p className="text-base sm:text-lg font-medium">
            Start to upload files 😎 to prepare notes.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
