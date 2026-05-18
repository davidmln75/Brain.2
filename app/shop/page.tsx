"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAppStore } from "@/lib/store";
import type { ShopItem } from "@/types/database";

export default function ShopPage() {
  const { shopItems, stats, loadAll, addShopItem, deleteShopItem, buyItem } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [currency, setCurrency] = useState<"xp" | "hearts">("xp");
  const [boughtId, setBoughtId] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, [loadAll]);

  const xpItems = shopItems.filter((i) => i.currency === "xp");
  const heartItems = shopItems.filter((i) => i.currency === "hearts");

  const handleBuy = async (item: ShopItem) => {
    const balance = item.currency === "xp" ? (stats?.xp ?? 0) : (stats?.hearts ?? 0);
    if (balance < item.cost) return;
    setBoughtId(item.id);
    await buyItem(item);
    setTimeout(() => setBoughtId(null), 2000);
  };

  const handleAdd = async () => {
    const costNum = parseInt(cost);
    if (!name.trim() || isNaN(costNum) || costNum <= 0) return;
    await addShopItem(name.trim(), costNum, currency);
    setName("");
    setCost("");
    setCurrency("xp");
    setShowAdd(false);
  };

  const canAfford = (item: ShopItem) => {
    if (!stats) return false;
    return item.currency === "xp" ? stats.xp >= item.cost : stats.hearts >= item.cost;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="shop" />

      <div className="flex-1 px-4 py-5 space-y-6 pb-28">

        {/* Balance summary */}
        {stats && (
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">XP disponible</p>
              <p className="text-2xl font-black text-black">{stats.xp}</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">❤️ disponibles</p>
              <p className="text-2xl font-black text-black">{stats.hearts}</p>
            </div>
          </div>
        )}

        {/* XP items */}
        {xpItems.length > 0 && (
          <section>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Acheter avec XP</h2>
            <div className="space-y-2">
              {xpItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  canAfford={canAfford(item)}
                  bought={boughtId === item.id}
                  onBuy={() => handleBuy(item)}
                  onDelete={() => deleteShopItem(item.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Hearts items */}
        {heartItems.length > 0 && (
          <section>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Acheter avec ❤️</h2>
            <div className="space-y-2">
              {heartItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  canAfford={canAfford(item)}
                  bought={boughtId === item.id}
                  onBuy={() => handleBuy(item)}
                  onDelete={() => deleteShopItem(item.id)}
                />
              ))}
            </div>
          </section>
        )}

        {shopItems.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">Aucun article. Ajoutes-en avec +</p>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-6 w-16 h-16 rounded-full text-white text-4xl flex items-center justify-center active:scale-90 transition-transform z-40 font-black"
        style={{ backgroundColor: "#FF4500", boxShadow: "0 4px 24px rgba(255,69,0,0.5)" }}
      >
        +
      </button>

      {/* Add item modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowAdd(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-black">Nouvel article</h2>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la récompense"
              className="w-full border-b-2 border-black py-2 text-base font-medium outline-none"
            />

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Monnaie</p>
              <div className="flex gap-2">
                {(["xp", "hearts"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${currency === c ? "bg-black text-white border-black" : "border-gray-200"}`}
                  >
                    {c === "xp" ? "XP" : "❤️"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Coût</p>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder={`Ex: 200 ${currency === "xp" ? "XP" : "❤️"}`}
                className="w-full border-b-2 border-black py-2 text-base font-medium outline-none"
                inputMode="numeric"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!name.trim() || !cost || parseInt(cost) <= 0}
              className="w-full py-4 bg-[#FF4500] text-white font-black text-base rounded-2xl disabled:opacity-40 active:scale-95 transition-transform"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopItemCard({ item, canAfford, bought, onBuy, onDelete }: {
  item: ShopItem;
  canAfford: boolean;
  bought: boolean;
  onBuy: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${bought ? "border-green-400 bg-green-50" : canAfford ? "border-gray-100" : "border-gray-100 opacity-50"}`}>
      <div className="flex-1">
        <p className="font-black text-sm">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {item.cost} {item.currency === "xp" ? "XP" : "❤️"}
        </p>
      </div>

      {bought ? (
        <span className="text-green-500 font-black text-sm">✓ Acheté</span>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className="px-4 py-2 bg-[#FF4500] text-white font-black text-xs rounded-xl disabled:opacity-30 active:scale-95 transition-transform"
          >
            Acheter
          </button>
          <button onClick={onDelete} className="text-gray-300 text-lg active:text-red-500">×</button>
        </div>
      )}
    </div>
  );
}
