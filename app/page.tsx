"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/lib/store";

const FONT = "'Alte Haas Grotesk', Arial Black, sans-serif";

// [x%, y%, size, glyphIndex]
const DOTS: [number, number, number, number][] = [
  [8, 12, 4, 0], [18, 28, 2.5, 1], [5, 48, 3, 2], [12, 68, 2, 3], [7, 82, 4, 0],
  [28, 8, 3, 1], [38, 18, 2, 2], [25, 88, 3, 3], [35, 78, 2.5, 0],
  [62, 8, 2, 1], [72, 18, 4, 2], [88, 10, 3, 3], [92, 28, 2, 0],
  [82, 48, 3, 1], [94, 62, 2.5, 2], [88, 78, 4, 3], [78, 88, 2, 0],
  [52, 92, 3, 1], [45, 82, 2, 2], [55, 12, 2.5, 3], [48, 22, 2, 0],
  [20, 50, 3, 2], [30, 40, 2, 1], [70, 50, 2.5, 0], [60, 30, 3, 3],
  [40, 60, 2, 2], [65, 72, 3, 1], [15, 38, 2.5, 0], [82, 34, 2, 3],
  [50, 5, 3, 1], [42, 95, 2.5, 2], [90, 45, 2, 0], [22, 75, 3, 3],
  [75, 62, 2, 1], [58, 80, 3, 0], [32, 22, 2.5, 2], [10, 92, 2, 3],
];

const GLYPHS = ["✦", "✶", "✸", "✺"];

export default function Home() {
  const { stats, loadAll } = useAppStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Scattered stars */}
      {DOTS.map(([x, y, size, glyph], i) => (
        <span
          key={i}
          className="absolute select-none opacity-20 leading-none"
          style={{ left: `${x}%`, top: `${y}%`, fontSize: size * 6, transform: "translate(-50%, -50%)", color: "#000" }}
        >{GLYPHS[glyph]}</span>
      ))}

      {/* Center: logo + stats */}
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative inline-block">
          <Image
            src="/LOGO BRAIN2.png"
            alt="Brain.2"
            width={120}
            height={112}
            priority
            className="object-contain"
          />
          <div
            className="absolute -top-1 -right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#FF4500" }}
          >
            <span className="text-white font-black text-lg leading-none">2</span>
          </div>
        </div>

        {stats && (
          <div className="flex gap-5 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">XP</span>
              <span className="text-base font-black text-black">{stats.xp}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base">❤️</span>
              <span className="text-base font-black text-black">{stats.hearts}</span>
            </div>
          </div>
        )}
      </div>

      {/* Constellation nav items */}
      {/* work — top left */}
      <NavItem href="/work" label="work" style={{ left: "12%", top: "14%" }} />
      {/* care — top right */}
      <NavItem href="/care" label="care" style={{ right: "10%", top: "20%" }} />
      {/* more — left middle */}
      <NavItem href="/more" label="more" style={{ left: "6%", top: "60%" }} />
      {/* note — right middle-low */}
      <NavItem href="/note" label="note" style={{ right: "8%", top: "65%" }} />
      {/* shop — bottom center */}
      <NavItem href="/shop" label="shop" style={{ left: "50%", bottom: "10%", transform: "translateX(-50%)" }} />

      {/* fix link */}
      <Link href="/fix" className="absolute bottom-4 right-4 text-xs text-gray-300 font-bold tracking-widest uppercase">fix</Link>
    </div>
  );
}

function NavItem({ href, label, style }: { href: string; label: string; style: React.CSSProperties }) {
  return (
    <Link
      href={href}
      className="absolute text-[1.9rem] font-black text-black tracking-tight transition-colors active:text-[#FF4500]"
      style={{ fontFamily: FONT, ...style }}
    >
      {label}
    </Link>
  );
}
