import LogstashBuilder from '@/components/LogstashBuilder';
import Snowfall from '@/components/Snowfall';

export default function Home() {
  return (
    <main className="relative min-h-screen isolate">
      <div className="fixed inset-0 -z-20 bg-slate-950" />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Snowfall />
      </div>
      <div className="relative">
        <LogstashBuilder />
      </div>
    </main>
  );
}
