import LogstashBuilder from '@/components/LogstashBuilder';
import Snowfall from '@/components/Snowfall';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 relative">
      <div className="relative z-10">
        <LogstashBuilder />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <Snowfall />
      </div>
    </main>
  );
}
