"use client";

import {
  Search,
  ArrowUpDown,
  ListTodo,
  Clock,
  CheckCircle2,
} from "lucide-react";

type Props = {
  query: string;
  filterStatus: string;
  sortOption: string;
};

export default function FilterBar({ query, filterStatus, sortOption }: Props) {
  return (
    <div className="flex flex-col gap-4 bg-white p-2 rounded-2xl border-2 border-green-100 shadow-sm sticky top-20 z-10">
      {/* Hàng 1: Search + Sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          <form>
            <input
              name="q"
              defaultValue={query}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-4 py-2 bg-green-50/50 border border-green-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all text-slate-700 placeholder:text-green-300"
            />
            <input type="hidden" name="status" value={filterStatus} />
            <input type="hidden" name="sort" value={sortOption} />
          </form>
        </div>

        <form className="relative">
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="status" value={filterStatus} />
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-green-500" />
          <select
            name="sort"
            defaultValue={sortOption}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="pl-8 pr-3 py-2 h-full bg-white border border-green-100 rounded-xl text-sm text-slate-600 font-medium focus:outline-none focus:border-green-400 cursor-pointer hover:bg-green-50 transition-colors"
          >
            <option value="deadline">Hạn chót</option>
            <option value="created_desc">Mới nhất</option>
            <option value="created_asc">Cũ nhất</option>
          </select>
        </form>
      </div>

      {/* Hàng 2: Tabs Chuyển đổi */}
      <div className="bg-green-50 p-1.5 rounded-xl flex font-bold text-sm relative">
        {/* Tab Đang chờ */}
        <a
          href={`/?status=pending&q=${query}&sort=${sortOption}`}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300 ${
            filterStatus === "pending" || (filterStatus === "all" && false)
              ? "bg-white text-orange-500 shadow-sm"
              : "text-slate-400 hover:text-green-600"
          }`}
        >
          <Clock className="w-4 h-4" />
          Đang chờ
        </a>

        {/* Tab Đã xong */}
        <a
          href={`/?status=done&q=${query}&sort=${sortOption}`}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300 ${
            filterStatus === "done"
              ? "bg-white text-green-600 shadow-sm"
              : "text-slate-400 hover:text-green-600"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Đã xong
        </a>

        {/* Tab Tất cả */}
        <a
          href={`/?status=all&q=${query}&sort=${sortOption}`}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300 ${
            filterStatus === "all"
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-slate-400 hover:text-green-600"
          }`}
        >
          <ListTodo className="w-4 h-4" />
          Tất cả
        </a>
      </div>
    </div>
  );
}
