import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Priority, TodoCategory } from "@/types";

interface AddTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (title: string, description: string, priority: Priority, category: TodoCategory) => void;
  isDarkTheme?: boolean;
}

export function AddTodoDialog({ open, onOpenChange, onAdd, isDarkTheme = false }: AddTodoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [category, setCategory] = useState<TodoCategory>("Personal");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title, description, priority, category);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-[90vw] max-w-[500px] p-4 md:p-6 gap-4 md:gap-6 rounded-2xl md:rounded-3xl border shadow-2xl ${isDarkTheme ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200"}`}>
        <DialogHeader className="space-y-1 md:space-y-2 text-left">
          <DialogTitle className={`text-xl md:text-2xl font-black tracking-tight ${isDarkTheme ? "text-white" : "text-zinc-900"}`}>
            New Task
          </DialogTitle>
          <DialogDescription className={`text-xs md:text-sm ${isDarkTheme ? "text-zinc-500" : "text-zinc-500"}`}>
            Add a new task to your list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 py-1" onKeyDown={handleKeyDown}>
          <div className="space-y-1.5 md:space-y-2">
            <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={`h-10 md:h-12 text-sm px-3 md:px-4 rounded-lg md:rounded-xl border ${isDarkTheme ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700" : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-300"}`}
              autoFocus
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)..."
              className={`min-h-[80px] md:min-h-[100px] text-sm rounded-lg md:rounded-xl resize-none px-3 md:px-4 py-3 border ${isDarkTheme ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700" : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-300"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>
                Priority
              </label>
              <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                <SelectTrigger className={`h-10 md:h-12 text-xs md:text-sm px-3 md:px-4 rounded-lg md:rounded-xl border ${isDarkTheme ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <SelectItem value="High" className="text-red-600 font-bold text-xs md:text-sm">High</SelectItem>
                  <SelectItem value="Medium" className="text-blue-600 font-bold text-xs md:text-sm">Medium</SelectItem>
                  <SelectItem value="Low" className={`font-bold text-xs md:text-sm ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-700"}`}>
                Category
              </label>
              <Select value={category} onValueChange={(v: TodoCategory) => setCategory(v)}>
                <SelectTrigger className={`h-10 md:h-12 text-xs md:text-sm px-3 md:px-4 rounded-lg md:rounded-xl border ${isDarkTheme ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <SelectItem value="Work" className="text-xs md:text-sm">Work</SelectItem>
                  <SelectItem value="Personal" className="text-xs md:text-sm">Personal</SelectItem>
                  <SelectItem value="Health" className="text-xs md:text-sm">Health</SelectItem>
                  <SelectItem value="Learning" className="text-xs md:text-sm">Learning</SelectItem>
                  <SelectItem value="Shopping" className="text-xs md:text-sm">Shopping</SelectItem>
                  <SelectItem value="Other" className="text-xs md:text-sm">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className={`flex-1 sm:flex-none h-10 md:h-12 rounded-lg md:rounded-xl border ${isDarkTheme ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-xl h-10 md:h-12 px-4 md:px-6 font-bold disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}