import React, { useState, useEffect } from 'react';
import { PetMood } from '../types';
import { ChevronUp, ChevronDown, Bone, Heart, Zap, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface TurboPetProps {
  currentQuip?: string;
  isRetracted?: boolean;
  onToggleRetract?: () => void;
}

interface FloatingEffect {
  id: number;
  type: 'heart' | 'bone' | 'sparkle';
  x: number;
}

// Optional audio feedback using Web Audio API (gentle pleasant chimes)
function playTone(type: 'pet' | 'treat' | 'bark') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'pet') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'treat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(480, now + 0.08);
      osc.frequency.setValueAtTime(640, now + 0.16);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'bark') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // Audio contexts may be blocked by autoplay policies; ignore silently
  }
}

export const TurboPet: React.FC<TurboPetProps> = ({
  currentQuip,
  isRetracted = false,
  onToggleRetract,
}) => {
  const [mood, setMood] = useState<PetMood>('SNIFFING');
  const [treatCount, setTreatCount] = useState(5);
  const [pettingCount, setPettingCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingItems, setFloatingItems] = useState<FloatingEffect[]>([]);

  const defaultQuip =
    'Woof! Need to rescue backlogged parts? I sniffed all 82 warehouse bins and checked 25 Knowledge Base procedures! Click a quick prompt or ask me anything. If you need a clean screen, just click the top bar to retract me into my kennel!';

  const activeQuip = currentQuip || defaultQuip;

  const triggerFloating = (type: 'heart' | 'bone' | 'sparkle') => {
    const newItem: FloatingEffect = {
      id: Date.now() + Math.random(),
      type,
      x: 30 + Math.random() * 50,
    };
    setFloatingItems((prev) => [...prev.slice(-6), newItem]);
    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((item) => item.id !== newItem.id));
    }, 1200);
  };

  const handleGiveTreat = () => {
    setTreatCount((prev) => prev + 1);
    setMood('ZOOMIES');
    if (soundEnabled) playTone('treat');
    triggerFloating('bone');
    setTimeout(() => setMood('HAPPY'), 3000);
  };

  const handlePetTurbo = () => {
    setPettingCount((prev) => prev + 1);
    setMood('HAPPY');
    if (soundEnabled) playTone('pet');
    triggerFloating('heart');
    setTimeout(() => setMood('SNIFFING'), 2500);
  };

  const handlePupClick = () => {
    if (soundEnabled) playTone('bark');
    triggerFloating('sparkle');
    setMood((prev) => (prev === 'ZOOMIES' ? 'HAPPY' : 'ZOOMIES'));
    setTimeout(() => setMood('SNIFFING'), 2500);
  };

  const isZoomies = mood === 'ZOOMIES';

  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0b172a] via-[#10223d] to-[#0d1c33] shadow-xl backdrop-blur-md transition-all duration-300">
      {/* Retractable Summary Topbar */}
      <div
        onClick={onToggleRetract}
        className="flex cursor-pointer items-center justify-between border-b border-cyan-500/20 bg-[#091322]/80 px-4 py-2.5 transition-colors hover:bg-blue-600/10"
      >
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-2.5 py-0.5 text-xs font-black tracking-wide text-cyan-300 shadow-sm shadow-cyan-500/20">
            🐾 Turbo · AI Stock Rescue Pup
          </span>
          <span className="hidden sm:inline text-xs font-semibold text-slate-400">
            ● Sniffing 82 Bins & 25 Knowledge Docs
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border transition-colors ${
              isZoomies
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isZoomies ? '⚡ ZOOMIES ACTIVATED!' : mood === 'HAPPY' ? '💖 LOVES PETS' : 'ON PATROL'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[11px] font-medium text-slate-400 hover:text-cyan-300 flex items-center gap-1">
            <span>{isRetracted ? 'Expand Mascot' : 'Retract Mascot'}</span>
            {isRetracted ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </div>
        </div>
      </div>

      {/* Main Mascot Card Content (Animated SVG & Interactive Bubble) */}
      {!isRetracted && (
        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5">
          {/* Left Column: Full Animated SVG Dog */}
          <div className="relative flex flex-col items-center flex-shrink-0 select-none">
            {/* Floating Hearts/Bones particles */}
            <div className="pointer-events-none absolute inset-0 -top-6 overflow-visible">
              {floatingItems.map((item) => (
                <div
                  key={item.id}
                  style={{ left: `${item.x}%` }}
                  className="absolute animate-float-up text-lg"
                >
                  {item.type === 'heart' ? '❤️' : item.type === 'bone' ? '🦴' : '✨'}
                </div>
              ))}
            </div>

            {/* Clickable Animated Vector Pup */}
            <div
              onClick={handlePupClick}
              title="Click Turbo to play or trigger zoomies!"
              className={`cursor-pointer transition-transform duration-200 active:scale-95 ${
                isZoomies ? 'animate-bounce' : 'hover:scale-105'
              }`}
            >
              <svg
                viewBox="0 0 160 140"
                width="135"
                height="118"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                {/* Wagging Tail */}
                <g className={`turbo-tail ${isZoomies ? 'zoomies' : ''}`}>
                  <path
                    d="M 125 90 Q 148 65 142 45 Q 135 60 120 80 Z"
                    fill="#e89138"
                    stroke="#2a1a08"
                    strokeWidth="2"
                  />
                  <circle cx="142" cy="45" r="5" fill="#ffd24a" />
                </g>

                {/* Dog Body */}
                <path
                  d="M 50 85 C 50 70 120 70 120 100 C 120 120 50 120 50 85 Z"
                  fill="#f4a259"
                />
                <path
                  d="M 65 85 C 65 75 105 75 105 100 C 105 115 65 115 65 85 Z"
                  fill="#ffe3c2"
                />

                {/* Front & Back Paws */}
                <ellipse cx="60" cy="115" rx="14" ry="9" fill="#e89138" stroke="#2a1a08" strokeWidth="1.5" />
                <ellipse cx="105" cy="115" rx="14" ry="9" fill="#e89138" stroke="#2a1a08" strokeWidth="1.5" />
                {/* Paw Pads */}
                <circle cx="56" cy="113" r="2" fill="#2a1a08" />
                <circle cx="60" cy="112" r="2" fill="#2a1a08" />
                <circle cx="64" cy="113" r="2" fill="#2a1a08" />
                <circle cx="101" cy="113" r="2" fill="#2a1a08" />
                <circle cx="105" cy="112" r="2" fill="#2a1a08" />
                <circle cx="109" cy="113" r="2" fill="#2a1a08" />

                {/* Blue Collar with Gold Wrench Medallion */}
                <path
                  d="M 58 78 Q 80 88 102 78"
                  stroke="#1677ff"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="80" cy="85" r="6.5" fill="#ffd24a" stroke="#d49b00" strokeWidth="1.5" />
                <text x="80" y="89" fontSize="8" textAnchor="middle" fill="#000" fontWeight="bold">
                  🔧
                </text>

                {/* Left Ear (floppy animated) */}
                <g className={`turbo-ear-left ${isZoomies ? 'zoomies' : ''}`}>
                  <path
                    d="M 58 35 Q 35 30 40 65 Q 52 75 60 50 Z"
                    fill="#ba6a19"
                    stroke="#2a1a08"
                    strokeWidth="2"
                  />
                  <path d="M 55 40 Q 42 38 46 60 Q 52 66 56 50 Z" fill="#e07a22" />
                </g>

                {/* Right Ear (floppy animated) */}
                <g className={`turbo-ear-right ${isZoomies ? 'zoomies' : ''}`}>
                  <path
                    d="M 102 35 Q 125 30 120 65 Q 108 75 100 50 Z"
                    fill="#ba6a19"
                    stroke="#2a1a08"
                    strokeWidth="2"
                  />
                  <path d="M 105 40 Q 118 38 114 60 Q 108 66 104 50 Z" fill="#e07a22" />
                </g>

                {/* Dog Head */}
                <ellipse cx="80" cy="46" rx="28" ry="24" fill="#f4a259" stroke="#2a1a08" strokeWidth="2" />

                {/* White Face Blaze */}
                <path
                  d="M 76 26 Q 80 24 84 26 Q 88 44 94 56 Q 80 66 66 56 Q 72 44 76 26 Z"
                  fill="#ffe3c2"
                />

                {/* Blinking Expressive Eyes */}
                <g className="turbo-eyes">
                  <ellipse cx="70" cy="42" rx="4.5" ry="6" fill="#1b1c24" />
                  <ellipse cx="90" cy="42" rx="4.5" ry="6" fill="#1b1c24" />
                  <circle cx="71.5" cy="40" r="1.8" fill="#ffffff" />
                  <circle cx="91.5" cy="40" r="1.8" fill="#ffffff" />
                  <circle cx="68.5" cy="44" r="0.9" fill="#36ddff" />
                  <circle cx="88.5" cy="44" r="0.9" fill="#36ddff" />
                </g>

                {/* White Snout & Cute Dark Nose */}
                <ellipse cx="80" cy="54" rx="9" ry="6.5" fill="#ffffff" />
                <ellipse cx="80" cy="51" rx="4" ry="2.8" fill="#201c18" />

                {/* Mouth & Panting Tongue */}
                <path
                  d="M 77 55 Q 80 57 83 55"
                  stroke="#201c18"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className={`turbo-tongue ${isZoomies ? 'zoomies' : ''}`}
                  d="M 78 56 Q 80 65 82 56 Z"
                  fill="#ff6b8b"
                />

                {/* Rosy Blush Cheeks */}
                <circle cx="64" cy="50" r="3.5" fill="#ff8da1" opacity="0.55" />
                <circle cx="96" cy="50" r="3.5" fill="#ff8da1" opacity="0.55" />
              </svg>
            </div>

            {/* Nametag Badge */}
            <div className="mt-1 flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-300 shadow-sm">
              <span>TURBO · RESCUE HOUND</span>
            </div>

            {/* Pet / Treat Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePetTurbo();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-950/40 px-2.5 py-1 text-xs font-semibold text-pink-300 hover:bg-pink-900/60 active:scale-95 transition-all shadow-sm"
                title="Pet Turbo"
              >
                <Heart className="h-3 w-3 fill-pink-400 text-pink-400" />
                <span>{pettingCount > 0 ? `${pettingCount} Pets` : 'Pet Me'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGiveTreat();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/60 active:scale-95 transition-all shadow-sm"
                title="Give Turbo a Treat"
              >
                <Bone className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{treatCount} Bones</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled(!soundEnabled);
                }}
                className="rounded-lg border border-slate-700 bg-slate-800/80 p-1.5 text-slate-400 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute Pup Audio' : 'Enable Pup Audio'}
              >
                {soundEnabled ? <Volume2 className="h-3 w-3 text-cyan-300" /> : <VolumeX className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {/* Right Column: Floating Speech Bubble with Pointer and Operational Badges */}
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl border border-cyan-500/30 bg-[#0c1a2f]/95 p-4 shadow-xl backdrop-blur-md bubble-float">
              {/* Pointer arrow on the left side (visible on desktop) */}
              <div className="hidden md:block absolute -left-2 top-8 h-4 w-4 rotate-45 border-l border-b border-cyan-500/30 bg-[#0c1a2f]"></div>

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                  <span>🦴 Turbo's Warehouse Patrol Log</span>
                  {isZoomies && (
                    <span className="flex items-center gap-0.5 rounded bg-amber-400/20 px-1.5 py-0.2 text-[10px] text-amber-300 animate-pulse">
                      <Zap className="h-2.5 w-2.5" /> SPEEDY!
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-cyan-400">STATUS: ON DUTY</div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-sans italic">
                "{activeQuip}"
              </p>

              {/* Tag Pills */}
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2.5 border-t border-slate-800">
                <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  🎾 Zero Hallucinations
                </span>
                <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  🦴 Bone-Fied Evidence
                </span>
                <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  🛑 Barks at Suspended Dealers
                </span>
                <span className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                  ⚡ Fast Deterministic Fetch
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
