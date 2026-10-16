import { clientChannels } from '../data.js';

export default function ClientChannels() {
  return (
    <section id="clients" className="border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V3" title="Channels I cut for" />
        <p className="mt-4 max-w-lg text-ink-dim">The Channels I Work With</p>

        {/* Replaced the solid background container block with a clean flex rail
            so sparse items never display awkward empty gray background areas */}
        <div className="mt-12 w-full overflow-x-auto pb-4 scrollbar-none">
          <div className="flex gap-4 md:gap-6 min-w-full py-2">
            {clientChannels.map((c) => (
              <div
                key={c.handle}
                className="min-w-[260px] md:min-w-[280px] flex-1 bg-panel border border-line p-6 flex flex-col justify-between transition-all duration-200 hover:border-amber/50 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <img
                    src={
                      c.avatar
                        ? c.avatar
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=${c.color}&color=E8A33D&size=96&bold=true`
                    }
                    alt={`${c.name} channel avatar`}
                    className={`w-12 h-12 border border-line object-cover ${c.round ? 'rounded-full' : ''}`}
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                  <span className="font-mono text-[10px] text-ink-faint border border-line px-1.5 py-0.5 bg-bg">
                    since {c.since}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="font-display text-xl leading-tight text-ink">
                    {c.name}
                  </div>
                  <a
                    href={`https://www.youtube.com/${c.handle}`}
                    target="_blank"
                    className="font-mono text-xs text-amber-300 mt-1"
                  >
                    {c.handle}
                  </a>
                  <div className="text-xs text-ink-dim mt-1">{c.niche}</div>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-end justify-end">
                  {/* <div>
                    <div className="font-mono text-sm text-teal tabular-nums">
                      {(c.views / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-ink-faint">
                      views on edits
                    </div>
                  </div>*/}
                  <div className="text-right">
                    <div className="font-mono text-sm text-teal tabular-nums">
                      {c.subs}
                    </div>
                    <div className="text-[10px] text-ink-faint">
                      subscribers
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ tag, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] text-ink-faint border border-line px-2 py-1">
        {tag}
      </span>
      <h2 className="font-display font-semibold text-3xl md:text-4xl text-ink">
        {title}
      </h2>
    </div>
  );
}
