import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const FileType = v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"));

export default defineSchema({
  // Other tables here...

  files: defineTable({
    name: v.string(),
    organizationId: v.optional(v.string()),
    fileId: v.id("_storage"),
    type: FileType,
    userId: v.id("users"),

    shouldDelete: v.optional(v.boolean()),
  }).index("by_organization", ["organizationId"])
  .index("by_shouldDelete", ["shouldDelete"]),

  favorites: defineTable({
    userId: v.id("users"),
    fileId: v.id("files"),
    organizationId: v.optional(v.string()),
  }).index("by_userId_organizationId_fileId", ["userId", "organizationId", "fileId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgId: v.array(v.object({
      id: v.string(),
      role: v.union(v.literal("admin"), v.literal("member")),
    })),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
