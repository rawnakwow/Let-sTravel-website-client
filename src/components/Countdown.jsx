"use client";

import { useEffect, useState } from "react";

function remaining(target) {
  const distance = new Date(target).getTime() - Date.now();
  if (distance <= 0) return null;
  return { days: Math.floor(distance / 86400000), hours: Math.floor(distance / 3600000) % 24, mins: Math.floor(distance / 60000) % 60, secs: Math.floor(distance / 1000) % 60 };
}

export default function Countdown({ target, compact = false }) {
  const [time, setTime] = useState(() => remaining(target));
  useEffect(() => { const interval = setInterval(() => setTime(remaining(target)), 1000); return () => clearInterval(interval); }, [target]);
  if (!time) return <span className="departed">Departed</span>;
  return <div className={`countdown ${compact ? "compact" : ""}`}>{Object.entries(time).map(([label,value]) => <div key={label}><b>{String(value).padStart(2,"0")}</b><span>{label}</span></div>)}</div>;
}
