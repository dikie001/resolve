import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Flame,
  ListTodo,
  Lock,
  Unlock,
  Plus,
  Target,
  Trash2,
  Trophy,
  X,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

// --- TYPES ---
type Category = "Personal" | "Coding" | "Health" | "Finance" | "Career";

interface Resolution {
  id: string;
  title: string;
  category: Category;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  date: string;
}

interface UserSettings {
  name: string;
  pin: string | null;
}

// --- HOOKS ---
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
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
    } catch (error) {}
  };
  return [storedValue, setValue] as const;
}

// --- REFINED LOGIN DIALOG ---
const ResolutionAuthDialog = ({
  settings,
  onSuccess,
  open,
  onOpenChange,
}: {
  settings: UserSettings;
  onSuccess: (newPin?: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [inputPin, setInputPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const isSetup = settings.pin === null;

  const handleAuth = () => {
    setError("");
    if (isSetup) {
      if (inputPin.length < 4) return setError("PIN must be 4+ digits");
      if (inputPin !== confirmPin) return setError("PINs do not match");
      onSuccess(inputPin);
    } else {
      if (inputPin === settings.pin) {
        onSuccess();
      } else {
        setError("Access Denied: Incorrect PIN");
        setInputPin("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 shadow-2xl">
        <DialogHeader className="items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            {isSetup ? "Initialize Vault" : "Encrypted Access"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isSetup
              ? "Set a secure PIN for your 2026 resolutions."
              : "Enter your security PIN to view goals."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-6">
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="••••"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-center text-2xl h-14 tracking-[0.5em] focus:ring-emerald-500/20"
              maxLength={8}
            />
            {isSetup && (
              <Input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-center text-2xl h-14 tracking-[0.5em]"
                maxLength={8}
              />
            )}
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center font-medium animate-pulse">
              {error}
            </p>
          )}
        </div>
        <Button
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all"
          onClick={handleAuth}
        >
          {isSetup ? "Setup Vault" : "Unlock Resolutions"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default function ResolveMainPage() {
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    "dikie-settings",
    { name: "Dikie", pin: null },
  );
  const [resolutions, setResolutions] = useLocalStorage<Resolution[]>(
    "dikie-resolutions",
    [],
  );
  const [todos, setTodos] = useLocalStorage<Todo[]>("dikie-todos", []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const [resTitle, setResTitle] = useState("");
  const [resCategory, setResCategory] = useState<Category>("Personal");
  const [todoInput, setTodoInput] = useState("");

  const handleTabChange = (value: string) => {
    if (value === "resolutions" && !isAuthenticated) {
      setIsAuthDialogOpen(true);
    } else {
      setActiveTab(value);
    }
  };

  const handleLoginSuccess = (newPin?: string) => {
    if (newPin) setSettings((prev) => ({ ...prev, pin: newPin }));
    setIsAuthenticated(true);
    setIsAuthDialogOpen(false);
    setActiveTab("resolutions");
  };

  // --- LOGIC HANDLERS ---
  const addResolution = () => {
    if (!resTitle.trim()) return;
    const newRes: Resolution = {
      id: crypto.randomUUID(),
      title: resTitle,
      category: resCategory,
      target: 100,
      current: 0,
      unit: "%",
      completed: false,
    };
    setResolutions([...resolutions, newRes]);
    setResTitle("");
  };

  const addTodo = () => {
    if (!todoInput.trim()) return;
    setTodos([
      {
        id: crypto.randomUUID(),
        text: todoInput,
        completed: false,
        priority: "Medium",
        date: new Date().toISOString(),
      },
      ...todos,
    ]);
    setTodoInput("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-20 selection:bg-emerald-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
            <span className="font-bold text-lg tracking-tight">
              Dikie<span className="text-emerald-500 text-xs ml-1">v2.0</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
                className="text-zinc-500 hover:text-white"
              >
                <Lock className="w-4 h-4 mr-2" /> Lock Vault
              </Button>
            )}
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              2026
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
              <TabsTrigger
                value="todos"
                className="data-[state=active]:bg-zinc-800"
              >
                <ListTodo className="w-4 h-4 mr-2" /> Daily Momentum
              </TabsTrigger>
              <TabsTrigger
                value="resolutions"
                className="data-[state=active]:bg-zinc-800"
              >
                {isAuthenticated ? (
                  <Unlock className="w-4 h-4 mr-2 text-emerald-500" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Resolutions
              </TabsTrigger>
            </TabsList>

            {activeTab === "resolutions" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-500">
                    <Plus className="w-4 h-4 mr-2" /> Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <DialogHeader>
                    <DialogTitle>New Resolution</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Goal Title"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className="bg-zinc-950 border-zinc-700"
                    />
                    <Select
                      value={resCategory}
                      onValueChange={(val: Category) => setResCategory(val)}
                    >
                      <SelectTrigger className="bg-zinc-950 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {[
                          "Personal",
                          "Coding",
                          "Health",
                          "Finance",
                          "Career",
                        ].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={addResolution}
                      className="w-full bg-emerald-600"
                    >
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <TabsContent value="todos">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Daily Momentum</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
                <div className="mt-4 flex gap-2">
                  <Input
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    placeholder="What's the next win?"
                    className="bg-zinc-950 border-zinc-800"
                  />
                  <Button
                    onClick={addTodo}
                    className="bg-zinc-100 text-zinc-950 hover:bg-white"
                  >
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setTodos(
                            todos.map((t) =>
                              t.id === todo.id
                                ? { ...t, completed: !t.completed }
                                : t,
                            ),
                          )
                        }
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="text-emerald-500" />
                        ) : (
                          <Circle className="text-zinc-600" />
                        )}
                      </button>
                      <span
                        className={
                          todo.completed
                            ? "line-through text-zinc-600"
                            : "text-zinc-200"
                        }
                      >
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setTodos(todos.filter((t) => t.id !== todo.id))
                      }
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolutions">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resolutions.map((res) => (
                <Card key={res.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <Badge className="w-fit mb-2 bg-zinc-800 text-zinc-400 border-zinc-700">
                      {res.category}
                    </Badge>
                    <CardTitle className="text-lg">{res.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                      <span>Progress</span>
                      <span>{res.current}%</span>
                    </div>
                    <Progress value={res.current} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ResolutionAuthDialog
        settings={settings}
        onSuccess={handleLoginSuccess}
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
    </div>
  );
}
