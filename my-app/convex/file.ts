import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createFile = mutation({
  args: {
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.insert("files", {
      name: args.name,
      content: args.content,
    });
  },
});


export const getFiles = query({
  args: {},
  handler: async (ctx) => {
     const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    return await ctx.db.query("files").collect();
  },
});
