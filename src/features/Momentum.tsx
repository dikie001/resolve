import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Flame,
  Target,
  Plus,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import type { Priority, Todo } from "@/types";

export function Momentum({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: (t: Todo[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      priority,
      dueDate: null,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
    toast.success("Momentum Engine Updated", {
      style: { background: "#2563eb", color: "#fff" },
    });
  };

  const toggleTodo = (id: string) =>
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  const deleteTodo = (id: string) => setTodos(todos.filter((t) => t.id !== id));

  const progress = todos.length
    ? Math.round(
        (todos.filter((t) => t.completed).length / todos.length) * 100
      )
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Velocity Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border-none text-white rounded-[2rem] shadow-2xl shadow-blue-900/20 overflow-hidden relative group">
          <CardContent className="p-8 flex justify-between items-center relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-white/10 rounded-md">
                  <Zap className="w-4 h-4 text-blue-200" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100/70">
                  Engine Performance
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic">
                {progress}% <span className="text-xl not-italic font-bold opacity-50 uppercase tracking-widest ml-2">Velocity</span>
              </h2>
              <p className="text-sm text-blue-100/60 font-medium">Daily task completion rate is optimal.</p>
            </div>
            <div className="relative h-24 w-24">
               <Target className="w-24 h-24 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 border-4 border-white/10 rounded-full border-t-white/40 animate-spin-slow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-xl rounded-[2rem] p-8 flex flex-col justify-between group hover:border-orange-500/20 transition-all">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <div className="p-2 bg-orange-50 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest ml-1">Daily Streak</span>
          </div>
          <div>
            <p className="text-4xl font-black text-zinc-900 italic tracking-tighter">12 <span className="text-sm not-italic font-bold text-zinc-400 uppercase ml-1">Days</span></p>
            <p className="text-[10px] font-mono text-zinc-400 mt-2">CONSISTENCY_LOCKED</p>
          </div>
        </Card>
      </div>

      {/* Modern Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-zinc-100/50 backdrop-blur-md p-3 rounded-[2rem] border border-zinc-200 shadow-inner">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Initialize new objective..."
            className="h-14 pl-6 text-lg bg-white border-none rounded-2xl shadow-sm focus-visible:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
            <SelectTrigger className="w-full sm:w-36 h-14 bg-white border-none rounded-2xl shadow-sm font-bold text-zinc-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-200">
              <SelectItem value="High" className="text-red-600 font-bold">High</SelectItem>
              <SelectItem value="Medium" className="text-blue-600 font-bold">Medium</SelectItem>
              <SelectItem value="Low" className="text-zinc-600 font-bold">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={addTodo} 
            className="h-14 w-14 sm:w-auto sm:px-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6 sm:hidden" />
            <span className="hidden sm:inline uppercase tracking-widest text-xs">Execute</span>
          </Button>
        </div>
      </div>

      {/* Objective Feed */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2.5rem]">
            <Zap className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest">System Idle</h3>
            <p className="text-sm text-zinc-400">Add a task to engage the momentum engine.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center justify-between p-5 transition-all duration-300 rounded-3xl border ${
                todo.completed
                  ? "bg-zinc-50/50 border-zinc-100 opacity-60"
                  : "bg-white border-zinc-200 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
              }`}
            >
              <div className="flex items-center gap-5">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`transition-all duration-500 transform active:scale-75 ${
                    todo.completed ? "text-blue-600" : "text-zinc-300 hover:text-blue-400"
                  }`}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-8 h-8 fill-blue-50" />
                  ) : (
                    <Circle className="w-8 h-8 stroke-[1.5px]" />
                  )}
                </button>
                <div className="space-y-1">
                  <p className={`text-lg font-bold tracking-tight transition-all ${
                    todo.completed ? "line-through text-zinc-400" : "text-zinc-900"
                  }`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0 border-none rounded-md ${
                        todo.priority === "High" ? "bg-red-50 text-red-600" :
                        todo.priority === "Medium" ? "bg-blue-50 text-blue-600" :
                        "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {todo.priority}
                    </Badge>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      ID: {todo.id.split('-')[0]}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 h-10 w-10 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}