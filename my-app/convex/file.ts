import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { FileType } from "./schema";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("Unauthorized");
  }

  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrganization(
  ctx: MutationCtx | QueryCtx,
  organizationId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await getUser(ctx, identity.tokenIdentifier);

  const hasAccess =
    user.orgId.includes(organizationId) ||
    user.tokenIdentifier.split("|")[1] === organizationId;

  if (!hasAccess) {
    throw new ConvexError("User not in organization");
  }

  return user;
}

const hasAccessToFile = async (
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) => {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const user = await hasAccessToOrganization(ctx, file.organizationId || "");

  if (!user) {
    return null;
  }

  return { file, user };
};

export const createFile = mutation({
  args: {
    name: v.string(),
    organizationId: v.string(),
    fileId: v.id("_storage"),
    type: FileType,
  },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToOrganization(ctx, args.organizationId);

    if (hasAccess) {
      await ctx.db.insert("files", {
        name: args.name,
        organizationId: args.organizationId,
        fileId: args.fileId,
        type: args.type,
      });
    } else {
      throw new ConvexError("User not in organization");
    }
  },
});

export const getFiles = query({
  args: {
    organizationId: v.string(),
    query: v.optional(v.string()),
    favorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await hasAccessToOrganization(ctx, args.organizationId);

    if (!user) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    const query = args.query || "";

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_organizationId_fileId", (q) =>
        q.eq("userId", user._id).eq("organizationId", args.organizationId)
      )
      .collect();

    if (args.favorite) {
      files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      );
    }

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
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToFile(ctx, args.fileId);

    if (hasAccess) {
      return await ctx.db.delete(args.fileId);
    } else {
      throw new ConvexError("No access to file");
    }
  },
});

export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToFile(ctx, args.fileId);
    if (!hasAccess) {
      throw new ConvexError("no access to file");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_organizationId_fileId", (q) =>
        q
          .eq("userId", hasAccess.user._id)
          .eq("organizationId", hasAccess.file.organizationId)
          .eq("fileId", args.fileId)
      )

      .first();

    if (favorite) {
      return await ctx.db.delete(favorite._id);
    } else {
      return await ctx.db.insert("favorites", {
        userId: hasAccess.user._id,
        fileId: args.fileId,
        organizationId: hasAccess.file.organizationId,
      });
    }
  },
});

export const getAllFavorites = query({
  args: { organizationId: v.string() },
  async handler(ctx, args) {
    const user = await hasAccessToOrganization(ctx, args.organizationId);

    if (!user) {
      return [];
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_organizationId_fileId", (q) =>
        q.eq("userId", user._id).eq("organizationId", args.organizationId)
      )
      .collect();

    return favorites;
  },
});
