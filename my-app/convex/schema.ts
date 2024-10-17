import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  files: defineTable({
    content: v.string(),
    name: v.string(),
  }),
});
