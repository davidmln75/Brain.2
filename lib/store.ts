"use client";
import { create } from "zustand";
import { supabase } from "./supabase";
import type { Task, CareTask, Note, NoteFolder, ShopItem, UserStats } from "@/types/database";

interface AppState {
  stats: UserStats | null;
  tasks: Task[];
  careTasks: CareTask[];
  notes: Note[];
  folders: NoteFolder[];
  shopItems: ShopItem[];
  loading: boolean;

  // Actions
  loadAll: () => Promise<void>;
  updateStats: (delta: { xp?: number; hearts?: number }) => Promise<void>;

  // Tasks
  addTask: (task: Omit<Task, "id" | "created_at" | "completed" | "completed_at">) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Care
  completeCareTask: (id: string, reward: number) => Promise<void>;
  initCareTasks: () => Promise<void>;

  // Notes
  addFolder: (name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  addNote: (title: string, content: string, folderId: string | null) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  // Shop
  addShopItem: (name: string, cost: number, currency: "xp" | "hearts") => Promise<void>;
  deleteShopItem: (id: string) => Promise<void>;
  buyItem: (item: ShopItem) => Promise<void>;
}

const XP_REWARDS: Record<number, number> = { 1: 100, 2: 75, 3: 50 };
const MORE_XP = 25;

export const useAppStore = create<AppState>((set, get) => ({
  stats: null,
  tasks: [],
  careTasks: [],
  notes: [],
  folders: [],
  shopItems: [],
  loading: true,

  loadAll: async () => {
    set({ loading: true });
    const [stats, tasks, careTasks, notes, folders, shopItems] = await Promise.all([
      supabase.from("user_stats").select("*").single(),
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("care_tasks").select("*").eq("date", today()),
      supabase.from("notes").select("*").order("updated_at", { ascending: false }),
      supabase.from("note_folders").select("*").order("created_at"),
      supabase.from("shop_items").select("*").order("created_at"),
    ]);
    set({
      stats: stats.data ?? null,
      tasks: tasks.data ?? [],
      careTasks: careTasks.data ?? [],
      notes: notes.data ?? [],
      folders: folders.data ?? [],
      shopItems: shopItems.data ?? [],
      loading: false,
    });
  },

  updateStats: async ({ xp = 0, hearts = 0 }) => {
    const { stats } = get();
    if (!stats) return;
    const newXp = stats.xp + xp;
    const newHearts = stats.hearts + hearts;
    await supabase.from("user_stats").update({ xp: newXp, hearts: newHearts, updated_at: new Date().toISOString() }).eq("id", stats.id);
    set({ stats: { ...stats, xp: newXp, hearts: newHearts } });
  },

  addTask: async (taskData) => {
    const { data } = await supabase.from("tasks").insert({ ...taskData, completed: false, completed_at: null }).select().single();
    if (data) set((s) => ({ tasks: [data, ...s.tasks] }));
  },

  completeTask: async (id) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const xpReward = task.category === "work" ? XP_REWARDS[task.level] : MORE_XP;
    await supabase.from("tasks").update({ completed: true, completed_at: new Date().toISOString() }).eq("id", id);
    set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, completed: true, completed_at: new Date().toISOString() } : t) }));
    await get().updateStats({ xp: xpReward });
  },

  deleteTask: async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  initCareTasks: async () => {
    const todayStr = today();
    const { data: existing } = await supabase.from("care_tasks").select("*").eq("date", todayStr);
    if (existing && existing.length > 0) {
      set({ careTasks: existing });
      return;
    }
    // Create 4 water tasks for today
    const waterTasks = Array.from({ length: 4 }, () => ({ type: "water" as const, completed: false, date: todayStr }));
    const { data } = await supabase.from("care_tasks").insert(waterTasks).select();
    if (data) set({ careTasks: data });
  },

  completeCareTask: async (id, reward) => {
    await supabase.from("care_tasks").update({ completed: true }).eq("id", id);
    set((s) => ({ careTasks: s.careTasks.map((t) => t.id === id ? { ...t, completed: true } : t) }));
    await get().updateStats({ hearts: reward });
  },

  addFolder: async (name) => {
    const { data } = await supabase.from("note_folders").insert({ name }).select().single();
    if (data) set((s) => ({ folders: [...s.folders, data] }));
  },

  deleteFolder: async (id) => {
    await supabase.from("note_folders").delete().eq("id", id);
    set((s) => ({ folders: s.folders.filter((f) => f.id !== id) }));
  },

  addNote: async (title, content, folderId) => {
    const { data } = await supabase.from("notes").insert({ title, content, folder_id: folderId }).select().single();
    if (data) set((s) => ({ notes: [data, ...s.notes] }));
  },

  updateNote: async (id, title, content) => {
    const updated_at = new Date().toISOString();
    await supabase.from("notes").update({ title, content, updated_at }).eq("id", id);
    set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, title, content, updated_at } : n) }));
  },

  deleteNote: async (id) => {
    await supabase.from("notes").delete().eq("id", id);
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
  },

  addShopItem: async (name, cost, currency) => {
    const { data } = await supabase.from("shop_items").insert({ name, cost, currency }).select().single();
    if (data) set((s) => ({ shopItems: [...s.shopItems, data] }));
  },

  deleteShopItem: async (id) => {
    await supabase.from("shop_items").delete().eq("id", id);
    set((s) => ({ shopItems: s.shopItems.filter((i) => i.id !== id) }));
  },

  buyItem: async (item) => {
    const { stats } = get();
    if (!stats) return;
    if (item.currency === "xp" && stats.xp < item.cost) return;
    if (item.currency === "hearts" && stats.hearts < item.cost) return;
    const delta = item.currency === "xp" ? { xp: -item.cost } : { hearts: -item.cost };
    await get().updateStats(delta);
  },
}));

function today() {
  return new Date().toISOString().split("T")[0];
}
