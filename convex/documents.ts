import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.type) {
      return await ctx.db
        .query("documents")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("documents", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    
    const titleResults = await ctx.db
      .query("documents")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.query)
      )
      .take(10);

    const contentResults = await ctx.db
      .query("documents")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.query)
      )
      .take(10);

    // Deduplicate
    const seen = new Set(titleResults.map((r) => r._id));
    const unique = [
      ...titleResults,
      ...contentResults.filter((r) => !seen.has(r._id)),
    ];

    return unique.slice(0, 20);
  },
});
