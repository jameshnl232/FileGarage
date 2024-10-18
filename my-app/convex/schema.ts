import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  files: defineTable({
    content: v.string(),
    name: v.string(),
    organizationId: v.optional(v.string()),
  }).index("by_organization", ["organizationId"]),


  users: defineTable({
    tokenIdentifier: v.string(),
    orgId: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

});

