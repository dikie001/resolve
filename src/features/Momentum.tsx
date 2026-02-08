import { AddTodoDialog } from "@/components/app/AddTodoDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, Todo, TodoCategory } from "@/types";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Filter,
  Plus,
  Search,
  Target,
  Trash2,
  X,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FilterStatus = "all" | "active" | "completed";
type SortOption = "newest" | "oldest" | "priority-high" | "priority-low" | "category";

const CATEGORY_COLORS: Record<TodoCategory, string> = {
  Work: "bg-blue-100 text-blue-700 border-blue-200",
  Personal: "bg-purple-100 text-purple-700 border-purple-200",
  Health: "bg-green-100 text-green-700 border-green-200",
  Learning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Shopping: "bg-pink-100 text-pink-700 border-pink-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

const CATEGORY_COLORS_DARK: Record<TodoCategory, string> = {
  Work: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Personal: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Health: "bg-green-500/10 text-green-400 border-green-500/30",
  Learning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Shopping: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export function Momentum({
  todos,
  setTodos,
  isDarkTheme = false,
}: {
  todos: Todo[];
  setTodos: (t: Todo[]) => void;
  isDarkTheme?: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCategory, setFilterCategory] = useState<TodoCategory | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const handleAddTodo = (title: string, description: string, priority: Priority, category: TodoCategory) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: title,
      description: description.trim() || undefined,
      category,
      completed: false,
      priority,
      dueDate: null,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    toast.success("Task Created", {
      description: `Added to ${category}`,
      style: { background: "#2563eb", color: "#fff" },
    });
  };

  const toggleTodo = (id: string) =>
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    toast.success("Task deleted");
  };

  const deleteCompleted = () => {
    const completed = todos.filter((t) => t.completed).length;
    setTodos(todos.filter((t) => !t.completed));
    toast.success(`Deleted ${completed} completed task${completed !== 1 ? 's' : ''}`);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedTodos);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTodos(newExpanded);
  };

  // Filtering and sorting logic
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.text.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query)
      );
    }

    if (filterStatus === "active") {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((t) => t.completed);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "priority-high":
        sorted.sort((a, b) => {
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      case "priority-low":
        sorted.sort((a, b) => {
          const priorityOrder = { High: 2, Medium: 1, Low: 0 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      case "category":
        sorted.sort((a, b) => (a.category || "Other").localeCompare(b.category || "Other"));
        break;
    }

    return sorted;
  }, [todos, searchQuery, filterStatus, filterCategory, filterPriority, sortBy]);

  const progress = todos.length
    ? Math.round(
      (todos.filter((t) => t.completed).length / todos.length) * 100
    )
    : 0;

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const hasActiveFilters = filterStatus !== "all" || filterCategory !== "all" || filterPriority !== "all" || searchQuery.trim() !== "";

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Velocity Stats Section - Compact Mobile */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-linear-to-br -mt-10 md:-mt-4 from-blue-600 via-blue-700 to-indigo-900 border-none text-white rounded-2xl md:rounded-[2rem] shadow-xl md:shadow-2xl shadow-blue-900/20 overflow-hidden relative group">
          <CardContent className="p-2 md:p-4 px-8 md:px-12 relative z-10">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="space-y-1 md:space-y-2 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 bg-white/10 rounded-md">
                      <Zap className="w-3 h-3 md:w-4 md:h-4 text-blue-200" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-blue-100/70">
                      Velocity
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">
                    {progress}%
                  </h2>
                </div>
                <div className="relative h-14 w-14 md:h-24 md:w-24 shrink-0">
                  <Target className="w-14 h-14 md:w-24 md:h-24 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full border-t-white/40 animate-spin-slow" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between md:justify-start gap-2 md:gap-6 pt-3 md:pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/40"></div>
                  <span className="text-xs md:text-sm font-medium text-blue-100/80">{stats.total} Total</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs md:text-sm font-medium text-blue-100/80">{stats.completed} Done</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-400"></div>
                  <span className="text-xs md:text-sm font-medium text-blue-100/80">{stats.active} Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-2 md:space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`h-10 md:h-12 pl-9 md:pl-12 border-none rounded-lg md:rounded-xl text-sm ${isDarkTheme ? "bg-zinc-900 text-white placeholder:text-zinc-600" : "bg-white text-zinc-900 shadow-sm"}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkTheme ? "text-zinc-600 hover:text-zinc-400" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`h-10 md:h-12 px-3 md:px-4 rounded-lg md:rounded-xl ${isDarkTheme ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white shadow-sm"} ${hasActiveFilters ? "ring-2 ring-blue-500" : ""}`}
          >
            <Filter className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Filters</span>
            {hasActiveFilters && (
              <span className="ml-1.5 md:ml-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
            )}
          </Button>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className={`p-3 md:p-5 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200 ${isDarkTheme ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-zinc-200 shadow-sm"}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Status</label>
                <Select value={filterStatus} onValueChange={(v: FilterStatus) => setFilterStatus(v)}>
                  <SelectTrigger className={`h-9 md:h-11 text-xs md:text-sm border rounded-lg ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Category</label>
                <Select value={filterCategory} onValueChange={(v: TodoCategory | "all") => setFilterCategory(v)}>
                  <SelectTrigger className={`h-9 md:h-11 text-xs md:text-sm border rounded-lg ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {Object.keys(CATEGORY_COLORS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Priority</label>
                <Select value={filterPriority} onValueChange={(v: Priority | "all") => setFilterPriority(v)}>
                  <SelectTrigger className={`h-9 md:h-11 text-xs md:text-sm border rounded-lg ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Sort</label>
                <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
                  <SelectTrigger className={`h-9 md:h-11 text-xs md:text-sm border rounded-lg ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="priority-high">High Priority</SelectItem>
                    <SelectItem value="priority-low">Low Priority</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`flex justify-between items-center pt-2 md:pt-3 border-t ${isDarkTheme ? "border-zinc-800" : "border-zinc-200"}`}>
              <Button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterCategory("all");
                  setFilterPriority("all");
                  setSearchQuery("");
                }}
                variant="ghost"
                size="sm"
                disabled={!hasActiveFilters}
                className="text-xs h-8 px-2"
              >
                Clear Filters
              </Button>
              {stats.completed > 0 && (
                <Button
                  onClick={deleteCompleted}
                  variant="outline"
                  size="sm"
                  className={`text-xs h-8 px-2 border ${isDarkTheme ? "text-red-400 border-red-500/30" : "text-red-600 border-red-200"}`}
                >
                  Clear Done
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Todo List */}
      <div className="space-y-2 md:space-y-3">
        {filteredAndSortedTodos.length === 0 ? (
          <div className={`text-center py-12 md:py-20 border-2 border-dashed rounded-2xl md:rounded-[2.5rem] transition-colors ${isDarkTheme ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
            <Zap className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 ${isDarkTheme ? "text-zinc-700" : "text-zinc-200"}`} />
            <h3 className={`text-sm md:text-lg font-bold uppercase tracking-widest mb-1 ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`}>
              {hasActiveFilters ? "No Tasks" : "Empty"}
            </h3>
            <p className={`text-xs md:text-sm ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`}>
              {hasActiveFilters ? "Adjust filters" : "Create a task"}
            </p>
          </div>
        ) : (
          filteredAndSortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group transition-all duration-300 rounded-xl md:rounded-3xl border ${todo.completed
                ? isDarkTheme
                  ? "bg-zinc-900/50 border-zinc-800 opacity-60"
                  : "bg-zinc-50/50 border-zinc-100 opacity-60"
                : isDarkTheme
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-zinc-200 shadow-sm"
                }`}
            >
              <div className="flex items-start justify-between p-3 md:p-5 gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-0.5 md:mt-1 transition-all shrink-0 ${todo.completed ? "text-blue-600" : "text-zinc-300 hover:text-blue-400"
                      }`}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 fill-blue-50" />
                    ) : (
                      <Circle className="w-5 h-5 md:w-8 md:h-8 stroke-[1.5px]" />
                    )}
                  </button>

                  <div className="space-y-1 md:space-y-2 flex-1 min-w-0">
                    <div>
                      <p className={`text-sm md:text-lg font-medium md:font-bold tracking-tight wrap-break-word ${todo.completed
                        ? isDarkTheme ? "line-through text-zinc-600" : "line-through text-zinc-400"
                        : isDarkTheme ? "text-white" : "text-zinc-900"
                        }`}>
                        {todo.text}
                      </p>

                      {todo.description && (
                        <div className="mt-1 md:mt-2">
                          {expandedTodos.has(todo.id) ? (
                            <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap wrap-break-word ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                              {todo.description}
                            </p>
                          ) : (
                            <p className={`text-xs md:text-sm ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                              {todo.description.substring(0, 60)}...
                            </p>
                          )}

                          {todo.description.length > 60 && (
                            <button
                              onClick={() => toggleExpand(todo.id)}
                              className={`flex items-center gap-1 mt-1 text-[10px] md:text-xs font-semibold ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`}
                            >
                              {expandedTodos.has(todo.id) ? (
                                <>Less <ChevronUp className="w-3 h-3" /></>
                              ) : (
                                <>More <ChevronDown className="w-3 h-3" /></>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 border-none rounded-md ${todo.priority === "High" ? "bg-red-50 text-red-600" :
                          todo.priority === "Medium" ? "bg-blue-50 text-blue-600" :
                            "bg-zinc-100 text-zinc-600"
                          }`}
                      >
                        {todo.priority}
                      </Badge>
                      {todo.category && (
                        <Badge
                          variant="outline"
                          className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 rounded-md border ${isDarkTheme ? CATEGORY_COLORS_DARK[todo.category] : CATEGORY_COLORS[todo.category]
                            }`}
                        >
                          {todo.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className={`h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-2xl shrink-0 ${isDarkTheme ? "text-zinc-600 hover:text-red-400 hover:bg-red-500/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 h-12 w-12 md:h-16 md:w-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30 flex items-center justify-center z-40 transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <AddTodoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddTodo}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}