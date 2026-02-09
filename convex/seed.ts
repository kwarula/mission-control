import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if data already exists
    const existing = await ctx.db.query("activities").first();
    if (existing) return "Data already seeded";

    // Seed activities
    const activities = [
      { actionType: "deploy", description: "Deployed VibeGen website v2.1 to production", status: "success" as const, timestamp: now - 3600000 },
      { actionType: "social", description: "Published Instagram post: Brand launch campaign", status: "success" as const, timestamp: now - 7200000 },
      { actionType: "content", description: "Generated 5 blog posts for content calendar", status: "success" as const, timestamp: now - 10800000 },
      { actionType: "email", description: "Sent weekly newsletter to 1,250 subscribers", status: "success" as const, timestamp: now - 14400000 },
      { actionType: "analytics", description: "Website traffic report: +32% growth this week", status: "info" as const, timestamp: now - 18000000 },
      { actionType: "deploy", description: "Dashboard build failed - missing env variables", status: "error" as const, timestamp: now - 21600000 },
      { actionType: "task", description: "Processing video renders for TikTok campaign", status: "pending" as const, timestamp: now - 25200000 },
      { actionType: "social", description: "Scheduled 14 tweets for next week", status: "success" as const, timestamp: now - 28800000 },
      { actionType: "backup", description: "Automated backup of all project files completed", status: "success" as const, timestamp: now - 32400000 },
      { actionType: "security", description: "Security scan completed - no vulnerabilities", status: "info" as const, timestamp: now - 36000000 },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    // Seed tasks for this week
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    const tasks = [
      { title: "Team standup", description: "Weekly sync with design team", scheduledAt: startOfWeek.getTime() + 9 * 3600000, duration: 30, status: "scheduled" as const, priority: "medium" as const, category: "meeting", color: "#4c6ef5" },
      { title: "Content review", description: "Review and approve blog drafts", scheduledAt: startOfWeek.getTime() + 14 * 3600000, duration: 60, status: "scheduled" as const, priority: "high" as const, category: "content", color: "#f76707" },
      { title: "Instagram campaign", description: "Launch new product showcase series", scheduledAt: startOfWeek.getTime() + 86400000 + 10 * 3600000, duration: 120, status: "in_progress" as const, priority: "high" as const, category: "social", color: "#e64980" },
      { title: "Analytics deep dive", description: "Q1 performance analysis", scheduledAt: startOfWeek.getTime() + 2 * 86400000 + 11 * 3600000, duration: 90, status: "scheduled" as const, priority: "medium" as const, category: "analytics", color: "#20c997" },
      { title: "SEO optimization", description: "Update meta tags and sitemap", scheduledAt: startOfWeek.getTime() + 2 * 86400000 + 15 * 3600000, duration: 60, status: "scheduled" as const, priority: "low" as const, category: "technical", color: "#845ef7" },
      { title: "Newsletter draft", description: "Write weekly newsletter edition #47", scheduledAt: startOfWeek.getTime() + 3 * 86400000 + 9 * 3600000, duration: 60, status: "scheduled" as const, priority: "high" as const, category: "content", color: "#f76707" },
      { title: "Deploy v2.2", description: "Ship new features to production", scheduledAt: startOfWeek.getTime() + 3 * 86400000 + 16 * 3600000, duration: 45, status: "scheduled" as const, priority: "high" as const, category: "technical", color: "#845ef7" },
      { title: "Social media audit", description: "Review all platform metrics", scheduledAt: startOfWeek.getTime() + 4 * 86400000 + 10 * 3600000, duration: 90, status: "scheduled" as const, priority: "medium" as const, category: "social", color: "#e64980" },
      { title: "Client presentation", description: "Present Q1 results to stakeholders", scheduledAt: startOfWeek.getTime() + 4 * 86400000 + 14 * 3600000, duration: 60, status: "scheduled" as const, priority: "high" as const, category: "meeting", color: "#4c6ef5" },
    ];

    for (const task of tasks) {
      await ctx.db.insert("tasks", task);
    }

    // Seed documents
    const documents = [
      { title: "Brand Guidelines v2", content: "VibeGen brand guidelines including color palette, typography, and voice standards. Primary colors: Electric Blue (#4c6ef5), Sunset Orange (#f76707). Typography: Inter for headings, system fonts for body.", type: "guideline", createdAt: now - 86400000, updatedAt: now - 86400000, tags: ["brand", "design"] },
      { title: "Content Strategy Q1 2026", content: "Quarterly content strategy focusing on Instagram Reels, blog SEO, and newsletter growth. Target: 5K newsletter subscribers by March. Post frequency: 3x/week Instagram, 2x/week blog.", type: "strategy", createdAt: now - 172800000, updatedAt: now - 86400000, tags: ["content", "strategy", "q1"] },
      { title: "API Documentation", content: "REST API endpoints for VibeGen platform. Authentication via Bearer tokens. Rate limit: 100 req/min. Endpoints: /api/content, /api/analytics, /api/campaigns.", type: "technical", createdAt: now - 259200000, updatedAt: now - 172800000, tags: ["api", "technical"] },
    ];

    for (const doc of documents) {
      await ctx.db.insert("documents", doc);
    }

    // Seed memories
    const memories = [
      { content: "VibeGen was officially launched as a creative agency in Nairobi, Kenya, focusing on digital marketing and content creation for Gen-Z brands.", category: "milestone", importance: "high" as const, createdAt: now - 604800000, tags: ["launch", "milestone"] },
      { content: "Instagram account @vibegenkenya created. Initial strategy: showcase local Kenyan creative talent with vibrant, high-energy visuals.", category: "social", importance: "medium" as const, createdAt: now - 432000000, tags: ["instagram", "social"] },
      { content: "First client meeting with a local fashion brand. They want a complete digital makeover — website, social media, and email campaigns.", category: "business", importance: "high" as const, createdAt: now - 259200000, tags: ["client", "business"] },
      { content: "Learned that shorter-form video content (15-30s) performs 3x better than long-form on our Instagram. Adjusting content strategy accordingly.", category: "insight", importance: "medium" as const, createdAt: now - 172800000, tags: ["insight", "content"] },
      { content: "Set up automated deployment pipeline with Vercel. All pushes to main branch auto-deploy within 2 minutes.", category: "technical", importance: "low" as const, createdAt: now - 86400000, tags: ["devops", "technical"] },
    ];

    for (const memory of memories) {
      await ctx.db.insert("memories", memory);
    }

    return "Seed data created successfully";
  },
});
