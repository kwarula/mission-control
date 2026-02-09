import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    importance: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.category) {
      return await ctx.db
        .query("memories")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(limit);
    }

    if (args.importance) {
      return await ctx.db
        .query("memories")
        .withIndex("by_importance", (q) =>
          q.eq("importance", args.importance as "low" | "medium" | "high")
        )
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("memories")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    category: v.optional(v.string()),
    importance: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("memories") },
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
    return await ctx.db
      .query("memories")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.query)
      )
      .take(20);
  },
});
