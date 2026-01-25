import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Resolution } from "@/types";
import { CheckCircle2, Trash2, Trophy } from "lucide-react";

interface Props {
  resolution: Resolution;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function ResolutionCard({ resolution, onDelete, onComplete }: Props) {
  const isCompleted = resolution.current >= resolution.target;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={`
            group relative cursor-pointer border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 rounded-[2rem] overflow-hidden min-h-[180px] flex flex-col justify-between
            ${
              isCompleted
                ? "border-emerald-500/30 bg-emerald-950/10"
                : "hover:border-amber-500/50 hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/20"
            }
          `}
        >
          {/* Hover Gradient */}
          {!isCompleted && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}

          <CardHeader className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <Badge
                variant="outline"
                className={`text-[9px] font-black uppercase tracking-widest border border-white/5 py-1 px-2.5 rounded-lg ${
                  isCompleted
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-zinc-500 bg-black/20"
                }`}
              >
                {resolution.category}
              </Badge>
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <CardTitle
              className={`text-xl font-bold leading-tight ${
                isCompleted
                  ? "text-emerald-500/50 line-through decoration-emerald-500/30"
                  : "text-zinc-100"
              }`}
            >
              {resolution.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 pt-0 relative z-10">
            <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest group-hover:text-amber-500/70 transition-colors">
              {isCompleted ? "Protocol Sealed" : "Click to view details"}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* Expanded Detail View */}
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[2rem] sm:max-w-[500px] p-0 overflow-hidden gap-0">
        <div className="p-8 pb-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1"
              >
                {resolution.category}
              </Badge>
              {isCompleted ? (
                <span className="flex items-center text-emerald-500 font-bold text-xs uppercase tracking-widest">
                  <Trophy className="w-4 h-4 mr-2" /> Complete
                </span>
              ) : (
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                  In Progress
                </span>
              )}
            </div>
            <DialogTitle className="text-3xl font-black italic tracking-tighter text-white leading-tight">
              {resolution.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-8 pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                Target
              </span>
              <span className="text-xl font-black text-white">
                {resolution.target} {resolution.unit}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                Status
              </span>
              <span
                className={`text-xl font-black ${isCompleted ? "text-emerald-500" : "text-amber-500"}`}
              >
                {isCompleted ? "100%" : "Pending"}
              </span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 sm:space-x-0 pt-4">
            <Button
              variant="ghost"
              onClick={() => onDelete(resolution.id)}
              className="flex-1 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 h-14 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>

            {!isCompleted && (
              <DialogClose asChild>
                <Button
                  onClick={() => onComplete(resolution.id)}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black h-14 rounded-xl shadow-lg shadow-emerald-900/20"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> MARK COMPLETE
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
