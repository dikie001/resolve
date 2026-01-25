import { Sidebar } from "@/components/app/Sidebar";
import { Button } from "@/components/ui/button";
import { Momentum } from "@/features/Momentum";
import { Resolutions } from "@/features/Resolutions";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";

// Combined Imports...
export default function ResolveMainPage() {
  const [activeTab, setActiveTab] = useState<"momentum" | "vault">("momentum");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isVault = activeTab === "vault";
  const [todos, setTodos] = useState([]);
  const [resolutions, setResolutions] = useState([]);
  const [settings, setSettings] = useState({ vaultUnlocked: false });
  const lockVault = () => setSettings({ ...settings, vaultUnlocked: false });

  return (
    <div className={`flex min-h-screen ${isVault ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"}`}>
      {/* Sidebar - Hidden on mobile, handled by drawer */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isUnlocked={settings.vaultUnlocked} onLock={lockVault} isVault={isVault} />
      </div>

      <main className="flex-1 lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-inherit">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}><Menu className="w-5 h-5" /></Button>
          <span className="font-bold text-sm">DIKIE OS</span>
          <div className="w-8" />
        </div>

        <div className="p-6 md:p-10">
          <header className="mb-10">
            <h1 className="text-2xl font-bold">Good Morning, dikie</h1>
            <p className="text-zinc-500 text-sm">System status: Optimal. Ready for session.</p>
          </header>

          {activeTab === "momentum" ? (
             <Momentum todos={todos} setTodos={setTodos} />
          ) : (
             <Resolutions resolutions={resolutions} setResolutions={setResolutions} />
          )}
        </div>
      </main>
      <Toaster richColors />
    </div>
  );
}