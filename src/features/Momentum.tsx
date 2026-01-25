import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Circle, Trash2, Flame, Target } from "lucide-react";
import { toast } from "sonner";
import type { Priority, Todo } from "@/types";

export function Momentum({ todos, setTodos }: { todos: Todo[]; setTodos: (t: Todo[]) => void }) {
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
    toast.success("Task added to momentum engine");
  };

  const toggleTodo = (id: string) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  const progress = todos.length ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-700 to-indigo-900 border-none text-white overflow-hidden relative">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Current Velocity</p>
              <h2 className="text-4xl font-black">{progress}%</h2>
            </div>
            <Target className="w-12 h-12 text-blue-300 opacity-50" />
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Streak</span>
            </div>
            <p className="text-3xl font-black text-zinc-900">12 Days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm">
        <Input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="New objective..." 
          className="border-none focus-visible:ring-0 text-base"
        />
        <div className="flex gap-2">
          <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
            <SelectTrigger className="w-32 border-zinc-200"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
          </Select>
          <Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">Add</Button>
        </div>
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="group flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-lg hover:border-blue-300 transition-all">
            <div className="flex items-center gap-4">
              <button onClick={() => toggleTodo(todo.id)} className={todo.completed ? "text-blue-500" : "text-zinc-300 hover:text-blue-400"}>
                {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <div>
                <p className={`font-medium ${todo.completed ? "line-through text-zinc-400" : "text-zinc-900"}`}>{todo.text}</p>
                <Badge variant="outline" className="text-[9px] h-4 mt-1 uppercase border-blue-100 text-blue-600">{todo.priority}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 h-8 w-8 text-zinc-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}