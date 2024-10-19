import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  files: defineTable({
    name: v.string(),
    organizationId: v.optional(v.string()),
    fileId: v.id("_storage"),
  }).index("by_organization", ["organizationId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgId: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
