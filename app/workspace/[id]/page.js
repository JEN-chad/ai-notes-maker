"use client";

import { useParams } from "next/navigation";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { TextEditor } from "../_components/TextEditor";

const PdfViewer = dynamic(() => import("../_components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[90vh] text-gray-500">
      Loading PDF...
    </div>
  ),
});

const WorkSpace = () => {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);

  // ✅ Fix hydration mismatch: only render after client mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const fileInfo = useQuery(api.fileStorage.GetFileRecord, { fileId: id });

  if (!mounted) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <WorkSpaceHeader fileName={fileInfo?.fileName || "Untitled"} />
      <div className="grid grid-cols-2 gap-5">
        <div>
          <TextEditor fileId={id} />
        </div>
        <div>
          {fileInfo ? (
            <PdfViewer fileUrl={fileInfo?.fileUrl} />
          ) : (
            <p className="text-center text-gray-500">Loading PDF...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
