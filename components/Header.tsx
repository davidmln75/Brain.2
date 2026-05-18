"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const stats = useAppStore((s) => s.stats);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="w-10 h-10 flex items-center justify-center -ml-1 active:opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <h1 className="text-xl font-black tracking-tight uppercase">{title}</h1>

      <div className="flex items-center gap-3">
        {stats && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">XP</span>
              <span className="text-sm font-black text-black">{stats.xp}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-sm">❤️</span>
              <span className="text-sm font-black text-black">{stats.hearts}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
