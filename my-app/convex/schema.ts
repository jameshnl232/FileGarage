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
  }).index("by_organization", ["organizationId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgId: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
