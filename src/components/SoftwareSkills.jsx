import { softwareSkills } from '../data.js';
import { SectionHeading } from './ClientChannels.jsx';

export default function SoftwareSkills() {
  return (
    <section
      id="software"
      className="border-b border-line py-16 md:py-28 bg-bg"
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <div>
            <SectionHeading tag="V2" title="Tools &amp; software" />
            <p className="mt-3 md:mt-4 max-w-lg text-ink-dim text-sm md:text-base">
              What the edit actually runs through, day to day.
            </p>
          </div>
        </div>

        {/* Mobile: 3 columns | Desktop: 4 columns */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
          {softwareSkills.map((tool) => (
            <div
              key={tool.name}
              className="group relative bg-surface border border-line p-3 md:p-6 flex flex-col justify-between transition-all duration-300 hover:border-amber/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5 md:mb-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-bg border border-line flex items-center justify-center p-1.5 md:p-2.5 transition-transform duration-300 group-hover:scale-105">
                    {tool.image ? (
                      <img
                        src={tool.image}
                        alt=""
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-teal" />
                    )}
                  </div>
                  <span className="font-mono text-[9px] md:text-xs text-teal bg-teal/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full tabular-nums">
                    {tool.level}%
                  </span>
                </div>

                <div className="font-display text-sm md:text-xl text-ink leading-tight mb-0.5 md:mb-1">
                  {tool.name}
                </div>
                <div className="text-[10px] md:text-xs text-ink-faint leading-snug">
                  {tool.category}
                </div>
              </div>

              {/* Only show Proficiency + Meter on md and up */}
              <div className="hidden md:flex mt-8 pt-4 border-t border-line/60 items-center justify-between">
                <span className="text-[11px] font-mono text-ink-faint uppercase tracking-wider">
                  Proficiency
                </span>
                <Meter level={tool.level} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Meter({ level, bars = 8 }) {
  const filled = Math.round((level / 100) * bars);
  return (
    <div className="flex items-end gap-[2px] h-4" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-xs transition-colors duration-300 ${
            i < filled ? 'bg-amber' : 'bg-line'
          }`}
          style={{ height: `${40 + (i / bars) * 60}%` }}
        />
      ))}
    </div>
  );
}
