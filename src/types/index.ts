export type Priority = "High" | "Medium" | "Low";
export type Category = "Personal" | "Coding" | "Finance" | "Health" | "Career";
export type TodoCategory = "Work" | "Personal" | "Health" | "Learning" | "Shopping" | "Other";

export interface Todo {
  id: string;
  text: string;
  description?: string;
  category?: TodoCategory;
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