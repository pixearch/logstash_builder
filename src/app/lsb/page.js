'use client';

import { useState, useEffect } from 'react';
import LogstashBuilder from '@/components/LogstashBuilder';
import Snowfall from '@/components/Snowfall';

export default function Home() {
  const [isFestiveTime, setIsFestiveTime] = useState(false);
  const [festiveMode, setFestiveMode] = useState(true);

  useEffect(() => {
    // Check Date: Only show controls between Dec 1 and Dec 30
    const now = new Date();
    const month = now.getMonth(); // 11 = December
    const day = now.getDate();

    if (month === 11 && day >= 1 && day <= 30) {
      setIsFestiveTime(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 relative">
      {/* Festive Mode Toggle - Only visible in December */}
      {isFestiveTime && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setFestiveMode(!festiveMode)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all backdrop-blur-sm
              ${festiveMode 
                ? 'bg-slate-800/80 border-blue-500/30 text-blue-200 shadow-lg shadow-blue-900/20' 
                : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:text-slate-300'}
            `}
          >
            {festiveMode ? '❄️ Festive Mode: ON' : 'Festive Mode: OFF'}
          </button>
        </div>
      )}

      <div className="relative z-10">
        <LogstashBuilder />
      </div>

      {/* Snowfall Overlay: Controlled by toggle and date */}
      {isFestiveTime && festiveMode && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-screen">
          <Snowfall />
        </div>
      )}
    </main>
  );
}
