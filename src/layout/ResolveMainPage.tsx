import { AuthDialog } from "@/components/app/AuthDialog";
import { Sidebar } from "@/components/app/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Momentum } from "@/features/Momentum";
import { Resolutions } from "@/features/Resolutions";
import { useStreak } from "@/hooks/useStreak";
import type { Resolution, Todo } from "@/types";
import { motion } from "framer-motion";
import { Flame, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function ResolveMainPage() {
  const streak = useStreak();
  const [activeTab, setActiveTab] = useState<"momentum" | "vault">("momentum");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
  // FIXED: Initialize from localStorage
  const [isDarkMomentum, setIsDarkMomentum] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("momentumTheme");
      return saved === "true";
    }
    return false;
  });

  const [todos, setTodos] = useState<Todo[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [greeting, setGreeting] = useState("Good Morning");
  const [settings, setSettings] = useState({ vaultUnlocked: false });

  const isVault = activeTab === "vault";
  const isDarkTheme = isVault || isDarkMomentum;

  // FIXED: Save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem("momentumTheme", String(isDarkMomentum));
  }, [isDarkMomentum]);

  const lockVault = () => setSettings({ ...settings, vaultUnlocked: false });

  const unlockVault = () => {
    setSettings({ ...settings, vaultUnlocked: true });
  };

  const handleTabChange = (tab: "momentum" | "vault") => {
    if (tab === "vault" && !settings.vaultUnlocked) {
      setIsAuthDialogOpen(true);
      return;
    }
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleUnlock = () => {
    unlockVault();
    setActiveTab("vault");
  };

  const toggleMomentumTheme = () => {
    setIsDarkMomentum(!isDarkMomentum);
  };

  // Set accurate time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isDarkTheme ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isUnlocked={settings.vaultUnlocked}
          onLock={lockVault}
          isVault={isVault}
          isDarkMomentum={isDarkMomentum}
        />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className={`w-64 p-0 ${
            isDarkTheme ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="h-full flex flex-col">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              isUnlocked={settings.vaultUnlocked}
              onLock={lockVault}
              isVault={isVault}
              isDarkMomentum={isDarkMomentum}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Auth Dialog */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        onUnlock={handleUnlock}
      />

      <main className="flex-1 lg:pl-64">
        {/* Animated Mobile Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b backdrop-blur-xl transition-all duration-300 ${
            isDarkTheme
              ? "bg-zinc-950/80 border-zinc-800/60"
              : "bg-white/80 border-zinc-200/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className={`rounded-full ${
                isDarkTheme ? "hover:bg-zinc-900 text-zinc-100" : "hover:bg-zinc-100 text-zinc-900"
              }`}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-sm tracking-tight flex items-center gap-2"
            >
              RESOLVE
            </motion.span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Mobile Navbar */}
             {!isVault && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMomentumTheme}
                className={`rounded-full ${
                  isDarkTheme ? "hover:bg-zinc-900 text-blue-400" : "hover:bg-zinc-100 text-zinc-600"
                }`}
              >
                {isDarkMomentum ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}

             {!isVault && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                    <Badge
                    variant="outline"
                    className={`flex items-center gap-1 h-8 px-2.5 rounded-full font-medium transition-all ${
                      isDarkMomentum
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                        : "bg-orange-50 border-orange-200 text-orange-600"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span className="text-xs">{streak}</span>
                  </Badge>
                </motion.div>
             )}
          </div>
        </motion.div>

        <div className="p-6 md:p-10">
          <header className="mb-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Greeting hidden on mobile (block only on md and up) */}
                <h1 className="hidden md:block text-3xl font-bold">
                  {greeting}, dikie
                </h1>
                
                {/* Streak badge - visible on desktop here, moved to navbar on mobile */}
                {!isVault && (
                  <Badge
                    variant="outline"
                    className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                      isDarkMomentum
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                        : "bg-orange-50 border-orange-200 text-orange-600"
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span className="text-sm">
                      {streak} day{streak !== 1 ? "s" : ""}
                    </span>
                  </Badge>
                )}
              </div>
              <p
                className={`text-sm mt-1 ${
                  isDarkTheme ? "text-zinc-500" : "text-zinc-500"
                }`}
              >
              </p>
            </div>

            {/* Theme Toggle for Momentum - Hidden on Mobile */}
            {!isVault && (
              <Button
                onClick={toggleMomentumTheme}
                variant="outline"
                size="icon"
                className={`hidden lg:flex rounded-xl transition-all ${
                  isDarkMomentum
                    ? "bg-zinc-900 border-zinc-800 text-blue-400 hover:bg-zinc-800"
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {isDarkMomentum ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}
          </header>

          {activeTab === "momentum" ? (
            <Momentum
              todos={todos}
              setTodos={setTodos}
              isDarkTheme={isDarkMomentum}
            />
          ) : (
            <Resolutions
              resolutions={resolutions}
              setResolutions={setResolutions}
            />
          )}
        </div>
      </main>
      <Toaster richColors />
    </div>
  );
}