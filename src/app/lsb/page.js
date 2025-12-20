import LogstashBuilder from '@/components/LogstashBuilder';
import Snowfall from '@/components/Snowfall';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950">
      <div className="relative z-0">
        <LogstashBuilder />
      </div>

      <div className="absolute inset-0 z-50 pointer-events-none opacity-40 mix-blend-screen">
        <Snowfall />
      </div>
    </main>
  );
}
