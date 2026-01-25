import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
    CheckCircle2,
    Circle,
    Crown,
    Flame,
    ListTodo,
    Lock,
    LogOut,
    MoreVertical,
    Plus,
    ShieldCheck,
    Target,
    Trash2,
    Trophy,
    Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// --- CORE TYPES ---

type Priority = "High" | "Medium" | "Low";
type Category = "Personal" | "Coding" | "Finance" | "Health" | "Career";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
}

interface Resolution {
  id: string;
  title: string;
  description?: string;
  category: Category;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  isPinned: boolean;
  notes: string[];
}

interface UserSettings {
  name: string;
  pin: string | null;
  vaultUnlocked: boolean; // Session state
}

// --- HOOKS ---

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue] as const;
}

// --- COMPONENTS: VAULT LOCK SCREEN ---

const VaultLockScreen = ({
  pin,
  onUnlock,
  onSetup,
}: {
  pin: string | null;
  onUnlock: (p: string) => void;
  onSetup: (p: string) => void;
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const isSetup = pin === null;

  const handleInput = (val: string) => {
    if (val.length > 4) return;
    setInput(val);
    setError(false);
  };

  const handleSubmit = () => {
    if (isSetup) {
      if (input.length === 4) onSetup(input);
    } else {
      if (input === pin) {
        onUnlock(input);
      } else {
        setError(true);
        setInput("");
        toast.error("Access Denied: Invalid Security Credential");
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="mx-auto w-24 h-24 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_60px_-10px_rgba(245,158,11,0.4)] mb-8 ring-4 ring-zinc-900 ring-offset-4 ring-offset-amber-500/20">
          {isSetup ? (
            <ShieldCheck className="w-12 h-12 text-zinc-950" />
          ) : (
            <Lock className="w-12 h-12 text-zinc-950" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-amber-50 uppercase italic">
            {isSetup ? "Initialize Vault" : "Restricted Access"}
          </h1>
          <p className="text-amber-500/60 font-medium tracking-wide text-sm">
            {isSetup
              ? "CREATE YOUR 4-DIGIT MASTER PIN"
              : "ENTER SECURITY CREDENTIALS"}
          </p>
        </div>

        <div className="flex justify-center gap-4 py-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                input.length > i
                  ? "bg-amber-500 scale-125 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  : "bg-zinc-800"
              } ${error ? "animate-shake bg-red-500" : ""}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "Go"].map((key) => (
            <Button
              key={key}
              variant="outline"
              className={`h-16 text-xl font-bold rounded-2xl transition-all active:scale-95 ${
                key === "Go"
                  ? "bg-amber-500 text-zinc-950 border-amber-500 hover:bg-amber-400"
                  : key === "C"
                    ? "border-zinc-800 text-red-400 hover:bg-red-950/20 hover:border-red-900/50"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800 hover:border-amber-500/30"
              }`}
              onClick={() => {
                if (key === "Go") handleSubmit();
                else if (key === "C") setInput("");
                else handleInput(input + key);
              }}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SUB-VIEWS: DAILY MOMENTUM ---

const MomentumView = ({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: (val: Todo[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      priority,
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
    toast.success("Task added to queue");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    toast.info("Task removed");
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
      case "Low":
        return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    }
  };

  const progress =
    todos.length > 0
      ? Math.round(
          (todos.filter((t) => t.completed).length / todos.length) * 100,
        )
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-linear-to-r from-zinc-900 to-zinc-800 text-white border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                Daily Velocity
              </p>
              <h2 className="text-4xl font-black tracking-tight">
                {progress}% Complete
              </h2>
            </div>
            <div className="h-20 w-20 rounded-full border-8 border-emerald-500/20 flex items-center justify-center relative">
              <span className="text-xl font-bold text-emerald-400">
                {todos.filter((t) => t.completed).length}
              </span>
              <div
                className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent animate-spin-slow"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-zinc-900">
              12 <span className="text-lg text-zinc-400 font-normal">Days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Area */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="What needs to be done?"
            className="h-12 pl-4 text-lg bg-white border-zinc-200 shadow-sm focus-visible:ring-emerald-500"
          />
        </div>
        <Select
          value={priority}
          onValueChange={(val: Priority) => setPriority(val)}
        >
          <SelectTrigger className="w-[140px] h-12 bg-white border-zinc-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High Priority</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={addTodo}
          className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-lg shadow-zinc-900/20"
        >
          ADD TASK
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <ListTodo className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
            <h3 className="text-lg font-medium text-zinc-900">All caught up</h3>
            <p className="text-zinc-500">Add a task to start your momentum.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`
                group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md
                ${todo.completed ? "bg-zinc-50 border-zinc-100 opacity-60" : "bg-white border-zinc-200"}
              `}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`transition-colors ${todo.completed ? "text-emerald-500" : "text-zinc-300 hover:text-emerald-500"}`}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div>
                  <p
                    className={`font-medium text-lg ${todo.completed ? "line-through text-zinc-400" : "text-zinc-900"}`}
                  >
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`text-xs border-0 font-semibold px-2 py-0.5 ${getPriorityColor(todo.priority)}`}
                    >
                      {todo.priority}
                    </Badge>
                    <span className="text-xs text-zinc-400 font-mono">
                      {new Date(todo.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- SUB-VIEWS: VAULT DASHBOARD ---

const VaultView = ({
  resolutions,
  setResolutions,
}: {
  resolutions: Resolution[];
  setResolutions: (val: Resolution[]) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRes, setNewRes] = useState<Partial<Resolution>>({
    category: "Personal",
    target: 100,
    unit: "%",
  });

  const addResolution = () => {
    if (!newRes.title) return;
    const res: Resolution = {
      id: crypto.randomUUID(),
      title: newRes.title,
      category: (newRes.category as Category) || "Personal",
      target: newRes.target || 100,
      current: 0,
      unit: newRes.unit || "%",
      isPinned: false,
      notes: [],
      completed: false,
    } as any;
    setResolutions([...resolutions, res]);
    setIsDialogOpen(false);
    setNewRes({ category: "Personal", target: 100, unit: "%" });
    toast.success("New Protocol Initiated");
  };

  const deleteRes = (id: string) => {
    setResolutions(resolutions.filter((r) => r.id !== id));
  };

  const incrementRes = (id: string) => {
    setResolutions(
      resolutions.map((r) => {
        if (r.id !== id) return r;
        const next = Math.min(r.current + 1, r.target);
        return { ...r, current: next, completed: next >= r.target };
      }),
    );
  };

  // Calculate Vault Stats
  const totalResolutions = resolutions.length;
  const completedResolutions = resolutions.filter(
    (r) => (r as any).completed,
  ).length;
  const overallProgress =
    totalResolutions === 0
      ? 0
      : Math.round(
          (resolutions.reduce((acc, r) => acc + r.current / r.target, 0) /
            totalResolutions) *
            100,
        );

  return (
    <div className="min-h-full space-y-8 animate-in zoom-in-95 duration-500">
      {/* Vault Header / Bento Grid Top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Welcome Block */}
        <div className="md:col-span-2 bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-8 text-zinc-950 shadow-lg shadow-amber-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-zinc-900" />
              <span className="font-black text-xs uppercase tracking-[0.2em] opacity-70">
                Dikie Premium
              </span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter mb-2">
              THE 2026 ARCHIVE
            </h1>
            <p className="font-medium text-zinc-900/80 max-w-sm">
              Your long-term strategic objectives are secured here. Focus on the
              macro-vision.
            </p>
            <div className="mt-8 flex gap-3">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-zinc-950 text-amber-500 hover:bg-zinc-900 border-none font-bold"
              >
                <Plus className="w-4 h-4 mr-2" /> NEW PROTOCOL
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Blocks */}
        <div className="bg-zinc-900/50 border border-amber-500/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">
              {overallProgress}%
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">
              Global Completion
            </div>
            <Progress
              value={overallProgress}
              className="h-1 bg-zinc-800 mt-3"
              indicatorClassName="bg-amber-500"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-amber-500/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">
              {completedResolutions}{" "}
              <span className="text-lg text-zinc-600">
                / {totalResolutions}
              </span>
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">
              Goals Achieved
            </div>
          </div>
        </div>
      </div>

      {/* Resolutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resolutions.map((res) => (
          <Card
            key={res.id}
            className="bg-zinc-950 border-zinc-800 hover:border-amber-500/50 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Background linear on Hover */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <CardHeader className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 bg-zinc-900 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors"
                >
                  {res.category}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-900 border-zinc-800 text-white"
                  >
                    <DropdownMenuItem
                      onClick={() => deleteRes(res.id)}
                      className="text-red-400 focus:text-red-400 focus:bg-red-950/20"
                    >
                      Delete Protocol
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl text-zinc-100 group-hover:text-amber-50 transition-colors">
                {res.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div className="text-4xl font-thin text-zinc-500 group-hover:text-white transition-colors">
                  {res.current}
                  <span className="text-base font-bold text-amber-500 ml-1">
                    {res.unit}
                  </span>
                </div>
                <div className="text-xs text-zinc-600 font-mono mb-1">
                  TARGET: {res.target}
                </div>
              </div>
              <Progress
                value={(res.current / res.target) * 100}
                className="h-1.5 bg-zinc-900"
                indicatorClassName="bg-amber-500"
              />
            </CardContent>
            <CardFooter className="border-t border-zinc-900 pt-4 relative z-10">
              <Button
                onClick={() => incrementRes(res.id)}
                className="w-full bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-zinc-400 font-bold transition-all border border-zinc-800 hover:border-amber-500"
              >
                <Plus className="w-4 h-4 mr-2" /> RECORD PROGRESS
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* New Goal Card Placeholder */}
        <Card
          onClick={() => setIsDialogOpen(true)}
          className="bg-zinc-900/20 border-2 border-dashed border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer flex flex-col items-center justify-center p-8 transition-all min-h-[250px]"
        >
          <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800 group-hover:border-amber-500/50 group-hover:scale-110 transition-all">
            <Plus className="w-8 h-8 text-zinc-600 group-hover:text-amber-500" />
          </div>
          <p className="font-bold text-zinc-500 group-hover:text-amber-500">
            INITIATE NEW GOAL
          </p>
        </Card>
      </div>

      {/* Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-amber-500/20 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-amber-500 italic">
              NEW RESOLUTION
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Define the parameters for your new objective.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Objective Title
              </label>
              <Input
                value={newRes.title || ""}
                onChange={(e) =>
                  setNewRes({ ...newRes, title: e.target.value })
                }
                className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500"
                placeholder="e.g. Master React Native"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Target Value
                </label>
                <Input
                  type="number"
                  value={newRes.target}
                  onChange={(e) =>
                    setNewRes({ ...newRes, target: Number(e.target.value) })
                  }
                  className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Unit
                </label>
                <Input
                  value={newRes.unit}
                  onChange={(e) =>
                    setNewRes({ ...newRes, unit: e.target.value })
                  }
                  className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500"
                  placeholder="%"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Category
              </label>
              <Select
                value={newRes.category}
                onValueChange={(v) =>
                  setNewRes({ ...newRes, category: v as Category })
                }
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {["Personal", "Coding", "Finance", "Health", "Career"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={addResolution}
              className="bg-amber-600 hover:bg-amber-500 text-black font-bold w-full"
            >
              CONFIRM PROTOCOL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- MAIN SHELL ---

export default function PrestigeApp() {
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    "dikie-settings-v3",
    { name: "Dikie", pin: null, vaultUnlocked: false },
  );
  const [todos, setTodos] = useLocalStorage<Todo[]>("dikie-todos-v3", []);
  const [resolutions, setResolutions] = useLocalStorage<Resolution[]>(
    "dikie-resolutions-v3",
    [],
  );

  const [activeTab, setActiveTab] = useState<"momentum" | "vault">("momentum");

  // Handle Vault Unlock Logic
  const unlockVault = (enteredPin: string) => {
    setSettings((prev) => ({ ...prev, vaultUnlocked: true }));
  };

  const setupPin = (newPin: string) => {
    setSettings((prev) => ({ ...prev, pin: newPin, vaultUnlocked: true }));
    toast.success("Vault Security Initialized");
  };

  const lockVault = () => {
    setSettings((prev) => ({ ...prev, vaultUnlocked: false }));
    toast.info("Vault Secured");
  };

  // Determine styles based on active engine
  const isVault = activeTab === "vault";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-1000 ${isVault ? "bg-zinc-950 text-white selection:bg-amber-500/30" : "bg-zinc-50 text-zinc-900 selection:bg-emerald-500/20"}`}
    >
      {/* Sidebar Navigation */}
      <aside
        className={`w-20 lg:w-64 border-r flex flex-col fixed inset-y-0 z-40 transition-all duration-500 ${isVault ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-200"}`}
      >
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-inherit">
          <div
            className={`p-2 rounded-xl mr-0 lg:mr-3 transition-colors ${isVault ? "bg-amber-500 text-black" : "bg-zinc-900 text-white"}`}
          >
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span
            className={`hidden lg:block font-black text-xl tracking-tighter ${isVault ? "text-amber-50" : "text-zinc-900"}`}
          >
            DIKIE{" "}
            <span className={isVault ? "text-amber-500" : "text-zinc-400"}>
              OS
            </span>
          </span>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("momentum")}
            className={`w-full justify-start h-12 text-md font-medium transition-all ${
              activeTab === "momentum"
                ? "bg-zinc-100 text-zinc-900 shadow-sm"
                : isVault
                  ? "text-zinc-500 hover:text-amber-500 hover:bg-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ListTodo className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:inline">Momentum</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveTab("vault")}
            className={`w-full justify-start h-12 text-md font-medium transition-all ${
              activeTab === "vault"
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : isVault
                  ? "text-zinc-500 hover:text-amber-500"
                  : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {isVault && settings.vaultUnlocked ? (
              <ShieldCheck className="w-5 h-5 lg:mr-3" />
            ) : (
              <Lock className="w-5 h-5 lg:mr-3" />
            )}
            <span className="hidden lg:inline">The Vault</span>
          </Button>
        </nav>

        <div className="p-4 border-t border-inherit">
          {isVault && settings.vaultUnlocked && (
            <Button
              variant="outline"
              onClick={lockVault}
              className="w-full border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 hover:border-red-900/50"
            >
              <LogOut className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">Lock Vault</span>
            </Button>
          )}
          {!isVault && (
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  DO
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-bold text-zinc-900">Dickens O.</p>
                <p className="text-xs text-zinc-500">Free Tier</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 transition-all duration-500">
        <div className="max-w-6xl mx-auto p-6 lg:p-12 min-h-screen relative">
          {/* Dynamic Render */}
          {activeTab === "momentum" && (
            <div className="animate-in fade-in duration-500">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">
                  Good Morning, Dikie
                </h1>
                <p className="text-zinc-500">
                  Let's build something great today.
                </p>
              </header>
              <MomentumView todos={todos} setTodos={setTodos} />
            </div>
          )}

          {activeTab === "vault" && (
            <div className="relative min-h-[80vh]">
              {!settings.vaultUnlocked ? (
                <VaultLockScreen
                  pin={settings.pin}
                  onUnlock={unlockVault}
                  onSetup={setupPin}
                />
              ) : (
                <VaultView
                  resolutions={resolutions}
                  setResolutions={setResolutions}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <Toaster position="bottom-right" theme={isVault ? "dark" : "light"} />
    </div>
  );
}
