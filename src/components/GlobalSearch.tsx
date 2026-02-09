"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  FileText,
  Brain,
  CheckSquare,
  Activity,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  cn,
  formatTimestamp,
  getStatusColor,
  getStatusBg,
  getActionIcon,
  getPriorityColor,
} from "@/lib/utils";

type FilterType = "all" | "memory" | "document" | "task" | "activity";

const filterOptions: { value: FilterType; label: string; icon: typeof Search }[] = [
  { value: "all", label: "All", icon: Search },
  { value: "memory", label: "Memories", icon: Brain },
  { value: "document", label: "Documents", icon: FileText },
  { value: "task", label: "Tasks", icon: CheckSquare },
  { value: "activity", label: "Activities", icon: Activity },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const debouncedQuery = useDebounce(query, 200);

  const shouldSearch = debouncedQuery.trim().length > 0;

  const memoryResults = useQuery(
    api.memories.search,
    shouldSearch && (filter === "all" || filter === "memory")
      ? { query: debouncedQuery }
      : "skip"
  );

  const documentResults = useQuery(
    api.documents.search,
    shouldSearch && (filter === "all" || filter === "document")
      ? { query: debouncedQuery }
      : "skip"
  );

  const taskResults = useQuery(
    api.tasks.search,
    shouldSearch && (filter === "all" || filter === "task")
      ? { query: debouncedQuery }
      : "skip"
  );

  const activityResults = useQuery(
    api.activities.search,
    shouldSearch && (filter === "all" || filter === "activity")
      ? { query: debouncedQuery }
      : "skip"
  );

  const isLoading =
    shouldSearch &&
    ((filter === "all" || filter === "memory") && memoryResults === undefined) ||
    ((filter === "all" || filter === "document") && documentResults === undefined) ||
    ((filter === "all" || filter === "task") && taskResults === undefined) ||
    ((filter === "all" || filter === "activity") && activityResults === undefined);

  const allResults = useMemo(() => {
    const results: Array<{
      type: FilterType;
      id: string;
      title: string;
      description: string;
      timestamp: number;
      meta?: Record<string, string>;
    }> = [];

    if (memoryResults) {
      memoryResults.forEach((m) => {
        results.push({
          type: "memory",
          id: m._id,
          title: m.content.substring(0, 60) + (m.content.length > 60 ? "..." : ""),
          description: m.content,
          timestamp: m.createdAt,
          meta: {
            category: m.category || "general",
            importance: m.importance,
          },
        });
      });
    }

    if (documentResults) {
      documentResults.forEach((d) => {
        results.push({
          type: "document",
          id: d._id,
          title: d.title,
          description: d.content.substring(0, 120) + (d.content.length > 120 ? "..." : ""),
          timestamp: d.createdAt,
          meta: {
            docType: d.type,
            ...(d.tags ? { tags: d.tags.join(", ") } : {}),
          },
        });
      });
    }

    if (taskResults) {
      taskResults.forEach((t) => {
        results.push({
          type: "task",
          id: t._id,
          title: t.title,
          description: t.description || "No description",
          timestamp: t.scheduledAt,
          meta: {
            status: t.status,
            priority: t.priority,
            ...(t.category ? { category: t.category } : {}),
          },
        });
      });
    }

    if (activityResults) {
      activityResults.forEach((a) => {
        results.push({
          type: "activity",
          id: a._id,
          title: a.description.substring(0, 60) + (a.description.length > 60 ? "..." : ""),
          description: a.description,
          timestamp: a.timestamp,
          meta: {
            actionType: a.actionType,
            status: a.status,
          },
        });
      });
    }

    // Sort by timestamp, newest first
    results.sort((a, b) => b.timestamp - a.timestamp);
    return results;
  }, [memoryResults, documentResults, taskResults, activityResults]);

  const resultCounts = useMemo(() => ({
    all: allResults.length,
    memory: allResults.filter((r) => r.type === "memory").length,
    document: allResults.filter((r) => r.type === "document").length,
    task: allResults.filter((r) => r.type === "task").length,
    activity: allResults.filter((r) => r.type === "activity").length,
  }), [allResults]);

  const filteredResults =
    filter === "all" ? allResults : allResults.filter((r) => r.type === filter);

  const getTypeIcon = (type: FilterType) => {
    switch (type) {
      case "memory":
        return <Brain className="w-4 h-4 text-purple-400" />;
      case "document":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "task":
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case "activity":
        return <Activity className="w-4 h-4 text-amber-400" />;
      default:
        return <Search className="w-4 h-4 text-[#71717a]" />;
    }
  };

  const getTypeBadgeColor = (type: FilterType) => {
    switch (type) {
      case "memory":
        return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      case "document":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "task":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "activity":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      default:
        return "bg-gray-400/10 text-gray-400 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <Search className="w-6 h-6 text-brand-400" />
          Global Search
        </h1>
        <p className="text-sm text-[#71717a] mt-1">
          Search across memories, documents, tasks, and activities
        </p>
      </div>

      {/* Search Box */}
      <div className="glass-card p-1 glow-border">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525b]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything..."
            className="w-full pl-12 pr-12 py-4 text-base bg-transparent focus:outline-none placeholder:text-[#3f3f46]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[#27272a] transition-colors"
            >
              <X className="w-4 h-4 text-[#71717a]" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1.5",
              filter === opt.value
                ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                : "bg-[#27272a]/50 text-[#a1a1aa] hover:text-white border border-transparent"
            )}
          >
            <opt.icon className="w-3 h-3" />
            {opt.label}
            {shouldSearch && (
              <span className="text-[10px] opacity-60">
                ({resultCounts[opt.value]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {!shouldSearch ? (
          // Empty state
          <div className="glass-card p-16 text-center">
            <Search className="w-12 h-12 text-[#27272a] mx-auto mb-4" />
            <p className="text-[#71717a] text-sm font-medium">
              Start typing to search
            </p>
            <p className="text-[#52525b] text-xs mt-1">
              Search across memories, documents, tasks, and activities
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              {["memory", "document", "task", "activity"].map((type) => (
                <span
                  key={type}
                  className={cn(
                    "text-[10px] font-medium px-2.5 py-1 rounded-full border",
                    getTypeBadgeColor(type as FilterType)
                  )}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          // Loading
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#27272a]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#27272a] rounded w-2/3" />
                  <div className="h-3 bg-[#27272a] rounded w-full" />
                  <div className="h-3 bg-[#27272a] rounded w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : filteredResults.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Search className="w-10 h-10 text-[#3f3f46] mx-auto mb-3" />
            <p className="text-[#71717a] text-sm">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <p className="text-[#52525b] text-xs mt-1">
              Try different keywords or adjust filters
            </p>
          </div>
        ) : (
          filteredResults.map((result, index) => (
            <div
              key={result.id}
              className="glass-card-hover p-4 animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#27272a] flex items-center justify-center shrink-0">
                  {getTypeIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                            getTypeBadgeColor(result.type)
                          )}
                        >
                          {result.type}
                        </span>
                        {result.meta &&
                          Object.entries(result.meta).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-[10px] text-[#71717a] bg-[#27272a] px-2 py-0.5 rounded-full"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        <span className="text-[10px] text-[#52525b]">
                          {formatTimestamp(result.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      {shouldSearch && !isLoading && filteredResults.length > 0 && (
        <div className="glass-card p-3 flex items-center justify-between text-xs text-[#71717a]">
          <span>
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
          </span>
          <div className="flex items-center gap-3">
            {Object.entries(resultCounts)
              .filter(([key]) => key !== "all")
              .map(([key, count]) => (
                <span key={key} className="flex items-center gap-1">
                  {getTypeIcon(key as FilterType)}
                  <span>{count}</span>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple debounce hook
function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
