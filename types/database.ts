export type TaskLevel = 1 | 2 | 3;
export type TaskRecurrence = "daily" | "weekly" | "oneshot";
export type TaskLabel = "red" | "blue" | "yellow";
export type TaskCategory = "work" | "more";
export type Currency = "xp" | "hearts";
export type ExerciseType = "yoga" | "running" | "indoor";

export interface Task {
  id: string;
  title: string;
  level: TaskLevel;
  recurrence: TaskRecurrence;
  label: TaskLabel;
  category: TaskCategory;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface CareTask {
  id: string;
  type: "water" | ExerciseType;
  completed: boolean;
  date: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  currency: Currency;
  created_at: string;
}

export interface UserStats {
  id: string;
  xp: number;
  hearts: number;
  updated_at: string;
}

// Minimal Database type — avoids Supabase Insert/Update conflicts
export interface Database {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>;
  };
}
