"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAppStore } from "@/lib/store";

export default function FixPage() {
  const { stats, setStats, loadAll } = useAppStore();
  const [xp, setXp] = useState("");
  const [hearts, setHearts] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (stats) {
      setXp(String(stats.xp));
      setHearts(String(stats.hearts));
    }
  }, [stats]);

  const handleSave = async () => {
    const newXp = parseInt(xp);
    const newHearts = parseInt(hearts);
    if (isNaN(newXp) || isNaN(newHearts)) return;
    await setStats(newXp, newHearts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="fix" />

      <div className="flex-1 px-4 py-8 space-y-6 max-w-sm mx-auto w-full">
        <p className="text-xs text-gray-400 text-center font-medium">
          Modifie manuellement les compteurs en cas d'erreur
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">XP</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setXp(String((parseInt(xp) || 0) - 25))}
                className="w-12 h-12 rounded-2xl border-2 border-gray-200 text-xl font-black flex items-center justify-center active:scale-90 transition-transform"
              >−</button>
              <input
                type="number"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
                className="flex-1 text-center text-3xl font-black border-b-2 border-black outline-none py-2"
                inputMode="numeric"
              />
              <button
                onClick={() => setXp(String((parseInt(xp) || 0) + 25))}
                className="w-12 h-12 rounded-2xl text-white text-xl font-black flex items-center justify-center active:scale-90 transition-transform"
                style={{ backgroundColor: "#FF4500" }}
              >+</button>
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">❤️</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHearts(String((parseInt(hearts) || 0) - 25))}
                className="w-12 h-12 rounded-2xl border-2 border-gray-200 text-xl font-black flex items-center justify-center active:scale-90 transition-transform"
              >−</button>
              <input
                type="number"
                value={hearts}
                onChange={(e) => setHearts(e.target.value)}
                className="flex-1 text-center text-3xl font-black border-b-2 border-black outline-none py-2"
                inputMode="numeric"
              />
              <button
                onClick={() => setHearts(String((parseInt(hearts) || 0) + 25))}
                className="w-12 h-12 rounded-2xl text-white text-xl font-black flex items-center justify-center active:scale-90 transition-transform"
                style={{ backgroundColor: "#FF4500" }}
              >+</button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 font-black text-base rounded-2xl text-white transition-all active:scale-95"
          style={{ backgroundColor: saved ? "#22c55e" : "#FF4500" }}
        >
          {saved ? "✓ Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
