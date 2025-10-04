import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";
import { Document } from "langchain/document";

// ✅ Corrected ingest using Document objects
export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    // Map each text chunk to a Document with proper metadata
    const documents = args.splitText.map(
      (text) =>
        new Document({
          pageContent: text,
          metadata: { fileId: args.fileId },
        })
    );

    await ConvexVectorStore.fromDocuments(
      documents,
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx } // pass Convex context
    );
  },
});

// ✅ Corrected search: filter by fileId
//! Plain Filtering
// export const search = action({
//   args: {
//     query: v.string(),
//     fileId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const vectorStore = new ConvexVectorStore(
//       new GoogleGenerativeAIEmbeddings({
//         apiKey: process.env.GOOGLE_GEMINI_API_KEY,
//         model: "text-embedding-004",
//         taskType: TaskType.RETRIEVAL_DOCUMENT,
//         title: "Document title",
//       }),
//       { ctx }
//     );

//     // Get top 50 most similar documents
//     const results = await vectorStore.similaritySearch(args.query, 50);

//     // Filter by fileId
//     const filtered = results.filter((doc) => doc.metadata.fileId === args.fileId);

//     // Convert Document to plain object before returning
//     if (filtered.length > 0) {
//       const topDoc = filtered[0];
//       return {
//         pageContent: topDoc.pageContent,
//         metadata: topDoc.metadata,
//       };
//     }

//     return null;
//   },
// });

//! Top results
export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    // 🔹 Get top 50 most similar documents
    const results = await vectorStore.similaritySearch(args.query, 50);

    // 🔹 Filter by fileId
    const filtered = results.filter(
      (doc) => doc.metadata.fileId === args.fileId
    );

    // 🔹 Take top 5 matches and convert to plain objects
    const topResults = filtered.slice(0, 5).map((doc) => ({
      pageContent: doc.pageContent,
      metadata: doc.metadata,
    }));

    return topResults; // array of plain objects
  },
});
