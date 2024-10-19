import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {

  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("Unauthorized");
  }


  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrganization(
  ctx: MutationCtx | QueryCtx,
  tokenIdentifier: string,
  organizationId: string
) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgId.includes(organizationId) ||
    user.tokenIdentifier.split("|")[1] === organizationId;
  if (!hasAccess) {
    throw new ConvexError("User not in organization");
  }

  return hasAccess;
}

export const createFile = mutation({
  args: {
    name: v.string(),
    organizationId: v.string(),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }


    const hasAccess = await hasAccessToOrganization(
      ctx,
      identity.tokenIdentifier,
      args.organizationId
    );

    if (!hasAccess) {
      throw new ConvexError("User not in organization");
    }

    await ctx.db.insert("files", {
      name: args.name,
      organizationId: args.organizationId,
      fileId: args.fileId,
    });
  },
});

export const getFiles = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrganization(
      ctx,
      identity.tokenIdentifier,
      args.organizationId
    );

    if (!hasAccess) {
      return [];
    }

    return await ctx.db
      .query("files")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  },
});
