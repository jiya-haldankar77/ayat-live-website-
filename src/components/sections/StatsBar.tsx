import { STATS } from '@/lib/siteData';

export default function StatsBar() {
  const stats = STATS.slice(0, 5);

  return (
    <section className="bg-gold py-12 md:py-14">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="reveal text-center md:border-r md:border-stone-900/15 last:border-r-0"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-display text-3xl md:text-4xl font-semibold text-stone-900">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[11px] md:text-xs text-stone-800/70 tracking-wider uppercase font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
