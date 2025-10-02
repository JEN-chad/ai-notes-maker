"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef } from "react";
import { Loader2Icon } from "lucide-react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const UploadPdfDialog = ({ children }) => {
  // Convex mutations
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.addFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embedDocument = useAction(api.myAction.ingest);

  // Local state
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false); // for controlling dialog open/close
  const fileInputRef = useRef(null); // ref to reset file input
  const { user } = useUser();

  // Handle file selection
  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload handler
  const onUpload = async () => {
    try {
      setIsLoading(true);

      // Step 1: Get a short-lived upload URL from Convex
      const postUrl = await generateUploadUrl();

      // Step 2: Upload file to storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });

      const { storageId } = await result.json();
      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId: storageId });

      // Step 3: Save file entry to DB
      await addFileEntry({
        fileId,
        storageId,
        fileName: fileName?.trim() || "Untitled",
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      const ApiResponse = await axios.get('api/pdf-loader?pdfUrl='+fileUrl);
      await embedDocument({
        splitText: ApiResponse.data.splitterList,
        fileId: fileId
      });
      // console.log(embedResult);
      // console.log(ApiResponse.data.splitterList);


      // ✅ Reset everything after successful upload
      setFile(null);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setOpen(false); // close the dialog
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button/element passed as children */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-sm md:max-w-md lg:max-w-lg w-full p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-2xl">
            Upload PDF File
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 flex flex-col gap-4">
              {/* File selection */}
              <div>
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
                  Select a file to upload
                </h2>
                <div className="mt-2 sm:mt-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onFileSelect}
                    className="w-full text-sm sm:text-base md:text-lg lg:text-lg p-2 border rounded-md"
                  />
                </div>
              </div>

              {/* File name input */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-600">
                  File Name:
                </label>
                <Input
                  placeholder="Enter file name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full text-gray-700 text-sm sm:text-base md:text-lg lg:text-lg"
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Footer with Cancel + Upload */}
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="text-sm sm:text-base md:text-lg lg:text-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpload}
            disabled={!file || isLoading}
            variant="default"
            className="flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-lg hover:text-white hover:bg-black"
          >
            {isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">upload_file</span>
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPdfDialog;
