import { mutation } from "./_generated/server";

export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear all mock data to prepare for real data
    const activities = await ctx.db.query("activities").collect();
    const tasks = await ctx.db.query("tasks").collect();
    const documents = await ctx.db.query("documents").collect();
    const memories = await ctx.db.query("memories").collect();

    for (const item of [...activities, ...tasks, ...documents, ...memories]) {
      await ctx.db.delete(item._id);
    }

    return "All mock data cleared";
  },
});

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // This function no longer seeds mock data.
    // Use vibegen.syncMetrics to populate real data from VibeGen Supabase.
    return "Seed function disabled. Use vibegen.syncMetrics to sync real VibeGen data.";
  },
});
