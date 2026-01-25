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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Circle,
  Flame,
  Lock,
  Plus,
  Target,
  Trash2,
  Trophy,
  Zap,
  Crown,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useState, useMemo } from "react";

// --- TYPES & MOCK DATA ---
type Category = "Personal" | "Coding" | "Health" | "Finance" | "Career";

interface Resolution {
  id: string;
  title: string;
  category: Category;
  target: number;
  current: number;
  completed: boolean;
  priority: "A" | "B" | "C";
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp: string;
}

// --- PREMIUM AUTH DIALOG ---
const VaultGuard = ({
  pin,
  onSuccess,
  open,
  onOpenChange,
}: {
  pin: string | null;
  onSuccess: (p?: string) => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const [val, setVal] = useState("");
  const isSetup = pin === null;

  const handleSubmit = () => {
    if (isSetup && val.length >= 4) onSuccess(val);
    else if (val === pin) onSuccess();
    else setVal("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-amber-500/30 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]">
        <DialogHeader className="items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-700 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-900/40">
            <Crown className="w-10 h-10 text-zinc-950" />
          </div>
          <DialogTitle className="text-3xl font-black text-amber-100 tracking-tighter italic uppercase">
            {isSetup ? "Create Master Key" : "The Resolution Vault"}
          </DialogTitle>
          <DialogDescription className="text-amber-500/60 font-medium">
            Authorized Personnel Only — Dikie Prestige Access
          </DialogDescription>
        </DialogHeader>
        <div className="py-8">
          <Input
            type="password"
            placeholder="••••"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="bg-zinc-900/50 border-amber-500/20 text-center text-4xl h-20 tracking-[1em] text-amber-400 focus-visible:ring-amber-500/50"
            maxLength={6}
          />
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-lg rounded-xl shadow-lg shadow-amber-500/20"
        >
          {isSetup ? "INITIALIZE SYSTEM" : "UNLOCK PRESTIGE"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default function PrestigeApp() {
  const [activeTab, setActiveTab] = useState("momentum");
  const [isAuth, setIsAuth] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pin, setPin] = useState<string | null>(null);

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      text: "Refactor Auth Provider",
      completed: false,
      timestamp: "10:00 AM",
    },
    { id: "2", text: "Daily Standup", completed: true, timestamp: "09:00 AM" },
  ]);

  const [resolutions] = useState<Resolution[]>([
    {
      id: "1",
      title: "Master Distributed Systems",
      category: "Coding",
      target: 100,
      current: 65,
      completed: false,
      priority: "A",
    },
    {
      id: "2",
      title: "Visit 5 New Countries",
      category: "Personal",
      target: 5,
      current: 1,
      completed: false,
      priority: "B",
    },
    {
      id: "3",
      title: "Portfolio Return +25%",
      category: "Finance",
      target: 25,
      current: 12,
      completed: false,
      priority: "A",
    },
  ]);

  const stats = useMemo(
    () => ({
      completed: resolutions.filter((r) => r.completed).length,
      progress: Math.round(
        (resolutions.reduce(
          (acc, curr) => acc + curr.current / curr.target,
          0,
        ) /
          resolutions.length) *
          100,
      ),
    }),
    [resolutions],
  );

  const handleTabToggle = (val: string) => {
    if (val === "vault" && !isAuth) setShowAuth(true);
    else setActiveTab(val);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${activeTab === "vault" ? "bg-zinc-950" : "bg-zinc-50"}`}
    >
      {/* Dynamic Navbar */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all ${activeTab === "vault" ? "bg-zinc-950/80 border-amber-500/20" : "bg-white/80 border-zinc-200"}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${activeTab === "vault" ? "bg-amber-500" : "bg-emerald-600"}`}
            >
              <Zap
                className={
                  activeTab === "vault" ? "text-zinc-950" : "text-white"
                }
                size={18}
              />
            </div>
            <span
              className={`font-black text-xl tracking-tighter uppercase ${activeTab === "vault" ? "text-amber-100" : "text-zinc-900"}`}
            >
              Dikie{" "}
              <span
                className={
                  activeTab === "vault" ? "text-amber-500" : "text-emerald-600"
                }
              >
                2026
              </span>
            </span>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={handleTabToggle}
            className="w-auto"
          >
            <TabsList
              className={`p-1 ${activeTab === "vault" ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100"}`}
            >
              <TabsTrigger
                value="momentum"
                className="data-[state=active]:shadow-sm"
              >
                Daily Momentum
              </TabsTrigger>
              <TabsTrigger
                value="vault"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950"
              >
                <Lock size={14} className="mr-2" /> The Vault
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <TabsContent
          value="momentum"
          className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4"
        >
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                Today's Focus
              </h1>
              <p className="text-zinc-500 font-medium">
                Build momentum. One task at a time.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter high-impact task..."
                className="w-full md:w-80 h-12 bg-white border-zinc-200 shadow-sm"
              />
              <Button className="h-12 bg-emerald-600 hover:bg-emerald-700 px-6 font-bold">
                ADD TASK
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-zinc-200 shadow-xl shadow-zinc-200/50">
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-zinc-100">
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {}}
                            className={`transition-transform active:scale-90 ${todo.completed ? "text-emerald-500" : "text-zinc-300"}`}
                          >
                            {todo.completed ? (
                              <CheckCircle2 size={28} />
                            ) : (
                              <Circle size={28} />
                            )}
                          </button>
                          <div>
                            <p
                              className={`font-semibold text-lg ${todo.completed ? "line-through text-zinc-400" : "text-zinc-800"}`}
                            >
                              {todo.text}
                            </p>
                            <span className="text-xs text-zinc-400 font-mono">
                              {todo.timestamp}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <aside className="space-y-6">
              <Card className="bg-emerald-600 border-none text-white shadow-lg shadow-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <Flame size={20} /> Daily Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-6xl font-black">12</div>
                  <p className="text-emerald-100/80 font-medium mt-1">
                    Days of consistent output
                  </p>
                </CardContent>
              </Card>
              <Card className="border-zinc-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-zinc-400">
                    Next Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-zinc-800">
                    Review Financial Resolutions
                  </p>
                  <Button
                    variant="link"
                    className="p-0 text-emerald-600 h-auto mt-2"
                  >
                    Go to Vault <ChevronRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </TabsContent>

        <TabsContent
          value="vault"
          className="mt-0 space-y-8 animate-in zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-black tracking-widest text-sm mb-1 uppercase">
                <ShieldCheck size={16} /> Secure Prestige Environment
              </div>
              <h1 className="text-5xl font-black text-amber-100 tracking-tighter italic">
                THE 2026 ARCHIVE
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  Total Progress
                </p>
                <p className="text-3xl font-black text-amber-500">
                  {stats.progress}%
                </p>
              </div>
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black h-14 rounded-xl px-8 shadow-lg shadow-amber-500/20"
              >
                <Plus size={20} className="mr-2" /> NEW GOAL
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
            {resolutions.map((res, i) => (
              <Card
                key={res.id}
                className={`bg-zinc-900 border-amber-500/10 hover:border-amber-500/40 transition-all cursor-pointer group shadow-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    {res.category}
                  </Badge>
                  {res.priority === "A" && (
                    <Crown size={16} className="text-amber-500" />
                  )}
                </CardHeader>
                <CardContent className={i === 0 ? "py-10" : "py-4"}>
                  <h3
                    className={`${i === 0 ? "text-3xl" : "text-xl"} font-bold text-zinc-100 mb-6 group-hover:text-amber-400 transition-colors`}
                  >
                    {res.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-amber-500/60 uppercase tracking-widest">
                      <span>Achievement</span>
                      <span>
                        {res.current} / {res.target}
                      </span>
                    </div>
                    <Progress
                      value={(res.current / res.target) * 100}
                      className="h-1 bg-zinc-800"
                      indicatorClassName="bg-amber-500"
                    />
                  </div>
                </CardContent>
                {i === 0 && (
                  <CardFooter className="pt-0 border-t border-amber-500/5 mt-4 flex justify-between items-center text-amber-500/40">
                    <span className="text-xs font-bold flex items-center gap-2">
                      <TrendingUp size={14} /> Top Priority Goal
                    </span>
                    <Button
                      variant="ghost"
                      className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                    >
                      Manage
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}

            <Card className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-700 border-none flex flex-col items-center justify-center text-zinc-950 p-8 text-center">
              <Trophy size={48} className="mb-4 drop-shadow-lg" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                The Winner's Circle
              </h2>
              <p className="font-bold text-amber-950 opacity-80 max-w-[200px]">
                You have {stats.completed} fully achieved goals this year.
              </p>
            </Card>
          </div>
        </TabsContent>
      </main>

      <VaultGuard
        pin={pin}
        open={showAuth}
        onOpenChange={setShowAuth}
        onSuccess={(p) => {
          if (p) setPin(p);
          setIsAuth(true);
          setShowAuth(false);
          setActiveTab("vault");
        }}
      />
    </div>
  );
}
