import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

//? Define your schema using the `defineSchema` and `defineTable` functions

export default defineSchema({
    users:defineTable({
        userName: v.string(),
        email: v.string(),
        imageUrl: v.string()
    }),
    pdfFiles:defineTable({
        fileId: v.string(),
        fileName: v.string(),
        storageId: v.string(),
        fileUrl: v.string(),
        createdBy: v.string()
    })
})