import { Sidebar } from "@/components/app/Sidebar";
import { AuthDialog } from "@/components/app/AuthDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Momentum } from "@/features/Momentum";
import { Resolutions } from "@/features/Resolutions";
import { Menu, Moon, Sun, Flame } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import type { Todo, Resolution } from "@/types";
import { useStreak } from "@/hooks/useStreak";

export default function ResolveMainPage() {
  const streak = useStreak();
  const [activeTab, setActiveTab] = useState<"momentum" | "vault">("momentum");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isDarkMomentum, setIsDarkMomentum] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);

  const [settings, setSettings] = useState({ vaultUnlocked: false });

  const isVault = activeTab === "vault";
  const isDarkTheme = isVault || isDarkMomentum;

  const lockVault = () => setSettings({ ...settings, vaultUnlocked: false });

  const unlockVault = () => {
    setSettings({ ...settings, vaultUnlocked: true });
  };

  const handleTabChange = (tab: "momentum" | "vault") => {
    // If trying to access vault while locked, show auth dialog
    if (tab === "vault" && !settings.vaultUnlocked) {
      setIsAuthDialogOpen(true);
      return;
    }
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close mobile menu when tab changes
  };

  const handleUnlock = () => {
    unlockVault();
    setActiveTab("vault");
  };

  const toggleMomentumTheme = () => {
    setIsDarkMomentum(!isDarkMomentum);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${isDarkTheme ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
      }`}>
      {/* Desktop Sidebar - Hidden on mobile */}
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
          className={`w-64 p-0 ${isDarkTheme ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`}
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
        {/* Mobile Header */}
        <div className={`lg:hidden flex items-center justify-between p-4 border-b transition-colors ${isDarkTheme ? "border-zinc-800" : "border-zinc-200"
          }`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className={`${isDarkTheme ? "hover:bg-zinc-900" : "hover:bg-zinc-100"}`}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-bold text-sm">DIKIE OS</span>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-10">
          <header className="mb-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">Good Morning, dikie</h1>
                {!isVault && (
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${isDarkMomentum
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                        : "bg-orange-50 border-orange-200 text-orange-600"
                      }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span className="text-sm">{streak} day{streak !== 1 ? 's' : ''}</span>
                  </Badge>
                )}
              </div>
              <p className={`text-sm mt-1 ${isDarkTheme ? "text-zinc-500" : "text-zinc-500"}`}>
                System status: Optimal. Ready for session.
              </p>
            </div>

            {/* Theme Toggle for Momentum */}
            {!isVault && (
              <Button
                onClick={toggleMomentumTheme}
                variant="outline"
                size="icon"
                className={`rounded-xl transition-all ${isDarkMomentum
                  ? "bg-zinc-900 border-zinc-800 text-blue-400 hover:bg-zinc-800"
                  : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {isDarkMomentum ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
          </header>

          {activeTab === "momentum" ? (
            <Momentum todos={todos} setTodos={setTodos} isDarkTheme={isDarkMomentum} />
          ) : (
            <Resolutions resolutions={resolutions} setResolutions={setResolutions} />
          )}
        </div>
      </main>
      <Toaster richColors />
    </div>
  );
}
