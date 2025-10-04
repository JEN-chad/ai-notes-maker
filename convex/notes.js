import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const AddNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if a 'notes' document already exists for the given fileId
    const existingNotes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    if (!existingNotes || existingNotes.length === 0) {
      // Insert a new one
      await ctx.db.insert("notes", {
        fileId: args.fileId,
        notes: args.notes,
        createdBy: args.createdBy,
      });
    } else {
      // Update the first matching note
      const note = existingNotes[0];
      await ctx.db.patch(note._id, {
        notes: args.notes,
      });
    }
  },
});

export const GetNotes = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    return result[0]?.notes;
  },
});
