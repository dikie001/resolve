import { ResolutionCard } from "@/components/app/ResolutionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Category, Resolution } from "@/types";
import { Crown, Plus, Target, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Resolutions({ resolutions, setResolutions }: { resolutions: Resolution[]; setResolutions: (r: Resolution[]) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRes, setNewRes] = useState<Partial<Resolution>>({ category: "Personal", target: 100, unit: "%" });

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
    toast.success("Strategic Protocol Initialized");
  };

  const overallProgress = resolutions.length 
    ? Math.round((resolutions.reduce((acc, r) => acc + (r.current / r.target), 0) / resolutions.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Vault Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-zinc-950 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">2026 Archive</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter mb-1">THE VAULT</h1>
            <p className="text-sm font-medium opacity-80 mb-4">Long-term strategic objectives.</p>
            <Button onClick={() => setIsDialogOpen(true)} size="sm" className="bg-zinc-950 text-amber-500 hover:bg-zinc-900 border-none font-bold">
              <Plus className="w-4 h-4 mr-2" /> NEW PROTOCOL
            </Button>
          </div>
          <Target className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white opacity-10 rotate-12" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Global Completion</span>
          <div>
            <div className="text-3xl font-black text-white">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-1 bg-zinc-800 mt-2" indicatorClassName="bg-amber-500" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Sealed Goals</span>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-black text-white">
              {resolutions.filter(r => r.current >= r.target).length}
            </div>
            <Trophy className="w-8 h-8 text-emerald-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Resolutions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resolutions.map((res) => (
          <ResolutionCard 
            key={res.id} 
            resolution={res} 
            onDelete={(id) => setResolutions(resolutions.filter(r => r.id !== id))}
            onIncrement={(id) => setResolutions(resolutions.map(r => r.id === id ? { ...r, current: Math.min(r.current + 1, r.target) } : r))}
          />
        ))}
        
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="border-2 border-dashed border-zinc-800 rounded-xl p-6 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center min-h-[180px] group"
        >
          <Plus className="w-8 h-8 text-zinc-700 group-hover:text-amber-500 mb-2" />
          <span className="text-xs font-bold text-zinc-600 group-hover:text-amber-500 uppercase">Add Objective</span>
        </button>
      </div>

      {/* New Resolution Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-amber-500 italic">NEW PROTOCOL</DialogTitle>
            <DialogDescription className="text-zinc-500">Define the parameters for your long-term objective.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Title</label>
              <Input value={newRes.title || ""} onChange={(e) => setNewRes({...newRes, title: e.target.value})} className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Target</label>
                <Input type="number" value={newRes.target} onChange={(e) => setNewRes({...newRes, target: Number(e.target.value)})} className="bg-zinc-900 border-zinc-800" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Unit</label>
                <Input value={newRes.unit} onChange={(e) => setNewRes({...newRes, unit: e.target.value})} className="bg-zinc-900 border-zinc-800" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addResolution} className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold">INITIATE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}