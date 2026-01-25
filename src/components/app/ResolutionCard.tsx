import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";
import type { Resolution } from "@/types";

interface Props {
  resolution: Resolution;
  onDelete: (id: string) => void;
  onIncrement: (id: string) => void;
}

export function ResolutionCard({ resolution, onDelete, onIncrement }: Props) {
  const percent = Math.round((resolution.current / resolution.target) * 100);

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/30 transition-all duration-300 group">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-[9px] font-bold border-zinc-800 text-zinc-500 uppercase">{resolution.category}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600"><MoreVertical className="w-3 h-3" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuItem onClick={() => onDelete(resolution.id)} className="text-red-400">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-base font-bold text-zinc-200 mt-2 truncate">{resolution.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-black text-white italic">{resolution.current}<span className="text-[10px] not-italic text-amber-500 ml-1">{resolution.unit}</span></span>
          <span className="text-[10px] font-mono text-zinc-600">GOAL: {resolution.target}</span>
        </div>
        <Progress value={percent} className="h-1 bg-zinc-950" indicatorClassName="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onIncrement(resolution.id)} 
          className="w-full h-8 bg-zinc-950 hover:bg-amber-500 hover:text-black border border-zinc-800 text-zinc-500 font-bold text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> PROGRESS
        </Button>
      </CardFooter>
    </Card>
  );
}