"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAppStore } from "@/lib/store";
import type { ExerciseType } from "@/types/database";

const EXERCISE_REWARDS: Record<ExerciseType, number> = {
  yoga: 75,
  running: 100,
  indoor: 25,
};

const EXERCISE_LABELS: Record<ExerciseType, string> = {
  yoga: "🧘 Yoga",
  running: "🏃 Running",
  indoor: "🏠 Indoor",
};

interface Weather {
  temp: number;
  rain: boolean;
  description: string;
}

export default function CarePage() {
  const { careTasks, initCareTasks, completeCareTask, updateStats } = useAppStore();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [exerciseDone, setExerciseDone] = useState<ExerciseType | null>(null);

  useEffect(() => {
    initCareTasks();
    fetchWeather();
  }, [initCareTasks]);

  const fetchWeather = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
      );
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weathercode&timezone=auto`
      );
      const data = await res.json();
      const precip = data.current.precipitation ?? 0;
      const code = data.current.weathercode ?? 0;
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        rain: precip > 0.5 || code >= 51,
        description: getWeatherDesc(code, Math.round(data.current.temperature_2m)),
      });
    } catch {
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const waterTasks = careTasks.filter((t) => t.type === "water");
  const completedWater = waterTasks.filter((t) => t.completed).length;

  const handleExercise = async (type: ExerciseType) => {
    if (exerciseDone) return;
    setExerciseDone(type);
    await updateStats({ hearts: EXERCISE_REWARDS[type] });
  };

  const outdoorOk = weather ? !weather.rain && weather.temp >= 8 : false;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="care" />

      <div className="flex-1 px-4 py-5 space-y-6 pb-16">

        {/* Water section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black uppercase tracking-wide">💧 Hydratation</h2>
            <span className="text-sm font-bold text-gray-400">{completedWater}/4</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {waterTasks.map((task, i) => (
              <button
                key={task.id}
                onClick={() => !task.completed && completeCareTask(task.id, 25)}
                disabled={task.completed}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  task.completed
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-200"
                }`}
              >
                <span className="text-xl">{task.completed ? "💧" : "🫙"}</span>
                <span className={`text-[10px] font-bold ${task.completed ? "text-white" : "text-gray-400"}`}>
                  {task.completed ? "+25♥️" : "50cl"}
                </span>
              </button>
            ))}
          </div>
          {completedWater === 4 && (
            <p className="text-center text-green-500 font-bold text-sm mt-2">Objectif atteint ! +100♥️</p>
          )}
        </section>

        {/* Exercise section */}
        <section>
          <h2 className="text-base font-black uppercase tracking-wide mb-3">🏋️ Exercice</h2>

          {/* Weather card */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            {weatherLoading ? (
              <p className="text-sm text-gray-400">Chargement météo...</p>
            ) : weather ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl">{weather.rain ? "🌧️" : weather.temp >= 18 ? "☀️" : "🌤️"}</span>
                <div>
                  <p className="font-black text-lg">{weather.temp}°C</p>
                  <p className="text-sm text-gray-500">{weather.description}</p>
                </div>
                <div className="ml-auto">
                  {outdoorOk ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Extérieur ✓</span>
                  ) : (
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Intérieur conseillé</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">📍 Autorise la localisation pour voir la météo</p>
            )}
          </div>

          <div className="space-y-2">
            {(["yoga", "running", "indoor"] as ExerciseType[]).map((type) => {
              const isRecommended = type === "indoor" && !outdoorOk && weather !== null;
              const isOutdoorRec = type === "running" && outdoorOk;
              return (
                <button
                  key={type}
                  onClick={() => handleExercise(type)}
                  disabled={!!exerciseDone}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    exerciseDone === type
                      ? "bg-black border-black text-white"
                      : exerciseDone
                      ? "border-gray-100 opacity-40"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{EXERCISE_LABELS[type].split(" ")[0]}</span>
                    <div className="text-left">
                      <p className="font-black text-sm capitalize">{type}</p>
                      {(isRecommended || isOutdoorRec) && (
                        <p className="text-[10px] text-[#FF4500] font-bold">Recommandé</p>
                      )}
                    </div>
                  </div>
                  <span className={`font-black text-sm ${exerciseDone === type ? "text-white" : "text-[#FF4500]"}`}>
                    +{EXERCISE_REWARDS[type]}♥️
                  </span>
                </button>
              );
            })}
          </div>

          {exerciseDone && (
            <p className="text-center text-green-500 font-bold text-sm mt-3">
              Bravo ! +{EXERCISE_REWARDS[exerciseDone]}♥️ gagnés 🎉
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function getWeatherDesc(code: number, temp: number): string {
  if (code === 0) return temp >= 18 ? "Beau temps, parfait pour sortir" : "Ciel dégagé";
  if (code <= 3) return "Partiellement nuageux";
  if (code <= 48) return "Brumeux";
  if (code <= 67) return "Pluie — reste à l'intérieur";
  if (code <= 77) return "Neige";
  if (code <= 82) return "Averses — intérieur conseillé";
  return "Mauvais temps";
}
