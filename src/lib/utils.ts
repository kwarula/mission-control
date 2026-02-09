import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "success":
    case "completed":
      return "text-emerald-400";
    case "error":
    case "cancelled":
      return "text-red-400";
    case "pending":
    case "in_progress":
      return "text-amber-400";
    case "info":
    case "scheduled":
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case "success":
    case "completed":
      return "bg-emerald-400/10 border-emerald-400/20";
    case "error":
    case "cancelled":
      return "bg-red-400/10 border-red-400/20";
    case "pending":
    case "in_progress":
      return "bg-amber-400/10 border-amber-400/20";
    case "info":
    case "scheduled":
      return "bg-blue-400/10 border-blue-400/20";
    default:
      return "bg-gray-400/10 border-gray-400/20";
  }
}

export function getActionIcon(actionType: string): string {
  switch (actionType) {
    case "deploy":
      return "🚀";
    case "social":
      return "📱";
    case "content":
      return "✍️";
    case "email":
      return "📧";
    case "analytics":
      return "📊";
    case "task":
      return "⚡";
    case "backup":
      return "💾";
    case "security":
      return "🔒";
    default:
      return "📌";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-amber-400";
    case "low":
      return "text-emerald-400";
    default:
      return "text-gray-400";
  }
}
