"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Acara Sukses" },
  { value: 50,  suffix: "+", label: "Menu Otentik" },
  { value: 4.9, suffix: "/5", label: "Rating Rata-rata", isDecimal: true },
];

function AnimatedNumber({
  value,
  suffix,
  isDecimal,
}: {
  value: number;
  suffix: string;
  isDecimal?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [started, value, isDecimal]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <div className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-1">
              <dt className="text-sm font-medium text-muted-foreground">{stat.label}</dt>
              <dd className="font-heading text-4xl text-primary">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  isDecimal={stat.isDecimal}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
