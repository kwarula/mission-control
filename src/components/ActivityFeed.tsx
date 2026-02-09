"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
  Activity,
  Plus,
  Trash2,
  Filter,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  cn,
  formatTimestamp,
  formatTime,
  getStatusColor,
  getStatusBg,
  getActionIcon,
} from "@/lib/utils";

const statusFilters = [
  { value: "", label: "All" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
  { value: "pending", label: "Pending" },
  { value: "info", label: "Info" },
];

const actionTypes = [
  "deploy",
  "social",
  "content",
  "email",
  "analytics",
  "task",
  "backup",
  "security",
];

const statusOptions = ["success", "error", "pending", "info"] as const;

export default function ActivityFeed() {
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAction, setNewAction] = useState({
    actionType: "task",
    description: "",
    status: "success" as "success" | "error" | "pending" | "info",
  });

  const activities = useQuery(api.activities.list, {
    limit: 50,
    ...(statusFilter ? { status: statusFilter } : {}),
  });
  const createActivity = useMutation(api.activities.create);
  const removeActivity = useMutation(api.activities.remove);
  const seedData = useMutation(api.seed.seedData);

  const handleCreate = async () => {
    if (!newAction.description.trim()) return;
    await createActivity(newAction);
    setNewAction({ actionType: "task", description: "", status: "success" });
    setShowAddForm(false);
  };

  const handleSeed = async () => {
    await seedData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="w-6 h-6 text-brand-400" />
            Activity Feed
          </h1>
          <p className="text-sm text-[#71717a] mt-1">
            Real-time log of all VibeGen actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeed}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-[#27272a] hover:bg-[#3f3f46] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Seed Data
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Log Action
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="glass-card p-4 space-y-3 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <label className="text-xs text-[#71717a] mb-1 block">Type</label>
              <select
                value={newAction.actionType}
                onChange={(e) =>
                  setNewAction({ ...newAction, actionType: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
              >
                {actionTypes.map((type) => (
                  <option key={type} value={type}>
                    {getActionIcon(type)} {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-8 w-3 h-3 text-[#71717a] pointer-events-none" />
            </div>
            <div className="relative">
              <label className="text-xs text-[#71717a] mb-1 block">Status</label>
              <select
                value={newAction.status}
                onChange={(e) =>
                  setNewAction({
                    ...newAction,
                    status: e.target.value as typeof newAction.status,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-8 w-3 h-3 text-[#71717a] pointer-events-none" />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">
                Description
              </label>
              <input
                type="text"
                value={newAction.description}
                onChange={(e) =>
                  setNewAction({ ...newAction, description: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="What happened?"
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-[#52525b]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs rounded-lg hover:bg-[#27272a] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newAction.description.trim()}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Activity
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap",
              statusFilter === filter.value
                ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                : "bg-[#27272a]/50 text-[#a1a1aa] hover:text-white border border-transparent"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {activities === undefined ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#27272a]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#27272a] rounded w-3/4" />
                  <div className="h-3 bg-[#27272a] rounded w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Activity className="w-10 h-10 text-[#3f3f46] mx-auto mb-3" />
            <p className="text-[#71717a] text-sm">No activities yet</p>
            <p className="text-[#52525b] text-xs mt-1">
              Log an action or seed sample data to get started
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity._id}
              className="glass-card-hover p-4 group animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-[#27272a] flex items-center justify-center text-base shrink-0">
                  {getActionIcon(activity.actionType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#71717a]">
                          {activity.actionType}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                            getStatusBg(activity.status)
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block w-1.5 h-1.5 rounded-full mr-1",
                              activity.status === "success" && "bg-emerald-400",
                              activity.status === "error" && "bg-red-400",
                              activity.status === "pending" &&
                                "bg-amber-400 animate-pulse",
                              activity.status === "info" && "bg-blue-400"
                            )}
                          />
                          {activity.status}
                        </span>
                        <span className="text-[10px] text-[#52525b]">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-[#52525b] hidden sm:block">
                        {formatTime(activity.timestamp)}
                      </span>
                      <button
                        onClick={() => removeActivity({ id: activity._id })}
                        className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats bar */}
      {activities && activities.length > 0 && (
        <div className="glass-card p-3 flex items-center justify-between text-xs text-[#71717a]">
          <span>{activities.length} activities shown</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="status-dot-success" />
              {activities.filter((a) => a.status === "success").length} success
            </span>
            <span className="flex items-center gap-1.5">
              <span className="status-dot-error" />
              {activities.filter((a) => a.status === "error").length} errors
            </span>
            <span className="flex items-center gap-1.5">
              <span className="status-dot-pending" />
              {activities.filter((a) => a.status === "pending").length} pending
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
