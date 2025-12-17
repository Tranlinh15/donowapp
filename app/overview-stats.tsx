// app/overview-stats.tsx
"use client";

import { useState } from "react";
import { format, isSameDay, isSameWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, BarChart3 } from "lucide-react";

export default function OverviewStats({ todos }: { todos: any[] }) {
  // State quản lý chế độ xem: 'day' (Ngày) hoặc 'week' (Tuần)
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const now = new Date();

  // Logic tính toán số liệu
  const stats = todos.reduce(
    (acc, todo) => {
      let isMatch = false;
      const deadline = todo.deadline ? new Date(todo.deadline) : null;
      const finishedTime = todo.finishedTime
        ? new Date(todo.finishedTime)
        : todo.updatedAt
        ? new Date(todo.updatedAt)
        : null;

      if (viewMode === "day") {
        // Chế độ NGÀY:
        // - Pending: Deadline là hôm nay
        // - Done: Hoàn thành hôm nay
        if (todo.status === "pending" && deadline && isSameDay(deadline, now))
          isMatch = true;
        if (
          todo.status === "done" &&
          finishedTime &&
          isSameDay(finishedTime, now)
        )
          isMatch = true;
      } else {
        // Chế độ TUẦN:
        // - Pending: Deadline trong tuần này
        // - Done: Hoàn thành trong tuần này
        if (
          todo.status === "pending" &&
          deadline &&
          isSameWeek(deadline, now, { weekStartsOn: 1 })
        )
          isMatch = true;
        if (
          todo.status === "done" &&
          finishedTime &&
          isSameWeek(finishedTime, now, { weekStartsOn: 1 })
        )
          isMatch = true;
      }

      if (isMatch) {
        if (todo.status === "pending") acc.pending++;
        else acc.done++;
      }
      return acc;
    },
    { pending: 0, done: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CỘT 1: Bảng Thống Kê */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-green-200 md:col-span-2 relative overflow-hidden transition-all">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-100" />
              Tổng quan
            </h2>

            {/* Bộ chuyển đổi Ngày / Tuần */}
            <div className="bg-black/20 p-1 rounded-lg flex text-xs font-bold backdrop-blur-sm">
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === "day"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-green-100 hover:text-white"
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === "week"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-green-100 hover:text-white"
                }`}
              >
                Tuần này
              </button>
            </div>
          </div>

          {/* Hiển thị số liệu */}
          <div className="flex gap-8 mt-6 items-end">
            <div>
              <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-1">
                {viewMode === "day" ? "Đến hạn hôm nay" : "Đến hạn tuần này"}
              </p>
              <p className="text-5xl font-black">{stats.pending}</p>
            </div>
            <div className="w-px bg-white/20 h-12"></div>
            <div>
              <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-1">
                {viewMode === "day" ? "Xong hôm nay" : "Xong tuần này"}
              </p>
              <p className="text-5xl font-black">{stats.done}</p>
            </div>
          </div>
        </div>

        {/* Trang trí nền */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mt-8 -mr-8"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -mb-8 -ml-8"></div>
      </div>

      {/* CỘT 2: Ngày tháng (Giữ nguyên) */}
      <div className="bg-white rounded-2xl p-6 border-2 border-green-50 shadow-sm flex flex-col justify-center items-center text-center group hover:border-green-200 transition-colors">
        <div className="bg-green-50 p-3 rounded-full mb-3 group-hover:bg-green-100 transition-colors">
          <Calendar className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-4xl font-black text-slate-800">
          {format(new Date(), "dd")}
        </p>
        <p className="text-green-600 font-bold capitalize">
          {format(new Date(), "MMMM, yyyy", { locale: vi })}
        </p>
        <p className="text-slate-400 text-sm mt-1 capitalize">
          {format(new Date(), "EEEE", { locale: vi })}
        </p>
      </div>
    </div>
  );
}
