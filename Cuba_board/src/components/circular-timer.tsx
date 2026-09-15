import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CircularTimer({
  seconds,
  size = 80,
  onElapsed,
}: { seconds: number; size?: number; onElapsed?: () => void }) {
  const [t, setT] = useState(seconds);
  useEffect(() => { setT(seconds); }, [seconds]);
  useEffect(() => {
    if (t <= 0) { onElapsed?.(); return; }
    const id = setTimeout(() => setT((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [t, onElapsed]);

  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const pct = t / seconds;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={6} fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          stroke="url(#timer-grad)" strokeWidth={6} strokeLinecap="round" fill="none"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1, ease: "linear" }}
        />
        <defs>
          <linearGradient id="timer-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-mono font-bold text-xl tabular-nums">
        {t}
      </div>
    </div>
  );
}
