import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Sync real VibeGen metrics from Supabase
export const syncMetrics = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      // Connect to VibeGen Supabase
      const SUPABASE_URL = process.env.SUPABASE_URL || "https://ooulthhcdqmqfakwtjyf.supabase.co";
      const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!SUPABASE_SERVICE_ROLE_KEY) {
        return { error: "Missing SUPABASE_SERVICE_ROLE_KEY" };
      }

      // Fetch user count
      const usersRes = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/count_users`,
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      ).catch(() => null);

      // Fetch subscription data
      const subscriptionsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/subscriptions?select=*`,
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      ).catch(() => null);

      // Parse responses
      let users = 0;
      let totalRevenue = 0;
      let activeSubscriptions = 0;

      if (usersRes?.ok) {
        const data = await usersRes.json();
        users = data?.count || 0;
      }

      if (subscriptionsRes?.ok) {
        const subs = await subscriptionsRes.json();
        activeSubscriptions = (subs || []).filter((s: any) => s.status === "active").length;
        // Calculate revenue from subscriptions (assuming KES prices)
        totalRevenue = (subs || [])
          .filter((s: any) => s.status === "active")
          .reduce((sum: number, s: any) => sum + (s.price || 0), 0);
      }

      // Log metrics as activity
      const timestamp = Date.now();
      const activityId = await ctx.db.insert("activities", {
        actionType: "analytics",
        description: `VibeGen metrics sync: ${users} users, ${activeSubscriptions} active subscriptions, ${totalRevenue.toLocaleString()} KES revenue`,
        status: "success",
        timestamp,
        metadata: {
          users,
          activeSubscriptions,
          totalRevenue,
          syncedAt: new Date(timestamp).toISOString(),
        },
      });

      // Also create a metrics table entry if you want historical tracking
      // This would require adding a "metrics" table to the schema
      return {
        success: true,
        users,
        activeSubscriptions,
        totalRevenue,
        timestamp,
        activityId,
      };
    } catch (error) {
      await ctx.db.insert("activities", {
        actionType: "analytics",
        description: `Failed to sync VibeGen metrics: ${error instanceof Error ? error.message : "Unknown error"}`,
        status: "error",
        timestamp: Date.now(),
        metadata: { error: error instanceof Error ? error.message : String(error) },
      });

      return { error: error instanceof Error ? error.message : "Sync failed" };
    }
  },
});

// Log outreach activity
export const logOutreach = mutation({
  args: {
    creatorHandle: v.string(),
    platform: v.string(),
    status: v.union(v.literal("sent"), v.literal("responded"), v.literal("converted"), v.literal("bounced")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusMap = {
      sent: "pending",
      responded: "info",
      converted: "success",
      bounced: "error",
    } as const;

    return await ctx.db.insert("activities", {
      actionType: "social",
      description: `Creator outreach (${args.platform}): @${args.creatorHandle} - ${args.status}${args.notes ? ` (${args.notes})` : ""}`,
      status: statusMap[args.status],
      timestamp: Date.now(),
      metadata: {
        creatorHandle: args.creatorHandle,
        platform: args.platform,
        outreachStatus: args.status,
        notes: args.notes,
      },
    });
  },
});

// Log social media action
export const logSocialAction = mutation({
  args: {
    action: v.string(), // "post", "schedule", "engaged", etc.
    platform: v.string(), // instagram, twitter, etc.
    description: v.string(),
    metrics: v.optional(v.object({
      likes: v.optional(v.number()),
      comments: v.optional(v.number()),
      shares: v.optional(v.number()),
      reach: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const metricsStr = args.metrics
      ? ` (${args.metrics.likes || 0} likes, ${args.metrics.comments || 0} comments, ${args.metrics.reach || 0} reach)`
      : "";

    return await ctx.db.insert("activities", {
      actionType: "social",
      description: `[${args.platform}] ${args.description}${metricsStr}`,
      status: "success",
      timestamp: Date.now(),
      metadata: {
        platform: args.platform,
        action: args.action,
        metrics: args.metrics,
      },
    });
  },
});

// Log deployment/technical action
export const logDeployment = mutation({
  args: {
    service: v.string(),
    action: v.string(),
    status: v.union(v.literal("success"), v.literal("error")),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      actionType: "deploy",
      description: `[${args.service}] ${args.action}${args.details ? ` - ${args.details}` : ""}`,
      status: args.status,
      timestamp: Date.now(),
      metadata: {
        service: args.service,
        action: args.action,
      },
    });
  },
});

// Get current metrics summary
export const getMetricsSummary = query({
  args: {},
  handler: async (ctx) => {
    // Get latest metrics activity
    const latestMetrics = await ctx.db
      .query("activities")
      .withIndex("by_actionType")
      .filter((q) => q.eq(q.field("actionType"), "analytics"))
      .order("desc")
      .first();

    if (!latestMetrics || !latestMetrics.metadata) {
      return {
        users: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        lastSync: null,
      };
    }

    return {
      users: (latestMetrics.metadata as any).users || 0,
      activeSubscriptions: (latestMetrics.metadata as any).activeSubscriptions || 0,
      totalRevenue: (latestMetrics.metadata as any).totalRevenue || 0,
      lastSync: latestMetrics.timestamp,
    };
  },
});
