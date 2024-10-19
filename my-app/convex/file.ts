import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { FileType } from "./schema";

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
    type: FileType,
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
      type: args.type,
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

    const files = await ctx.db
      .query("files")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        ...(file.type === "image" || file.type === "pdf" || file.type === "csv"
          ? { url: await ctx.storage.getUrl(file.fileId) }
          : {}),
      }))
    );
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const file = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .first();

    if (!file) {
      throw new ConvexError("File not found");
    }

    const hasAccess = await hasAccessToOrganization(
      ctx,
      identity.tokenIdentifier,
      file.organizationId || ""
    );

    if (hasAccess) {
      return await ctx.db.delete(file._id);
    }
  },
});
