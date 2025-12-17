import { UserButton, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { getTodos, createTodo } from "./actions";
import { Plus, Leaf } from "lucide-react";
import FilterBar from "./filter-bar";
import TodoItem from "./todo-item";
import OverviewStats from "./overview-stats";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;

  const query =
    typeof searchParams.q === "string" ? searchParams.q.toLowerCase() : "";
  const filterStatus =
    typeof searchParams.status === "string" ? searchParams.status : "pending";
  const sortOption =
    typeof searchParams.sort === "string" ? searchParams.sort : "deadline";

  let allTodos = await getTodos(sortOption);

  const searchedTodos = allTodos.filter((todo) =>
    todo.text.toLowerCase().includes(query)
  );

  const pendingTodos = searchedTodos.filter((t) => t.status === "pending");
  const completedTodos = searchedTodos.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-green-50/30 text-slate-800 font-sans selection:bg-green-200 flex flex-col">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* --- HEADER BAR (Đã cập nhật Slogan) --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-green-200">
              <Leaf className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 leading-none">
                DoNow
              </h1>
              <p className="text-[10px] font-bold text-green-600 tracking-wider mt-1 uppercase">
                Do it. Do it right. Do it right now!
              </p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6 flex-grow w-full">
        {/* Stats */}
        <OverviewStats todos={allTodos} />

        {/* Input */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border-2 border-green-50 focus-within:border-green-300 focus-within:ring-4 focus-within:ring-green-100 transition-all">
          <form action={createTodo} className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2">
              <Plus className="w-6 h-6 text-green-500 mr-3" />
              <input
                name="text"
                type="text"
                placeholder="Thêm tác vụ mới..."
                required
                className="w-full bg-transparent text-lg outline-none placeholder:text-slate-400 font-medium text-slate-700"
                autoComplete="off"
              />
            </div>
            <div className="flex gap-2 p-2">
              <input
                name="deadline"
                type="datetime-local"
                className="px-4 py-2 bg-green-50 border border-green-100 rounded-xl text-sm outline-none text-slate-600 font-medium hover:bg-green-100 cursor-pointer"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-green-200 active:scale-95"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>

        {/* Filter */}
        <FilterBar
          query={query}
          filterStatus={filterStatus}
          sortOption={sortOption}
        />

        {/* List */}
        <div className="space-y-8">
          {(filterStatus === "pending" || filterStatus === "all") && (
            <div>
              {filterStatus === "all" && (
                <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>Cần
                  làm ngay ({pendingTodos.length})
                </h3>
              )}
              <div className="grid gap-3">
                {pendingTodos.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-green-100 rounded-2xl">
                    <p className="text-slate-400 font-medium">
                      Tuyệt vời! Không còn việc gì phải làm.
                    </p>
                  </div>
                ) : (
                  pendingTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))
                )}
              </div>
            </div>
          )}

          {(filterStatus === "done" || filterStatus === "all") && (
            <div>
              {filterStatus === "all" && (
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Đã hoàn thành ({completedTodos.length})
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              )}
              <div className="grid gap-3">
                {completedTodos.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <p className="text-slate-400 text-sm">
                      Chưa có công việc nào hoàn thành.
                    </p>
                  </div>
                ) : (
                  completedTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER (Bản quyền) --- */}
      <footer className="py-6 text-center border-t border-green-100 bg-white/50 backdrop-blur-sm mt-auto">
        <p className="text-slate-500 text-sm font-semibold">
          © 2025 Tran Van Linh (WINDY). All rights reserved.
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Released: 12/2025 • DoNow App
        </p>
      </footer>
    </div>
  );
}
