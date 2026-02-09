"use client";

import { useState } from "react";
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";

export default function MetricsOverview() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Real-time metrics from VibeGen Supabase (will be synced when Convex dev is running)
  const [metrics] = useState({
    users: 35,
    activeSubscriptions: 3,
    totalRevenue: 5000,
    lastSync: Date.now() - 3600000, // 1 hour ago
  });

  const handleSync = async () => {
    setIsLoading(true);
    try {
      // This will call the Convex vibegen.syncMetrics function when available
      // For now, just simulate a sync
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  const revenueTarget = 600000; // 600K per month for 6M/year
  const revenueProgress = (metrics.totalRevenue / revenueTarget) * 100;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          <h2 className="text-lg font-semibold">VibeGen Metrics</h2>
        </div>
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Syncing..." : "Sync Data"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="glass-card p-4 space-y-2">
          <p className="text-xs text-[#71717a] uppercase tracking-wider">Total Users</p>
          <p className="text-3xl font-bold">{metrics.users.toLocaleString()}</p>
          <p className="text-[10px] text-[#52525b]">
            Target: 500+ paying by April
          </p>
        </div>

        {/* Active Subscriptions */}
        <div className="glass-card p-4 space-y-2">
          <p className="text-xs text-[#71717a] uppercase tracking-wider">Active Subscriptions</p>
          <p className="text-3xl font-bold">{metrics.activeSubscriptions}</p>
          <p className="text-[10px] text-[#52525b]">
            {metrics.activeSubscriptions > 0
              ? `${Math.round((metrics.activeSubscriptions / (metrics.users || 1)) * 100)}% conversion`
              : "0% conversion"}
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-card p-4 space-y-3">
          <p className="text-xs text-[#71717a] uppercase tracking-wider">Monthly Revenue (KES)</p>
          <p className="text-3xl font-bold">{metrics.totalRevenue.toLocaleString()}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#52525b]">Goal: 600K</span>
              <span className={`font-medium ${revenueProgress >= 100 ? "text-emerald-400" : "text-amber-400"}`}>
                {Math.round(revenueProgress)}%
              </span>
            </div>
            <div className="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  revenueProgress >= 100 ? "bg-emerald-500" : "bg-brand-500"
                }`}
                style={{ width: `${Math.min(revenueProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {metrics.lastSync && (
        <p className="text-[10px] text-[#52525b]">
          Last synced: {new Date(metrics.lastSync).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
