import { ResolutionCard } from "@/components/app/ResolutionCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Resolution } from "@/types";
import {
  Crown,
  Plus,
  Target,
  Trophy,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Resolutions({
  resolutions,
  setResolutions,
}: {
  resolutions: Resolution[];
  setResolutions: (r: Resolution[]) => void;
}) {
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
    };
    setResolutions([...resolutions, res]);
    setIsDialogOpen(false);
    setNewRes({ category: "Personal", target: 100, unit: "%" });
    toast.success("Strategic Protocol Initialized", {
      style: { background: "#f59e0b", color: "#000", fontWeight: "bold" },
    });
  };

  const markComplete = (id: string) => {
    setResolutions(
      resolutions.map((r) => (r.id === id ? { ...r, current: r.target } : r)),
    );
    toast.success("Objective Sealed", {
      description: "Protocol marked as 100% complete.",
      icon: <CheckCircle2 className="w-5 h-5 text-zinc-950" />,
      style: { background: "#10b981", color: "#09090b", fontWeight: "bold" },
    });
  };

  // Global Dashboard Logic (Hidden on cards, but visible in Hero)
  const overallProgress = resolutions.length
    ? Math.round(
        (resolutions.reduce(
          (acc, r) => acc + Math.min(r.current / r.target, 1),
          0,
        ) /
          resolutions.length) *
          100,
      )
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vault Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-[2rem] p-8 text-zinc-950 shadow-2xl shadow-amber-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-black/10 rounded-lg">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                Strategic Archive
              </span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter mb-2">
              THE 2026 VAULT
            </h1>
            <p className="text-sm font-medium text-black/70 max-w-[240px] mb-8">
              Securing high-level objectives and long-term performance metrics.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-zinc-950 text-amber-500 hover:bg-zinc-900 border-none font-bold rounded-xl px-6 h-12 shadow-xl active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" /> INITIATE PROTOCOL
            </Button>
          </div>
          <Target className="absolute right-[-30px] bottom-[-30px] w-56 h-56 text-black opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-[2rem] p-7 flex flex-col justify-between group hover:border-amber-500/20 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Global Completion
            </span>
            <ArrowUpRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">
              {overallProgress}%
            </div>
            <Progress
              value={overallProgress}
              className="h-1.5 bg-zinc-800"
              indicatorClassName="bg-amber-500"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-[2rem] p-7 flex flex-col justify-between group hover:border-emerald-500/20 transition-colors">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Sealed Goals
          </span>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-black text-white leading-none">
              {resolutions.filter((r) => r.current >= r.target).length}
              <span className="text-lg text-zinc-700 ml-2 font-normal not-italic">
                / {resolutions.length}
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Trophy className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Resolutions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resolutions.map((res) => (
          <ResolutionCard
            key={res.id}
            resolution={res}
            onDelete={(id) =>
              setResolutions(resolutions.filter((r) => r.id !== id))
            }
            onComplete={markComplete}
          />
        ))}

        <button
          onClick={() => setIsDialogOpen(true)}
          className="border-2 border-dashed border-zinc-800 rounded-[2rem] p-8 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center min-h-[180px] group"
        >
          <div className="p-4 bg-zinc-900 rounded-2xl group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-500 mb-4 shadow-xl">
            <Plus className="w-8 h-8 text-zinc-600 group-hover:text-amber-500" />
          </div>
          <span className="text-xs font-black text-zinc-500 group-hover:text-amber-500 uppercase tracking-widest">
            New Objective
          </span>
        </button>
      </div>

      {/* New Resolution Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/5 text-white rounded-[2rem] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-amber-500 italic tracking-tighter">
              NEW PROTOCOL
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Initialize a new long-term strategic objective.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Objective Title
              </label>
              <Input
                value={newRes.title || ""}
                onChange={(e) =>
                  setNewRes({ ...newRes, title: e.target.value })
                }
                className="bg-zinc-900 border-none h-12 rounded-xl focus-visible:ring-amber-500"
                placeholder="e.g. Master React Native"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Target
                </label>
                <Input
                  type="number"
                  value={newRes.target}
                  onChange={(e) =>
                    setNewRes({ ...newRes, target: Number(e.target.value) })
                  }
                  className="bg-zinc-900 border-none h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Unit
                </label>
                <Input
                  value={newRes.unit}
                  onChange={(e) =>
                    setNewRes({ ...newRes, unit: e.target.value })
                  }
                  className="bg-zinc-900 border-none h-12 rounded-xl"
                  placeholder="%"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Category
              </label>
              <Select
                value={newRes.category}
                onValueChange={(v) =>
                  setNewRes({ ...newRes, category: v as Category })
                }
              >
                <SelectTrigger className="bg-zinc-900 border-none h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl">
                  {["Personal", "Coding", "Finance", "Health", "Career"].map(
                    (cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black h-14 rounded-2xl transition-all shadow-lg shadow-amber-900/40"
            >
              CONFIRM PROTOCOL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
