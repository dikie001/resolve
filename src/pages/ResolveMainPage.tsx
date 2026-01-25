import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CalendarDays,
    Check,
    CheckCircle2,
    Circle,
    Flame,
    ListTodo,
    Lock,
    LogOut,
    Plus,
    Target,
    Trash2,
    Trophy,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

// --- TYPES ---

type Category = 'Personal' | 'Coding' | 'Health' | 'Finance' | 'Career';

interface Resolution {
  id: string;
  title: string;
  category: Category;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  notes?: string;
  deadline?: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

interface UserSettings {
  name: string;
  pin: string | null; // Null means no PIN set yet
  theme: 'dark' | 'light';
}

// --- HOOKS ---

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state function to avoid reading localStorage on every render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// --- COMPONENTS ---

// 1. AUTH SCREEN COMPONENT
const AuthScreen = ({ 
  settings, 
  onLogin 
}: { 
  settings: UserSettings, 
  onLogin: (newPin?: string) => void 
}) => {
  const [inputPin, setInputPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const isSetup = settings.pin === null;

  const handleAuth = () => {
    setError("");
    if (isSetup) {
      if (inputPin.length < 4) {
        setError("PIN must be at least 4 digits");
        return;
      }
      if (inputPin !== confirmPin) {
        setError("PINs do not match");
        return;
      }
      onLogin(inputPin); // Set new PIN
    } else {
      if (inputPin === settings.pin) {
        onLogin();
      } else {
        setError("Incorrect PIN");
        setInputPin("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl text-white">
            {isSetup ? "Secure Your Resolutions" : "Welcome Back, Dikie"}
          </CardTitle>
          <CardDescription>
            {isSetup ? "Create a PIN to protect your data." : "Enter your PIN to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-center text-lg tracking-widest"
              maxLength={8}
            />
            {isSetup && (
              <Input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="bg-zinc-950 border-zinc-700 text-center text-lg tracking-widest"
                maxLength={8}
              />
            )}
          </div>
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            onClick={handleAuth}
          >
            {isSetup ? "Set PIN & Enter" : "Unlock"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// 2. MAIN APP COMPONENT
export default function ResolveMainPage() {
  // State: Data
  const [settings, setSettings] = useLocalStorage<UserSettings>('dikie-settings', { 
    name: 'Dikie', 
    pin: null,
    theme: 'dark' 
  });
  const [resolutions, setResolutions] = useLocalStorage<Resolution[]>('dikie-resolutions', []);
  const [todos, setTodos] = useLocalStorage<Todo[]>('dikie-todos', []);
  
  // State: UI
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State: Inputs
  const [resTitle, setResTitle] = useState("");
  const [resCategory, setResCategory] = useState<Category>("Personal");
  const [resTarget, setResTarget] = useState("100");
  const [todoInput, setTodoInput] = useState("");

  // Effects
  useEffect(() => {
    // Auto-lock on tab close/refresh handled by default React state reset
  }, []);

  // --- HANDLERS: AUTH ---
  const handleLogin = (newPin?: string) => {
    if (newPin) {
      setSettings(prev => ({ ...prev, pin: newPin }));
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // --- HANDLERS: RESOLUTIONS ---
  const addResolution = () => {
    if (!resTitle.trim()) return;
    const newRes: Resolution = {
      id: crypto.randomUUID(),
      title: resTitle,
      category: resCategory,
      target: parseInt(resTarget) || 100,
      current: 0,
      unit: '%',
      completed: false,
    };
    setResolutions([...resolutions, newRes]);
    setResTitle("");
    setResTarget("100");
    setIsDialogOpen(false);
  };

  const updateProgress = (id: string, increment: boolean) => {
    setResolutions(prev => prev.map(r => {
      if (r.id !== id || r.completed) return r;
      
      const change = increment ? 1 : -1;
      const newCurrent = Math.max(0, Math.min(r.current + change, r.target));
      const isComplete = newCurrent >= r.target;
      
      return { ...r, current: newCurrent, completed: isComplete };
    }));
  };

  const markComplete = (id: string) => {
    setResolutions(prev => prev.map(r => 
      r.id === id ? { ...r, current: r.target, completed: true } : r
    ));
  };

  const deleteResolution = (id: string) => {
    if (window.confirm("Are you sure you want to delete this resolution?")) {
      setResolutions(prev => prev.filter(r => r.id !== id));
    }
  };

  // --- HANDLERS: TODOS ---
  const addTodo = () => {
    if (!todoInput.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: todoInput,
      completed: false,
      priority: 'Medium',
      date: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
    setTodoInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const clearTodos = (type: 'completed' | 'all') => {
    if (type === 'all' && !window.confirm("Delete all tasks?")) return;
    setTodos(prev => type === 'completed' ? prev.filter(t => !t.completed) : []);
  };

  // --- RENDER HELPERS ---
  const getCategoryColor = (cat: Category) => {
    const colors = {
      'Personal': 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      'Coding': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
      'Health': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
      'Finance': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
      'Career': 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    };
    return colors[cat];
  };

  if (!isAuthenticated) {
    return <AuthScreen settings={settings} onLogin={handleLogin} />;
  }

  const completionRate = resolutions.length > 0 
    ? Math.round((resolutions.filter(r => r.completed).length / resolutions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30 pb-20">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
            <span className="font-bold text-lg tracking-tight">Dikie<span className="text-emerald-500">2026</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
               <span className="text-xs text-zinc-400 uppercase tracking-wider">Completion</span>
               <span className="text-sm font-bold text-emerald-400">{completionRate}%</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Main Dashboard */}
        <Tabs defaultValue="resolutions" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="resolutions" className="data-[state=active]:bg-zinc-800">
                <Target className="w-4 h-4 mr-2" /> Resolutions
              </TabsTrigger>
              <TabsTrigger value="todos" className="data-[state=active]:bg-zinc-800">
                <ListTodo className="w-4 h-4 mr-2" /> Daily Tasks
              </TabsTrigger>
            </TabsList>
            
            {/* Quick Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
                  <Plus className="w-4 h-4 mr-2" /> New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle>Create New Resolution</DialogTitle>
                  <DialogDescription>Define a measurable goal for 2026.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Goal Title</label>
                    <Input 
                      placeholder="e.g. Learn Rust" 
                      value={resTitle} 
                      onChange={(e) => setResTitle(e.target.value)}
                      className="bg-zinc-950 border-zinc-700" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Category</label>
                      <Select 
                        value={resCategory} 
                        onValueChange={(val: Category) => setResCategory(val)}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Coding">Coding</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Career">Career</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Target Count</label>
                      <Input 
                        type="number" 
                        value={resTarget} 
                        onChange={(e) => setResTarget(e.target.value)}
                        className="bg-zinc-950 border-zinc-700" 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addResolution} className="bg-emerald-600 hover:bg-emerald-700 text-white">Create Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* RESOLUTIONS CONTENT */}
          <TabsContent value="resolutions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resolutions.map((res) => (
                <Card 
                  key={res.id} 
                  className={`
                    border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-zinc-700 group
                    ${res.completed ? 'border-emerald-900/50 bg-emerald-950/10' : ''}
                  `}
                >
                  <CardHeader className="pb-3 relative">
                     <div className="flex justify-between items-start">
                        <Badge variant="outline" className={`mb-2 ${getCategoryColor(res.category)}`}>
                          {res.category}
                        </Badge>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-zinc-500 hover:text-red-400"
                            onClick={() => deleteResolution(res.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                     </div>
                    <CardTitle className={`text-xl leading-tight ${res.completed ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-zinc-100'}`}>
                      {res.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm text-zinc-400 mb-2 font-mono">
                      <span>{res.current} / {res.target}</span>
                      <span>{Math.round((res.current / res.target) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(res.current / res.target) * 100} 
                      className="h-2 bg-zinc-950 border border-zinc-800" 
                      indicatorClassName={res.completed ? "bg-emerald-500" : "bg-blue-600"} 
                    />
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between gap-2">
                    {!res.completed ? (
                      <>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateProgress(res.id, false)}
                            className="h-8 w-8 p-0 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                          >
                            -
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateProgress(res.id, true)}
                            className="h-8 w-8 p-0 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => markComplete(res.id)}
                          className="h-8 bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 transition-colors"
                        >
                          <Check className="w-3 h-3 mr-1.5" /> Mark Done
                        </Button>
                      </>
                    ) : (
                      <div className="w-full text-center py-1 text-emerald-500 text-sm font-medium flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4" /> Goal Achieved
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
              
              {/* Empty State */}
              {resolutions.length === 0 && (
                <div className="col-span-full py-20 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                  <Target className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium text-zinc-400">No Resolutions Yet</p>
                  <p className="text-sm">Click "New Goal" to start your journey.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TODOS CONTENT */}
          <TabsContent value="todos">
            <Card className="bg-zinc-900 border-zinc-800 min-h-[600px] flex flex-col">
              <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Daily Focus</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <CalendarDays className="w-4 h-4 text-emerald-500" />
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => clearTodos('completed')} className="text-zinc-500 hover:text-zinc-300">
                        Clear Done
                      </Button>
                    </div>
                 </div>
                 
                 <div className="mt-4 flex gap-3">
                    <Input 
                      value={todoInput}
                      onChange={(e) => setTodoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                      placeholder="Add a new task..." 
                      className="bg-zinc-950 border-zinc-700 h-11"
                    />
                    <Button onClick={addTodo} className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700">
                      Add
                    </Button>
                 </div>
              </CardHeader>
              
              <ScrollArea className="flex-1">
                <CardContent className="space-y-2">
                  {todos.map((todo) => (
                    <div 
                      key={todo.id}
                      className={`
                        group flex items-center gap-4 p-3 rounded-lg border transition-all duration-200
                        ${todo.completed 
                          ? 'bg-zinc-950/30 border-zinc-900 opacity-50' 
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:translate-x-1'
                        }
                      `}
                    >
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className={`
                          flex-shrink-0 transition-colors
                          ${todo.completed ? 'text-emerald-500' : 'text-zinc-600 hover:text-emerald-500'}
                        `}
                      >
                        {todo.completed 
                          ? <CheckCircle2 className="w-6 h-6" /> 
                          : <Circle className="w-6 h-6" />
                        }
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`truncate text-base ${todo.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {todo.text}
                        </p>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"
                        onClick={() => setTodos(prev => prev.filter(t => t.id !== todo.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {todos.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                        <ListTodo className="w-12 h-12 mb-2 opacity-20" />
                        <p>No tasks for today. Enjoy your freedom!</p>
                     </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}