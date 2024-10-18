import { internalMutation, QueryCtx, MutationCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getUser = async (ctx: QueryCtx | MutationCtx, tokenIdentifier: string) => {
  

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();


  if (!user) {
    throw new ConvexError("User not found");
  }

  return user;
};

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgId: [],
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
  },

  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);


    await ctx.db.patch(user._id, {
      orgId: [...user.orgId, args.orgId],
    });
  },
});
