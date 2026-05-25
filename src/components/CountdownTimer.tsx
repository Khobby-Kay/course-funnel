"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getOfferEndMs(): number {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  date.setDate(date.getDate() + 2);
  return date.getTime();
}

function computeTimeLeft(endMs: number): TimeLeft {
  const diff = Math.max(0, endMs - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [endMs] = useState(getOfferEndMs);
  const [timeLeft, setTimeLeft] = useState(EMPTY_TIME);

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft(endMs));
    const frame = requestAnimationFrame(tick);
    const timer = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, [endMs]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section aria-label="Offer countdown">
      <p className="text-white/60 text-sm mb-3 uppercase tracking-wider">Offer expires in</p>
      <ul className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <li key={unit.label} className="text-center">
            <span
              className="block bg-white/10 rounded-xl p-3 sm:p-4 text-2xl sm:text-3xl font-bold text-gold tabular-nums min-h-[3.25rem] sm:min-h-[4rem] flex items-center justify-center"
              suppressHydrationWarning
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-xs text-white/60 mt-1 block">{unit.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
