"use client";

import { useParams } from "next/navigation";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
import { useQuery } from "convex/react";
import PdfViewer from "../_components/PdfViewer";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { TextEditor } from "../_components/TextEditor";

const WorkSpace = () => {
  const { id } = useParams();
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
    fileId: id,
  });

  useEffect(() => {
    console.log(fileInfo);
  }, [fileInfo]);

  return (
    <div className="p-4">
      <WorkSpaceHeader fileName={fileInfo?.fileName} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* Text Editor - Full width on mobile */}
        <div className="col-span-1 md:col-span-1 w-full">
          <TextEditor fileId={fileInfo?.fileId} />
        </div>

        {/* PDF Viewer - Hidden on mobile */}
        <div className="hidden md:block">
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
