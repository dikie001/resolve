import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Resolution } from "@/types";
import {
  CheckCircle2,
  MoreVertical,
  MousePointerClick,
  Trash2,
  Trophy,
} from "lucide-react";

interface Props {
  resolution: Resolution;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function ResolutionCard({ resolution, onDelete, onComplete }: Props) {
  const isCompleted = resolution.current >= resolution.target;

  return (
    <Dialog>
      <Card
        className={`
          group relative border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col justify-between h-auto min-h-[160px] w-full
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

        {/* Card Header with Badge and Quick Actions */}
        <div className="p-6 pb-2 relative z-20 flex justify-between items-start gap-2">
          <Badge
            variant="outline"
            className={`text-[9px] font-black uppercase tracking-widest border border-white/5 py-1 px-2.5 rounded-lg shrink-0 ${
              isCompleted
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-zinc-500 bg-black/20"
            }`}
          >
            {resolution.category}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 -mt-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-950 border-zinc-800 text-zinc-400 rounded-xl min-w-[160px]"
            >
              {!isCompleted && (
                <DropdownMenuItem
                  onClick={() => onComplete(resolution.id)}
                  className="text-emerald-500 focus:text-emerald-400 focus:bg-emerald-500/10 cursor-pointer font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(resolution.id)}
                className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Clickable Area for Dialog */}
        <DialogTrigger asChild>
          <div className="flex-1 flex flex-col cursor-pointer p-6 pt-2 relative z-10 w-full min-w-0">
            {/* Added break-words and line-clamp to ensure card shape stays consistent */}
            <CardTitle
              className={`text-xl font-bold leading-tight break-words line-clamp-3 mb-auto ${
                isCompleted
                  ? "text-emerald-500/50 line-through decoration-emerald-500/30"
                  : "text-zinc-100 group-hover:text-amber-500 transition-colors"
              }`}
            >
              {resolution.title}
            </CardTitle>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
              {isCompleted ? (
                <span className="text-emerald-500 flex items-center">
                  <Trophy className="w-3 h-3 mr-1.5" /> Sealed
                </span>
              ) : (
                <span className="flex items-center">
                  <MousePointerClick className="w-3 h-3 mr-1.5 opacity-50" />{" "}
                  Details
                </span>
              )}
            </div>
          </div>
        </DialogTrigger>
      </Card>

      {/* Responsive Dialog Fixes:
         1. w-[95vw]: Forces width to fit mobile screen.
         2. max-h-[85vh]: Prevents vertical overflow off-screen.
         3. overflow-hidden (on content) + overflow-y-auto (on scroll area): Ensures header sticks, body scrolls.
      */}
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[2rem] w-[95vw] sm:max-w-[480px] max-h-[85vh] p-0 gap-0 outline-none flex flex-col overflow-hidden">
        
        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 sm:p-8 pb-4 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-white/5">
            <DialogHeader className="space-y-4 text-left w-full">
              <div className="flex items-center justify-between w-full">
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1"
                >
                  {resolution.category}
                </Badge>
                {isCompleted ? (
                  <span className="flex items-center text-emerald-500 font-bold text-xs uppercase tracking-widest shrink-0 ml-2">
                    <Trophy className="w-4 h-4 mr-2" /> Complete
                  </span>
                ) : (
                  <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest shrink-0 ml-2">
                    In Progress
                  </span>
                )}
              </div>
              
              {/* Title Fixes:
                 1. w-full: Takes full width.
                 2. break-words: Breaks long sentences.
                 3. whitespace-normal: Wraps text normally.
                 4. min-w-0: Allows shrinking in flex context (prevents overflow).
              */}
              <DialogTitle className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white leading-tight break-words whitespace-normal w-full min-w-0">
                {resolution.title}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 sm:p-8 pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                  Target
                </span>
                <span className="text-xl font-black text-white break-all">
                  {resolution.target} {resolution.unit}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                  Status
                </span>
                <span
                  className={`text-xl font-black ${
                    isCompleted ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {isCompleted ? "100%" : "Pending"}
                </span>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:space-x-0 pt-4 pb-2">
              <Button
                variant="ghost"
                onClick={() => onDelete(resolution.id)}
                className="w-full sm:flex-1 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 h-12 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>

              {!isCompleted && (
                <DialogClose asChild>
                  <Button
                    onClick={() => onComplete(resolution.id)}
                    className="w-full sm:flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 rounded-xl shadow-lg shadow-emerald-900/20"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" /> MARK COMPLETE
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}