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
        // Reset form
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
            <DialogContent className={`rounded-[1.5rem] md:rounded-[2rem] w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto ${isDarkTheme ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200"}`}>
                <DialogHeader>
                    <DialogTitle className={`text-2xl font-black ${isDarkTheme ? "text-white" : "text-zinc-900"}`}>
                        Create New Task
                    </DialogTitle>
                    <DialogDescription className={`${isDarkTheme ? "text-zinc-500" : "text-zinc-500"}`}>
                        Add a new task to your momentum engine
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4" onKeyDown={handleKeyDown}>
                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                            Title *
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className={`h-12 border-none rounded-xl ${isDarkTheme ? "bg-zinc-900 text-white placeholder:text-zinc-600" : "bg-zinc-50 text-zinc-900"}`}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                            Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details (optional)..."
                            className={`min-h-[100px] border-none rounded-xl resize-none ${isDarkTheme ? "bg-zinc-900 text-white placeholder:text-zinc-600" : "bg-zinc-50 text-zinc-900"}`}
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                                Priority
                            </label>
                            <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                                <SelectTrigger className={`h-12 border-none rounded-xl ${isDarkTheme ? "bg-zinc-900 text-white" : "bg-zinc-50"}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-900 border-zinc-800" : "border-zinc-200"}`}>
                                    <SelectItem value="High" className="text-red-600 font-bold">High</SelectItem>
                                    <SelectItem value="Medium" className="text-blue-600 font-bold">Medium</SelectItem>
                                    <SelectItem value="Low" className={`font-bold ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                                Category
                            </label>
                            <Select value={category} onValueChange={(v: TodoCategory) => setCategory(v)}>
                                <SelectTrigger className={`h-12 border-none rounded-xl ${isDarkTheme ? "bg-zinc-900 text-white" : "bg-zinc-50"}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={`rounded-xl ${isDarkTheme ? "bg-zinc-900 border-zinc-800" : "border-zinc-200"}`}>
                                    <SelectItem value="Work">Work</SelectItem>
                                    <SelectItem value="Personal">Personal</SelectItem>
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Learning">Learning</SelectItem>
                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <p className={`text-xs ${isDarkTheme ? "text-zinc-600" : "text-zinc-400"}`}>
                        Press Ctrl+Enter or Cmd+Enter to create task
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className={`rounded-xl ${isDarkTheme ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900" : ""}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
