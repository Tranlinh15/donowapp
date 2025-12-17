// app/todo-item.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  isToday,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";
import {
  Calendar,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  Pencil,
  X,
  Save,
  Clock,
} from "lucide-react";
import { toggleTodo, deleteTodo, updateTodo } from "./actions"; // Import updateTodo mới

// Logic tính thời gian
const getTimeStatus = (deadline: Date | null) => {
  if (!deadline) return null;
  const now = new Date();
  const diffInMinutes = differenceInMinutes(deadline, now);

  if (diffInMinutes < 0) {
    const absMinutes = Math.abs(diffInMinutes);
    if (absMinutes < 60)
      return { text: `Trễ ${absMinutes} phút`, isLate: true };
    const absHours = Math.floor(absMinutes / 60);
    if (absHours < 24) return { text: `Trễ ${absHours} giờ`, isLate: true };
    return {
      text: `Trễ ${differenceInDays(now, deadline)} ngày`,
      isLate: true,
    };
  } else {
    if (diffInMinutes < 60)
      return { text: `Còn ${diffInMinutes} phút`, isLate: false };
    const diffHours = Math.floor(diffInMinutes / 60);
    if (diffHours < 24) return { text: `Còn ${diffHours} giờ`, isLate: false };
    return {
      text: `Còn ${differenceInDays(deadline, now)} ngày`,
      isLate: false,
    };
  }
};

// Hàm helper để format date sang chuỗi cho input datetime-local (yyyy-MM-ddTHH:mm)
const formatDateForInput = (date: Date | null) => {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
};

export default function TodoItem({ todo }: { todo: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  // State mới lưu thời gian sửa
  const [editDeadline, setEditDeadline] = useState(
    formatDateForInput(todo.deadline)
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    // Chỉ lưu nếu có thay đổi
    const currentDeadlineStr = formatDateForInput(todo.deadline);
    if (editText.trim() !== todo.text || editDeadline !== currentDeadlineStr) {
      await updateTodo(todo.id, editText, editDeadline || null);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDeadline(formatDateForInput(todo.deadline));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  let timeStatus = null;
  if (todo.deadline && todo.status === "pending") {
    timeStatus = getTimeStatus(new Date(todo.deadline));
  }

  const cardColorClass =
    todo.status === "done"
      ? "bg-green-50/80 border-green-100 opacity-60 grayscale-[0.2]"
      : "bg-white border-green-100 hover:border-green-400 shadow-sm shadow-green-100/50";

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${cardColorClass}`}
    >
      {/* 1. Nút Checkbox */}
      <button
        onClick={() => toggleTodo(todo.id, todo.status)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          todo.status === "done"
            ? "bg-green-600 border-green-600 text-white"
            : "border-slate-300 hover:border-green-500 text-transparent"
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
      </button>

      {/* 2. Nội dung chính (Hiển thị hoặc Input Sửa) */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            {/* Input Tên */}
            <input
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tên công việc..."
              className="flex-1 bg-white border-2 border-green-400 rounded-lg px-3 py-1.5 text-slate-800 outline-none focus:ring-2 focus:ring-green-200 text-sm font-medium"
            />

            {/* Input Thời gian */}
            <div className="relative">
              <input
                type="datetime-local"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full sm:w-auto bg-green-50 border-2 border-green-200 rounded-lg pl-2 pr-2 py-1.5 text-slate-600 outline-none focus:border-green-400 text-sm cursor-pointer"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-1">
              <button
                onMouseDown={handleSave}
                className="p-1.5 text-green-600 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onMouseDown={handleCancel}
                className="p-1.5 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              onDoubleClick={() => setIsEditing(true)}
              className={`font-semibold text-base truncate cursor-pointer ${
                todo.status === "done"
                  ? "line-through text-slate-400"
                  : "text-slate-800"
              }`}
            >
              {todo.text}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {todo.deadline && (
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(todo.deadline), "dd/MM HH:mm")}
                </div>
              )}
              {timeStatus && (
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    timeStatus.isLate
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {timeStatus.isLate ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <Hourglass className="w-3 h-3" />
                  )}
                  {timeStatus.text}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 3. Các nút hành động */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && todo.status !== "done" && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Sửa nội dung & deadline"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => deleteTodo(todo.id)}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Xóa công việc"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
