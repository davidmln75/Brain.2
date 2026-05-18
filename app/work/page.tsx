"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAppStore } from "@/lib/store";
import type { Task, TaskLevel, TaskRecurrence, TaskLabel } from "@/types/database";

const LABEL_COLORS: Record<TaskLabel, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
};

const LABEL_NAMES: Record<TaskLabel, string> = {
  red: "Podcast",
  blue: "Universal",
  yellow: "Autre",
};

const LEVEL_XP: Record<TaskLevel, number> = { 1: 100, 2: 75, 3: 50 };

export default function WorkPage() {
  const { tasks, loadAll, addTask, completeTask, deleteTask } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<TaskLevel>(1);
  const [recurrence, setRecurrence] = useState<TaskRecurrence>("oneshot");
  const [label, setLabel] = useState<TaskLabel>("yellow");

  useEffect(() => { loadAll(); }, [loadAll]);

  const workTasks = tasks.filter((t) => t.category === "work");
  const active = workTasks.filter((t) => !t.completed);
  const completed = workTasks.filter((t) => t.completed);

  // Purge completed tasks older than 14 days (client-side check)
  const validCompleted = completed.filter((t) => {
    if (!t.completed_at) return false;
    const diff = Date.now() - new Date(t.completed_at).getTime();
    return diff < 14 * 24 * 60 * 60 * 1000;
  });

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTask({ title: title.trim(), level, recurrence, label, category: "work" });
    setTitle("");
    setLevel(1);
    setRecurrence("oneshot");
    setLabel("yellow");
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="work" />

      <div className="flex-1 px-4 py-5 space-y-3 overflow-y-auto pb-32">
        {active.length === 0 && (
          <div className="flex flex-col items-center mt-16 gap-4">
            <p className="text-5xl">🧠</p>
            <p className="text-gray-400 text-sm font-medium text-center">Aucune tâche pour l'instant.<br/>Tape <strong>+</strong> pour en ajouter une.</p>
          </div>
        )}
        {active.map((task) => (
          <TaskItem key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} />
        ))}

        {validCompleted.length > 0 && (
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full text-left text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 py-2"
          >
            Terminées ({validCompleted.length}) {showCompleted ? "▲" : "▼"}
          </button>
        )}
        {showCompleted && validCompleted.map((task) => (
          <TaskItem key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} done />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full text-white flex items-center justify-center active:scale-90 transition-transform z-40"
        style={{ backgroundColor: "#FF4500", boxShadow: "0 4px 24px rgba(255,69,0,0.5)", fontSize: "2rem", lineHeight: "1", paddingBottom: "2px" }}
      >
        +
      </button>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowAdd(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-black">Nouvelle tâche</h2>

            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              className="w-full border-b-2 border-black py-2 text-base font-medium outline-none"
            />

            {/* Level */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Niveau</p>
              <div className="flex gap-2">
                {([1, 2, 3] as TaskLevel[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-sm border-2 transition-all ${level === l ? "text-white border-[#FF4500]" : "border-gray-200 text-gray-600"}`} style={level === l ? { backgroundColor: "#FF4500" } : {}}
                  >
                    N{l} <span className="text-xs font-normal">+{LEVEL_XP[l]}XP</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Récurrence</p>
              <div className="flex gap-2">
                {(["oneshot", "daily", "weekly"] as TaskRecurrence[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRecurrence(r)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs border-2 transition-all ${recurrence === r ? "text-white border-[#FF4500]" : "border-gray-200 text-gray-600"}`} style={recurrence === r ? { backgroundColor: "#FF4500" } : {}}
                  >
                    {r === "oneshot" ? "One shot" : r === "daily" ? "Quotidien" : "Hebdo"}
                  </button>
                ))}
              </div>
            </div>

            {/* Label */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Label</p>
              <div className="flex gap-2">
                {(["red", "blue", "yellow"] as TaskLabel[]).map((lb) => (
                  <button
                    key={lb}
                    onClick={() => setLabel(lb)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-1.5"
                    style={label === lb ? { borderColor: "#FF4500", backgroundColor: "#fff5f2", color: "#FF4500" } : { borderColor: "#e5e7eb", color: "#4b5563" }}
                  >
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${LABEL_COLORS[lb]}`} />
                    {LABEL_NAMES[lb]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full py-4 font-black text-base rounded-2xl disabled:opacity-40 active:scale-95 transition-transform text-white"
              style={{ backgroundColor: "#FF4500" }}
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onComplete, onDelete, done }: {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  done?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${done ? "border-gray-100 opacity-50" : "border-gray-100"}`}>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${done ? "line-through text-gray-400" : ""}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${LABEL_COLORS[task.label]}`} />
          <span className="text-xs text-gray-400">N{task.level}</span>
          {task.recurrence !== "oneshot" && (
            <span className="text-xs text-gray-400">• {task.recurrence === "daily" ? "quotidien" : "hebdo"}</span>
          )}
          {!done && <span className="text-xs font-bold ml-auto" style={{ color: "#FF4500" }}>+{LEVEL_XP[task.level as TaskLevel]}XP</span>}
        </div>
      </div>

      {!done && (
        <button
          onClick={() => onComplete(task.id)}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black text-white active:scale-95 transition-transform"
          style={{ backgroundColor: "#FF4500" }}
        >
          ✓ Fait
        </button>
      )}

      {done && (
        <span className="text-xs font-bold text-gray-400">✓</span>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="w-6 h-6 flex items-center justify-center text-gray-300 active:text-red-500 text-lg flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}
