"use client";

import { useParams } from "next/navigation";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
import { useQuery } from "convex/react";
import PdfViewer from "../_components/PdfViewer";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

const WorkSpace = () => {
  const { id } = useParams();
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
    fileId: id,
  });
  useEffect(() => {
    console.log(fileInfo);
  }, [fileInfo]);
  return (
    <div>
      <WorkSpaceHeader />
      <div className="grid grid-cols-2 gap-5">
        <div></div>
        <div>
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
