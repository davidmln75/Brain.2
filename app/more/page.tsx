"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAppStore } from "@/lib/store";
import type { Task, TaskLabel } from "@/types/database";

const LABEL_COLORS: Record<TaskLabel, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
};

export default function MorePage() {
  const { tasks, loadAll, addTask, completeTask, deleteTask } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState<TaskLabel>("yellow");

  useEffect(() => { loadAll(); }, [loadAll]);

  const moreTasks = tasks.filter((t) => t.category === "more");
  const active = moreTasks.filter((t) => !t.completed);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTask({ title: title.trim(), notes: null, level: 1, recurrence: "daily", label, category: "more" });
    setTitle("");
    setLabel("yellow");
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="more" />

      <div className="flex-1 px-4 py-5 space-y-3 overflow-y-auto pb-32">
        <p className="text-xs text-gray-400 font-medium text-center">Tâches secondaires — reset à minuit • +25 XP chacune</p>

        {active.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">Tout est fait ! 🎉</p>
        )}

        {active.map((task) => (
          <MoreTaskItem key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} />
        ))}

        {moreTasks.filter((t) => t.completed).length > 0 && (
          <p className="text-center text-xs text-green-500 font-bold mt-4">
            {moreTasks.filter((t) => t.completed).length} tâche(s) terminée(s) aujourd'hui ✓
          </p>
        )}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-6 w-16 h-16 rounded-full text-white text-4xl flex items-center justify-center active:scale-90 transition-transform z-40 font-black"
        style={{ backgroundColor: "#FF4500", boxShadow: "0 4px 24px rgba(255,69,0,0.5)" }}
      >
        +
      </button>

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

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Label</p>
              <div className="flex gap-2">
                {(["red", "blue", "yellow"] as TaskLabel[]).map((lb) => (
                  <button
                    key={lb}
                    onClick={() => setLabel(lb)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-1.5 ${label === lb ? "border-black" : "border-gray-200"}`}
                  >
                    <span className={`w-3 h-3 rounded-full ${LABEL_COLORS[lb]}`} />
                    {lb === "red" ? "Podcast" : lb === "blue" ? "Universal" : "Autre"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full py-4 bg-[#FF4500] text-white font-black text-base rounded-2xl disabled:opacity-40 active:scale-95 transition-transform"
            >
              Ajouter (+25 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MoreTaskItem({ task, onComplete, onDelete }: {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${task.completed ? "border-gray-100 opacity-50" : "border-gray-100"}`}>
      <button
        onClick={() => !task.completed && onComplete(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? "bg-black border-black" : "border-gray-300"}`}
      >
        {task.completed && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </button>

      <div className="flex-1">
        <p className={`font-semibold text-sm ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`w-2 h-2 rounded-full ${LABEL_COLORS[task.label]}`} />
          {!task.completed && <span className="text-xs text-[#FF4500] font-bold">+25 XP</span>}
        </div>
      </div>

      <button onClick={() => onDelete(task.id)} className="w-6 h-6 flex items-center justify-center text-gray-300 active:text-red-500 text-lg">×</button>
    </div>
  );
}
