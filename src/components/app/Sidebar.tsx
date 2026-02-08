import { Zap, ListTodo, Lock, ShieldCheck, LogOut, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: "momentum" | "vault") => void;
  isUnlocked: boolean;
  onLock: () => void;
  isVault: boolean;
  isDarkMomentum?: boolean;
}

export function Sidebar({ activeTab, setActiveTab, isUnlocked, onLock, isVault, isDarkMomentum = false }: SidebarProps) {
  const navItems = [
    { id: "momentum", label: "Momentum", icon: ListTodo },
    { id: "vault", label: "Resolution", icon: isUnlocked ? ShieldCheck : Lock },
  ];

  // Determine theme based on context
  const isDarkTheme = isVault || isDarkMomentum;

  return (
    <aside className={`w-64 border-r flex flex-col fixed inset-y-0 z-50 transition-all duration-500 ${isDarkTheme ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
      }`}>
      {/* Header */}
      <div className={`h-16 flex items-center px-6 border-b transition-colors ${isDarkTheme ? "border-zinc-800" : "border-zinc-200"
        }`}>
        <div className={`p-1.5 rounded-lg transition-colors ${isVault ? "bg-amber-500/10" : isDarkMomentum ? "bg-blue-500/10" : "bg-blue-50"
          }`}>
          <Zap className={`w-5 h-5 ${isVault ? "text-amber-500" : "text-blue-600"
            }`} />
        </div>
        <span className={`ml-3 font-bold tracking-tight transition-colors ${isDarkTheme ? "text-white" : "text-zinc-900"
          }`}>RESOLVE</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full justify-start gap-3 h-11 px-4 rounded-xl font-semibold transition-all duration-200 ${isActive
                  ? isVault
                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  : isDarkTheme
                    ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive && !isVault ? "animate-pulse" : ""}`} />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t space-y-3 transition-colors ${isDarkTheme ? "border-zinc-800" : "border-zinc-200"
        }`}>
        {isVault && isUnlocked && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLock}
            className="w-full border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 font-semibold rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" /> Resolutions
          </Button>
        )}

        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isDarkTheme ? "bg-zinc-900/50" : "bg-zinc-50"
          }`}>
          <Avatar className={`h-9 w-9 ring-2 transition-all ${isVault
              ? "ring-amber-500/20"
              : "ring-blue-500/20"
            }`}>
            <AvatarFallback className={`text-xs font-bold ${isVault
                ? "bg-linear-to-br from-amber-500 to-amber-600 text-black"
                : "bg-linear-to-br from-blue-600 to-blue-700 text-white"
              }`}>DO</AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <p className={`text-sm font-bold transition-colors ${isDarkTheme ? "text-white" : "text-zinc-900"
              }`}>dikie</p>
            <p className={`text-[10px] font-medium transition-colors ${isDarkTheme ? "text-zinc-500" : "text-zinc-400"
              }`}>Premium Tier</p>
          </div>
          {isDarkMomentum && (
            <Moon className="w-4 h-4 text-blue-500" />
          )}
        </div>
      </div>
    </aside>
  );
}