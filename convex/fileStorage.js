import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    storageId: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      storageId: args.storageId,
      createdBy: args.createdBy,
    });
    return "Inserted";
  },
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const GetFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    return result[0];
  },
});

export const GetUserFiles = query({
  args: {
    userEmail: v.optional(v.string()), // now optional
  },
  handler: async (ctx, args) => {
    if (!args?.userEmail) {
      return;
    }
    const result = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("createdBy"), args.userEmail))
      .collect();

    return result;
  },
});

// export const DeleteFile = mutation({
//   args: { id: v.id("pdfFiles") },   // ✅ expect Convex _id, not custom fileId
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//   },
// });


//! Working one old
// export const DeleteFile = mutation({
//   args: { id: v.id("pdfFiles") },
//   handler: async (ctx, args) => {
//     const file = await ctx.db.get(args.id);
//     if (!file) throw new Error("File not found");

//     // Delete related notes
//     const notes = await ctx.db
//       .query("notes")
//       .filter((q) => q.eq(q.field("fileId"), file.fileId))
//       .collect();
//     for (const note of notes) {
//       await ctx.db.delete(note._id);
//     }

//     // Delete related documents (look inside metadata.fileId)
//     const docs = await ctx.db
//       .query("documents")
//       .filter((q) => q.eq(q.field("metadata.fileId"), file.fileId))
//       .collect();
//     for (const doc of docs) {
//       await ctx.db.delete(doc._id);
//     }

//     // Delete the actual PDF from storage
//     await ctx.storage.delete(file.storageId);

//     // Finally delete the file record
//     await ctx.db.delete(args.id);

//     return { success: true };
//   },
// });

export const DeleteFile =  mutation({
  args: { id: v.id("pdfFiles"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) throw new Error("File not found");
    const fileId = file.fileId;
    const limit = args.limit ?? 25;

    // Delete a batch of related notes
    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), fileId))
      .take(limit);

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // Delete a batch of related documents
    const docs = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("metadata.fileId"), fileId))
      .take(limit);

    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }

    // If everything’s deleted, remove the file and its blob
    if (notes.length === 0 && docs.length === 0) {
      if (file.storageId) await ctx.storage.delete(file.storageId);
      await ctx.db.delete(args.id);
      return { done: true };
    }

    return { done: false };
  },
});