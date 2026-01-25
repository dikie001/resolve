import { Zap, ListTodo, Lock, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: "momentum" | "vault") => void;
  isUnlocked: boolean;
  onLock: () => void;
  isVault: boolean;
}

export function Sidebar({ activeTab, setActiveTab, isUnlocked, onLock, isVault }: SidebarProps) {
  const navItems = [
    { id: "momentum", label: "Momentum", icon: ListTodo },
    { id: "vault", label: "The Vault", icon: isUnlocked ? ShieldCheck : Lock },
  ];

  return (
    <aside className={`w-64 border-r flex flex-col fixed inset-y-0 z-50 transition-colors duration-500 ${isVault ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`}>
      <div className="h-16 flex items-center px-6 border-b border-inherit">
        <Zap className={`w-5 h-5 mr-3 ${isVault ? "text-amber-500" : "text-blue-600"}`} />
        <span className={`font-bold tracking-tight ${isVault ? "text-white" : "text-zinc-900"}`}>DIKIE OS</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full justify-start gap-3 h-10 px-3 ${activeTab === item.id ? (isVault ? "bg-amber-500/10 text-amber-500" : "bg-blue-50 text-blue-700") : "text-zinc-500"}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t border-inherit space-y-3">
        {isVault && isUnlocked && (
          <Button variant="outline" size="sm" onClick={onLock} className="w-full border-zinc-800 text-zinc-400 hover:text-red-400">
            <LogOut className="w-3 h-3 mr-2" /> Lock
          </Button>
        )}
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-8 w-8 ring-2 ring-blue-500/10">
            <AvatarFallback className="bg-blue-600 text-white text-xs">DO</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className={`text-xs font-bold ${isVault ? "text-white" : "text-zinc-900"}`}>dikie</p>
            <p className="text-[10px] text-zinc-500">Premium Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}