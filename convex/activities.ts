import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.status) {
      return await ctx.db
        .query("activities")
        .withIndex("by_timestamp")
        .order("desc")
        .filter((q) => q.eq(q.field("status"), args.status))
        .take(limit);
    }

    return await ctx.db
      .query("activities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    actionType: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("success"),
      v.literal("error"),
      v.literal("pending"),
      v.literal("info")
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("activities") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    for (const activity of activities) {
      await ctx.db.delete(activity._id);
    }
  },
});

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    return await ctx.db
      .query("activities")
      .withSearchIndex("search_description", (q) =>
        q.search("description", args.query)
      )
      .take(20);
  },
});
