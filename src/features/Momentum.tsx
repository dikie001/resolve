import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Target,
  Plus,
  Zap,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  X,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import type { Priority, Todo, TodoCategory } from "@/types";
import { AddTodoDialog } from "@/components/app/AddTodoDialog";

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

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.text.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((t) => t.completed);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    // Sorting
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Velocity Stats Section */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border-none text-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-blue-900/20 overflow-hidden relative group">
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-white/10 rounded-md">
                      <Zap className="w-4 h-4 text-blue-200" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100/70">
                      Engine Performance
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">
                    {progress}% <span className="text-lg md:text-xl not-italic font-bold opacity-50 uppercase tracking-widest ml-2">Velocity</span>
                  </h2>
                </div>
                <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
                  <Target className="w-20 h-20 md:w-24 md:h-24 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full border-t-white/40 animate-spin-slow" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 md:gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/40"></div>
                  <span className="text-sm font-medium text-blue-100/80">{stats.total} Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm font-medium text-blue-100/80">{stats.completed} Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span className="text-sm font-medium text-blue-100/80">{stats.active} Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className={`h-11 md:h-12 pl-10 md:pl-12 border-none rounded-xl ${isDarkTheme ? "bg-zinc-900 text-white placeholder:text-zinc-600" : "bg-white text-zinc-900 shadow-sm"}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkTheme ? "text-zinc-600 hover:text-zinc-400" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`h-11 md:h-12 px-3 md:px-4 rounded-xl ${isDarkTheme ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white shadow-sm"} ${hasActiveFilters ? "ring-2 ring-blue-500" : ""}`}
          >
            <Filter className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Filters</span>
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </Button>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className={`p-4 md:p-5 rounded-xl md:rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200 ${isDarkTheme ? "bg-zinc-900 border-2 border-zinc-800" : "bg-white border-2 border-zinc-200 shadow-sm"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Status</label>
                <Select value={filterStatus} onValueChange={(v: FilterStatus) => setFilterStatus(v)}>
                  <SelectTrigger className={`h-11 border-2 rounded-xl font-medium ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white hover:border-zinc-600" : "bg-zinc-50 border-zinc-300 text-zinc-900 hover:border-zinc-400"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                    <SelectItem value="all" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>All Tasks</SelectItem>
                    <SelectItem value="active" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Active Only</SelectItem>
                    <SelectItem value="completed" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Completed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Category</label>
                <Select value={filterCategory} onValueChange={(v: TodoCategory | "all") => setFilterCategory(v)}>
                  <SelectTrigger className={`h-11 border-2 rounded-xl font-medium ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white hover:border-zinc-600" : "bg-zinc-50 border-zinc-300 text-zinc-900 hover:border-zinc-400"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                    <SelectItem value="all" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>All Categories</SelectItem>
                    <SelectItem value="Work" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Work</SelectItem>
                    <SelectItem value="Personal" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Personal</SelectItem>
                    <SelectItem value="Health" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Health</SelectItem>
                    <SelectItem value="Learning" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Learning</SelectItem>
                    <SelectItem value="Shopping" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Shopping</SelectItem>
                    <SelectItem value="Other" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Priority</label>
                <Select value={filterPriority} onValueChange={(v: Priority | "all") => setFilterPriority(v)}>
                  <SelectTrigger className={`h-11 border-2 rounded-xl font-medium ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white hover:border-zinc-600" : "bg-zinc-50 border-zinc-300 text-zinc-900 hover:border-zinc-400"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                    <SelectItem value="all" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>All Priorities</SelectItem>
                    <SelectItem value="High" className="text-red-600 font-semibold focus:bg-red-50">High Priority</SelectItem>
                    <SelectItem value="Medium" className="text-blue-600 font-semibold focus:bg-blue-50">Medium Priority</SelectItem>
                    <SelectItem value="Low" className={`font-semibold ${isDarkTheme ? "text-zinc-400 focus:bg-zinc-700" : "text-zinc-600 focus:bg-zinc-50"}`}>Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>Sort By</label>
                <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
                  <SelectTrigger className={`h-11 border-2 rounded-xl font-medium ${isDarkTheme ? "bg-zinc-800 border-zinc-700 text-white hover:border-zinc-600" : "bg-zinc-50 border-zinc-300 text-zinc-900 hover:border-zinc-400"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                    <SelectItem value="newest" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Newest First</SelectItem>
                    <SelectItem value="oldest" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Oldest First</SelectItem>
                    <SelectItem value="priority-high" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>High Priority First</SelectItem>
                    <SelectItem value="priority-low" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Low Priority First</SelectItem>
                    <SelectItem value="category" className={`${isDarkTheme ? "text-white focus:bg-zinc-700" : "text-zinc-900"}`}>Group by Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t ${isDarkTheme ? "border-zinc-800" : "border-zinc-200"}`}>
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
                className={`text-sm font-semibold h-9 px-4 rounded-lg ${isDarkTheme ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 disabled:text-zinc-700" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:text-zinc-300"}`}
              >
                Clear All Filters
              </Button>
              {stats.completed > 0 && (
                <Button
                  onClick={deleteCompleted}
                  variant="outline"
                  size="sm"
                  className={`text-sm font-semibold h-9 px-4 rounded-lg border-2 ${isDarkTheme ? "text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50" : "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"}`}
                >
                  <Trash className="w-3.5 h-3.5 mr-1.5" />
                  Delete {stats.completed} Completed
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredAndSortedTodos.length === 0 ? (
          <div className={`text-center py-16 md:py-20 border-2 border-dashed rounded-[1.5rem] md:rounded-[2.5rem] transition-colors ${isDarkTheme ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
            <Zap className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 ${isDarkTheme ? "text-zinc-700" : "text-zinc-200"}`} />
            <h3 className={`text-base md:text-lg font-bold uppercase tracking-widest mb-2 ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`}>
              {hasActiveFilters ? "No Tasks Found" : "No Tasks Yet"}
            </h3>
            <p className={`text-sm mb-4 ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`}>
              {hasActiveFilters ? "Try adjusting your filters" : "Click the + button to create your first task"}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterCategory("all");
                  setFilterPriority("all");
                  setSearchQuery("");
                }}
                variant="outline"
                size="sm"
                className={`rounded-xl ${isDarkTheme ? "border-zinc-800 hover:bg-zinc-800" : ""}`}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          filteredAndSortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group transition-all duration-300 rounded-2xl md:rounded-3xl border ${todo.completed
                ? isDarkTheme
                  ? "bg-zinc-900/50 border-zinc-800 opacity-60"
                  : "bg-zinc-50/50 border-zinc-100 opacity-60"
                : isDarkTheme
                  ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
                  : "bg-white border-zinc-200 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
                }`}
            >
              <div className="flex items-start justify-between p-4 md:p-5 gap-3 md:gap-5">
                <div className="flex items-start gap-3 md:gap-5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-1 transition-all duration-500 transform active:scale-75 flex-shrink-0 ${todo.completed ? "text-blue-600" : "text-zinc-300 hover:text-blue-400"
                      }`}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 fill-blue-50" />
                    ) : (
                      <Circle className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5px]" />
                    )}
                  </button>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div>
                      <p className={`text-base md:text-lg font-bold tracking-tight transition-all break-words ${todo.completed
                        ? isDarkTheme ? "line-through text-zinc-600" : "line-through text-zinc-400"
                        : isDarkTheme ? "text-white" : "text-zinc-900"
                        }`}>
                        {todo.text}
                      </p>

                      {todo.description && (
                        <div className="mt-2">
                          {expandedTodos.has(todo.id) ? (
                            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                              {todo.description}
                            </p>
                          ) : todo.description.length > 100 ? (
                            <p className={`text-sm ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                              {todo.description.substring(0, 100)}...
                            </p>
                          ) : (
                            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                              {todo.description}
                            </p>
                          )}

                          {todo.description.length > 100 && (
                            <button
                              onClick={() => toggleExpand(todo.id)}
                              className={`flex items-center gap-1 mt-1 text-xs font-semibold transition-colors ${isDarkTheme ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                            >
                              {expandedTodos.has(todo.id) ? (
                                <>
                                  Show less <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  Show more <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0 border-none rounded-md ${todo.priority === "High" ? "bg-red-50 text-red-600" :
                          todo.priority === "Medium" ? "bg-blue-50 text-blue-600" :
                            "bg-zinc-100 text-zinc-600"
                          }`}
                      >
                        {todo.priority}
                      </Badge>
                      {todo.category && (
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0 rounded-md border ${isDarkTheme ? CATEGORY_COLORS_DARK[todo.category] : CATEGORY_COLORS[todo.category]
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
                  className={`opacity-0 group-hover:opacity-100 h-9 w-9 md:h-10 md:w-10 rounded-xl md:rounded-2xl transition-all flex-shrink-0 ${isDarkTheme ? "text-zinc-600 hover:text-red-400 hover:bg-red-500/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}
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
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center z-40 group"
        aria-label="Add new task"
      >
        <Plus className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Add Todo Dialog */}
      <AddTodoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddTodo}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}