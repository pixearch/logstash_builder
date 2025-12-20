import LogstashBuilder from '@/components/LogstashBuilder';
import Snowfall from '../components/Snowfall';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 relative">
      <Snowfall />
      <div className="relative z-10">
        <LogstashBuilder />
      </div>
    </main>
  );
}
