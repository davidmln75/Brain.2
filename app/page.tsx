"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/lib/store";

const NAV_ITEMS = [
  { label: "work", href: "/work" },
  { label: "care", href: "/care" },
  { label: "more", href: "/more" },
  { label: "note", href: "/note" },
  { label: "shop", href: "/shop" },
];

export default function Home() {
  const { stats, loadAll } = useAppStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-12 px-6">
      <div className="flex flex-col items-center mt-8 gap-3">
        <div className="relative inline-block">
          <Image
            src="/LOGO BRAIN2.png"
            alt="Brain.2"
            width={140}
            height={130}
            priority
            className="object-contain"
          />
          <div
            className="absolute -top-1 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#FF4500" }}
          >
            <span className="text-white font-black text-xl leading-none">2</span>
          </div>
        </div>
        <h1
          className="text-4xl font-black tracking-tight mt-1"
          style={{ color: "#FF4500", fontFamily: "'Alte Haas Grotesk', Arial Black, sans-serif" }}
        >
          Brain.2
        </h1>

        {stats && (
          <div className="flex gap-6 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">XP</span>
              <span className="text-lg font-black text-black">{stats.xp}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">❤️</span>
              <span className="text-lg font-black text-black">{stats.hearts}</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-col items-center gap-8 w-full max-w-xs">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[2.2rem] font-black text-black tracking-tight hover:text-[#FF4500] transition-colors"
            style={{ fontFamily: "'Alte Haas Grotesk', Arial Black, sans-serif" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="h-8" />
    </div>
  );
}

function BrainSVG() {
  return (
    <svg width="120" height="110" viewBox="0 0 300 270" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Halftone pattern */}
        <pattern id="halftone" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#1a1a1a"/>
        </pattern>
        <pattern id="halftoneLight" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#1a1a1a"/>
        </pattern>
        <pattern id="halftoneMed" x="0" y="0" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
          <circle cx="1.75" cy="1.75" r="1.1" fill="#1a1a1a"/>
        </pattern>

        {/* Gyrus gradients - light on top, dark on sides */}
        <radialGradient id="g1" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e8e8e8"/>
          <stop offset="60%" stopColor="#aaa"/>
          <stop offset="100%" stopColor="#444"/>
        </radialGradient>
        <radialGradient id="g2" cx="50%" cy="25%" r="55%">
          <stop offset="0%" stopColor="#ddd"/>
          <stop offset="55%" stopColor="#999"/>
          <stop offset="100%" stopColor="#3a3a3a"/>
        </radialGradient>
        <radialGradient id="g3" cx="45%" cy="30%" r="58%">
          <stop offset="0%" stopColor="#e0e0e0"/>
          <stop offset="50%" stopColor="#aaa"/>
          <stop offset="100%" stopColor="#404040"/>
        </radialGradient>
        <radialGradient id="bgGrad" cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#c8c8c8"/>
          <stop offset="50%" stopColor="#888"/>
          <stop offset="100%" stopColor="#222"/>
        </radialGradient>
        <clipPath id="brainOutline">
          <path d="M148 18 C122 14 88 20 64 36 C40 52 24 76 20 102 C16 128 24 158 42 175 C56 188 76 196 100 200 C114 203 130 204 148 203 C160 202 172 200 182 196 C198 190 212 180 222 168 C238 150 246 126 244 102 C242 78 230 54 210 38 C192 24 168 16 148 18Z"/>
        </clipPath>
      </defs>

      {/* === BRAIN BACKGROUND === */}
      <path d="M148 18 C122 14 88 20 64 36 C40 52 24 76 20 102 C16 128 24 158 42 175 C56 188 76 196 100 200 C114 203 130 204 148 203 C160 202 172 200 182 196 C198 190 212 180 222 168 C238 150 246 126 244 102 C242 78 230 54 210 38 C192 24 168 16 148 18Z" fill="url(#bgGrad)"/>

      {/* === GYRI — each gyrus is a rounded blob with gradient + halftone === */}

      {/* Frontal lobe top gyri */}
      <ellipse cx="82" cy="42" rx="22" ry="16" fill="url(#g1)" transform="rotate(-15 82 42)"/>
      <ellipse cx="82" cy="42" rx="22" ry="16" fill="url(#halftone)" opacity="0.35" transform="rotate(-15 82 42)"/>

      <ellipse cx="118" cy="32" rx="24" ry="15" fill="url(#g2)" transform="rotate(-8 118 32)"/>
      <ellipse cx="118" cy="32" rx="24" ry="15" fill="url(#halftoneMed)" opacity="0.3" transform="rotate(-8 118 32)"/>

      <ellipse cx="158" cy="30" rx="22" ry="14" fill="url(#g1)" transform="rotate(5 158 30)"/>
      <ellipse cx="158" cy="30" rx="22" ry="14" fill="url(#halftoneLight)" opacity="0.25" transform="rotate(5 158 30)"/>

      <ellipse cx="196" cy="38" rx="20" ry="15" fill="url(#g3)" transform="rotate(18 196 38)"/>
      <ellipse cx="196" cy="38" rx="20" ry="15" fill="url(#halftoneMed)" opacity="0.3" transform="rotate(18 196 38)"/>

      {/* Parietal top gyri */}
      <ellipse cx="96" cy="66" rx="26" ry="17" fill="url(#g2)" transform="rotate(-10 96 66)"/>
      <ellipse cx="96" cy="66" rx="26" ry="17" fill="url(#halftone)" opacity="0.3" transform="rotate(-10 96 66)"/>

      <ellipse cx="140" cy="58" rx="25" ry="16" fill="url(#g1)" transform="rotate(0 140 58)"/>
      <ellipse cx="140" cy="58" rx="25" ry="16" fill="url(#halftoneMed)" opacity="0.28" transform="rotate(0 140 58)"/>

      <ellipse cx="182" cy="62" rx="22" ry="16" fill="url(#g3)" transform="rotate(12 182 62)"/>
      <ellipse cx="182" cy="62" rx="22" ry="16" fill="url(#halftone)" opacity="0.25" transform="rotate(12 182 62)"/>

      {/* Central gyri row */}
      <ellipse cx="58" cy="90" rx="22" ry="18" fill="url(#g2)" transform="rotate(-20 58 90)"/>
      <ellipse cx="58" cy="90" rx="22" ry="18" fill="url(#halftoneMed)" opacity="0.35" transform="rotate(-20 58 90)"/>

      <ellipse cx="100" cy="92" rx="28" ry="19" fill="url(#g1)" transform="rotate(-5 100 92)"/>
      <ellipse cx="100" cy="92" rx="28" ry="19" fill="url(#halftone)" opacity="0.28" transform="rotate(-5 100 92)"/>

      <ellipse cx="148" cy="88" rx="26" ry="18" fill="url(#g3)" transform="rotate(5 148 88)"/>
      <ellipse cx="148" cy="88" rx="26" ry="18" fill="url(#halftoneMed)" opacity="0.25" transform="rotate(5 148 88)"/>

      <ellipse cx="196" cy="86" rx="24" ry="17" fill="url(#g2)" transform="rotate(16 196 86)"/>
      <ellipse cx="196" cy="86" rx="24" ry="17" fill="url(#halftone)" opacity="0.3" transform="rotate(16 196 86)"/>

      <ellipse cx="228" cy="96" rx="20" ry="18" fill="url(#g1)" transform="rotate(28 228 96)"/>
      <ellipse cx="228" cy="96" rx="20" ry="18" fill="url(#halftoneMed)" opacity="0.28" transform="rotate(28 228 96)"/>

      {/* Lower gyri */}
      <ellipse cx="44" cy="122" rx="20" ry="17" fill="url(#g3)" transform="rotate(-25 44 122)"/>
      <ellipse cx="44" cy="122" rx="20" ry="17" fill="url(#halftoneMed)" opacity="0.38" transform="rotate(-25 44 122)"/>

      <ellipse cx="82" cy="120" rx="26" ry="18" fill="url(#g1)" transform="rotate(-8 82 120)"/>
      <ellipse cx="82" cy="120" rx="26" ry="18" fill="url(#halftone)" opacity="0.3" transform="rotate(-8 82 120)"/>

      <ellipse cx="126" cy="116" rx="27" ry="18" fill="url(#g2)" transform="rotate(2 126 116)"/>
      <ellipse cx="126" cy="116" rx="27" ry="18" fill="url(#halftoneMed)" opacity="0.27" transform="rotate(2 126 116)"/>

      <ellipse cx="170" cy="114" rx="25" ry="17" fill="url(#g3)" transform="rotate(10 170 114)"/>
      <ellipse cx="170" cy="114" rx="25" ry="17" fill="url(#halftone)" opacity="0.28" transform="rotate(10 170 114)"/>

      <ellipse cx="212" cy="118" rx="22" ry="17" fill="url(#g1)" transform="rotate(22 212 118)"/>
      <ellipse cx="212" cy="118" rx="22" ry="17" fill="url(#halftoneMed)" opacity="0.3" transform="rotate(22 212 118)"/>

      {/* Temporal lobe gyri (bottom area) */}
      <ellipse cx="64" cy="150" rx="24" ry="16" fill="url(#g2)" transform="rotate(-15 64 150)"/>
      <ellipse cx="64" cy="150" rx="24" ry="16" fill="url(#halftone)" opacity="0.35" transform="rotate(-15 64 150)"/>

      <ellipse cx="108" cy="148" rx="28" ry="17" fill="url(#g1)" transform="rotate(-4 108 148)"/>
      <ellipse cx="108" cy="148" rx="28" ry="17" fill="url(#halftoneMed)" opacity="0.28" transform="rotate(-4 108 148)"/>

      <ellipse cx="152" cy="148" rx="26" ry="16" fill="url(#g3)" transform="rotate(6 152 148)"/>
      <ellipse cx="152" cy="148" rx="26" ry="16" fill="url(#halftone)" opacity="0.26" transform="rotate(6 152 148)"/>

      <ellipse cx="193" cy="152" rx="22" ry="15" fill="url(#g2)" transform="rotate(18 193 152)"/>
      <ellipse cx="193" cy="152" rx="22" ry="15" fill="url(#halftoneMed)" opacity="0.3" transform="rotate(18 193 152)"/>

      {/* Bottom edge gyri */}
      <ellipse cx="88" cy="178" rx="22" ry="13" fill="url(#g1)" transform="rotate(-8 88 178)"/>
      <ellipse cx="88" cy="178" rx="22" ry="13" fill="url(#halftone)" opacity="0.32" transform="rotate(-8 88 178)"/>

      <ellipse cx="132" cy="180" rx="24" ry="13" fill="url(#g3)" transform="rotate(0 132 180)"/>
      <ellipse cx="132" cy="180" rx="24" ry="13" fill="url(#halftoneMed)" opacity="0.28" transform="rotate(0 132 180)"/>

      <ellipse cx="172" cy="178" rx="20" ry="12" fill="url(#g2)" transform="rotate(12 172 178)"/>
      <ellipse cx="172" cy="178" rx="20" ry="12" fill="url(#halftone)" opacity="0.3" transform="rotate(12 172 178)"/>

      {/* === SULCI (deep grooves between gyri) === */}
      <path d="M104 26 C100 42 98 60 100 80" stroke="#111" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M138 24 C136 38 136 56 138 76" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M172 28 C172 44 170 62 168 80" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>

      <path d="M74 54 C82 60 90 62 96 58 C102 54 108 48 116 50" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M118 50 C126 46 136 46 144 50 C152 54 158 60 164 58" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M164 58 C174 54 184 52 192 56 C200 60 206 68 208 78" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      <path d="M42 78 C54 72 68 72 78 78 C88 84 94 94 92 106" stroke="#111" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M78 78 C90 74 104 74 116 80 C124 86 126 98 122 110" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M120 78 C132 74 146 74 158 80 C166 86 168 98 164 110" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M160 78 C172 76 186 76 198 82 C208 88 214 100 212 112" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M210 86 C220 84 232 88 238 98 C242 108 238 122 230 130" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      <path d="M34 110 C46 104 60 104 70 110 C78 116 80 128 76 140" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M68 108 C80 102 96 102 108 110 C116 116 118 130 114 142" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M110 108 C122 102 138 102 150 110 C158 118 158 132 154 144" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M152 108 C164 102 178 104 188 112 C196 120 196 134 190 146" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M190 110 C202 106 214 110 220 120 C226 130 222 146 214 154" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      <path d="M46 138 C58 132 72 132 82 140 C90 148 90 162 84 172" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M84 138 C96 132 112 132 122 140 C130 148 130 164 124 174" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M124 138 C136 132 152 132 162 140 C170 148 170 162 164 172" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M164 138 C176 134 190 136 198 146 C204 156 202 170 196 178" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      <path d="M70 168 C80 162 94 162 104 170 C112 178 112 190 106 198" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M106 168 C118 162 134 162 144 170 C152 178 152 192 146 200" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M146 168 C158 164 172 166 180 174 C186 182 184 194 178 200" stroke="#111" strokeWidth="1.6" fill="none" strokeLinecap="round"/>

      {/* Outer silhouette stroke */}
      <path d="M148 18 C122 14 88 20 64 36 C40 52 24 76 20 102 C16 128 24 158 42 175 C56 188 76 196 100 200 C114 203 130 204 148 203 C160 202 172 200 182 196 C198 190 212 180 222 168 C238 150 246 126 244 102 C242 78 230 54 210 38 C192 24 168 16 148 18Z" fill="none" stroke="#111" strokeWidth="2.5"/>

      {/* Brain stem */}
      <path d="M118 200 C115 212 114 222 118 230 C122 236 132 239 140 236 C148 233 152 224 150 212 L148 200Z" fill="#333" stroke="#111" strokeWidth="1.5"/>
      <path d="M122 200 C124 208 128 214 132 216 C136 214 140 208 140 200" fill="#555" opacity="0.5"/>
    </svg>
  );
}
