"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  X,
} from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  format,
  isSameDay,
  addDays,
  isToday,
} from "date-fns";
import { cn, getStatusColor, getPriorityColor } from "@/lib/utils";

const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

interface TaskFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  priority: "low" | "medium" | "high";
  category: string;
  color: string;
}

const defaultFormData: TaskFormData = {
  title: "",
  description: "",
  date: "",
  time: "09:00",
  duration: 60,
  priority: "medium",
  category: "task",
  color: "#4c6ef5",
};

const colorOptions = [
  "#4c6ef5",
  "#e64980",
  "#f76707",
  "#20c997",
  "#845ef7",
  "#fab005",
  "#15aabf",
  "#ff6b6b",
];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const tasks = useQuery(api.tasks.list, {
    startDate: weekStart.getTime(),
    endDate: weekEnd.getTime(),
  });

  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.date) return;
    const [year, month, day] = formData.date.split("-").map(Number);
    const [hour, minute] = formData.time.split(":").map(Number);
    const scheduledAt = new Date(year, month - 1, day, hour, minute).getTime();

    await createTask({
      title: formData.title,
      description: formData.description || undefined,
      scheduledAt,
      duration: formData.duration,
      status: "scheduled",
      priority: formData.priority,
      category: formData.category,
      color: formData.color,
    });

    setFormData(defaultFormData);
    setShowAddForm(false);
  };

  const getTasksForDay = (day: Date) => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      const taskDate = new Date(task.scheduledAt);
      return isSameDay(taskDate, day);
    });
  };

  const getTaskStyle = (task: { scheduledAt: number; duration?: number; color?: string }) => {
    const taskDate = new Date(task.scheduledAt);
    const hour = taskDate.getHours();
    const minute = taskDate.getMinutes();
    const duration = task.duration || 60;

    const top = ((hour - 7) * 60 + minute) * (64 / 60); // 64px per hour
    const height = Math.max(duration * (64 / 60), 24);

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: `${task.color || "#4c6ef5"}20`,
      borderLeft: `3px solid ${task.color || "#4c6ef5"}`,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Calendar className="w-6 h-6 text-brand-400" />
            Calendar
          </h1>
          <p className="text-sm text-[#71717a] mt-1">
            Weekly view of scheduled tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center glass-card">
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-2 hover:bg-[#27272a] rounded-l-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-xs font-medium hover:bg-[#27272a] transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-2 hover:bg-[#27272a] rounded-r-xl transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-medium text-[#a1a1aa] hidden sm:block">
            {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
          </span>
          <button
            onClick={() => {
              setFormData({
                ...defaultFormData,
                date: format(new Date(), "yyyy-MM-dd"),
              });
              setShowAddForm(!showAddForm);
            }}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Add Task
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="glass-card p-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">New Task</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded hover:bg-[#27272a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Task title"
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">
                Duration (min)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value) || 30,
                  })
                }
                min={15}
                step={15}
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as TaskFormData["priority"],
                  })
                }
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description"
                className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#3f3f46] rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1 block">Color</label>
              <div className="flex items-center gap-1.5 mt-1">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all",
                      formData.color === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#18181b] scale-110"
                        : "opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs rounded-lg hover:bg-[#27272a] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!formData.title.trim() || !formData.date}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="glass-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-[#27272a]">
          <div className="p-3 text-xs text-[#52525b] text-right pr-4">
            <Clock className="w-3 h-3 inline" />
          </div>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "p-3 text-center border-l border-[#27272a]",
                isToday(day) && "bg-brand-600/5"
              )}
            >
              <div className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-lg font-bold mt-0.5",
                  isToday(day) ? "text-brand-400" : "text-[#e4e4e7]"
                )}
              >
                {format(day, "d")}
              </div>
              {isToday(day) && (
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative overflow-x-auto">
          <div className="grid grid-cols-8 min-w-[800px]">
            {/* Time labels */}
            <div className="border-r border-[#27272a]">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 flex items-start justify-end pr-3 pt-0 border-b border-[#27272a]/50"
                >
                  <span className="text-[10px] text-[#52525b] -mt-2">
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((day) => {
              const dayTasks = getTasksForDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative border-l border-[#27272a]",
                    isToday(day) && "bg-brand-600/[0.02]"
                  )}
                >
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-[#27272a]/50"
                    />
                  ))}
                  {/* Tasks */}
                  {tasks !== undefined &&
                    dayTasks.map((task) => (
                      <div
                        key={task._id}
                        className={cn(
                          "absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer overflow-hidden group/task transition-all hover:z-10 hover:shadow-lg",
                          selectedTask === task._id && "ring-1 ring-white/30"
                        )}
                        style={getTaskStyle(task)}
                        onClick={() =>
                          setSelectedTask(
                            selectedTask === task._id ? null : task._id
                          )
                        }
                      >
                        <p className="text-[11px] font-medium truncate">
                          {task.title}
                        </p>
                        <p className="text-[9px] text-[#a1a1aa] truncate">
                          {format(new Date(task.scheduledAt), "h:mm a")}
                          {task.duration && ` · ${task.duration}m`}
                        </p>
                        {/* Hover actions */}
                        <div className="absolute top-0.5 right-0.5 opacity-0 group-hover/task:opacity-100 transition-opacity flex gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTask({
                                id: task._id,
                                status: "completed",
                              });
                            }}
                            className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] hover:bg-emerald-500/30"
                          >
                            ✓
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTask({ id: task._id });
                            }}
                            className="w-4 h-4 rounded bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] hover:bg-red-500/30"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task details panel */}
      {selectedTask && tasks && (
        <div className="glass-card p-4 animate-slide-up">
          {(() => {
            const task = tasks.find((t) => t._id === selectedTask);
            if (!task) return null;
            return (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{task.title}</h3>
                  {task.description && (
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-[#71717a]">
                      📅 {format(new Date(task.scheduledAt), "EEE, MMM d · h:mm a")}
                    </span>
                    {task.duration && (
                      <span className="text-xs text-[#71717a]">
                        ⏱ {task.duration}m
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        getPriorityColor(task.priority)
                      )}
                    >
                      ● {task.priority}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        getStatusColor(task.status)
                      )}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded hover:bg-[#27272a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
