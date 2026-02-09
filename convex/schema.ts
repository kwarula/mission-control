import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    actionType: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("success"),
      v.literal("error"),
      v.literal("pending"),
      v.literal("info")
    ),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_status", ["status"])
    .index("by_actionType", ["actionType"])
    .searchIndex("search_description", {
      searchField: "description",
      filterFields: ["actionType", "status"],
    }),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.number(),
    duration: v.optional(v.number()), // in minutes
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    category: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    color: v.optional(v.string()),
  })
    .index("by_scheduledAt", ["scheduledAt"])
    .index("by_status", ["status"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["status", "priority"],
    }),

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_type", ["type"])
    .index("by_createdAt", ["createdAt"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["type"],
    })
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["type"],
    }),

  memories: defineTable({
    content: v.string(),
    category: v.optional(v.string()),
    importance: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    createdAt: v.number(),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_category", ["category"])
    .index("by_importance", ["importance"])
    .index("by_createdAt", ["createdAt"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["category", "importance"],
    }),
});
