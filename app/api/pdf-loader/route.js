import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl =
//   "https://hearty-emu-954.convex.cloud/api/storage/f8ce2f13-474a-4d1d-99c4-5599066373a3";

export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const pdfUrl = searchParams.get("pdfUrl");

    //1. Load The Pdf File
    const res = await fetch(pdfUrl);
    const blob = await res.blob();

    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();

    let pdfTextContent = "";
    docs.forEach((doc) => {
      pdfTextContent = pdfTextContent + doc.pageContent;
    });

    //2. split the content into small chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 20,
    });

    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];
    output.forEach((doc) => {
      splitterList.push(doc.pageContent);
    });

    return NextResponse.json({ splitterList });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}