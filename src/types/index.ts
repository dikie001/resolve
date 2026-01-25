export type Priority = "High" | "Medium" | "Low";
export type Category = "Personal" | "Coding" | "Finance" | "Health" | "Career";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
}

export interface Resolution {
  id: string;
  title: string;
  category: Category;
  target: number;
  current: number;
  unit: string;
}

export interface UserSettings {
  name: string;
  pin: string | null;
  vaultUnlocked: boolean;
}