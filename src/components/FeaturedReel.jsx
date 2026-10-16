import { useEffect, useRef, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { featuredReels } from '../data.js';
import { SectionHeading } from './ClientChannels.jsx';

export default function FeaturedReel() {
  const [active, setActive] = useState(0);
  const reel = featuredReels[active];

  const playerRef = useRef(null); // the <mux-player> element
  const wrapRef = useRef(null); // the box around the player

  // Pause the video as soon as the player is mostly scrolled out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) playerRef.current?.pause?.();
      },
      { threshold: 0.25 }, // pause once less than 25% of it is visible
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="reel" className="border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V4" title="Four long-form edits" />
        <p className="mt-4 max-w-lg text-ink-dim">
          The full-length pieces — the ones where structure, pacing and a clean
          sound mix decide whether someone watches to minute twenty.
        </p>

        <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-px bg-line border border-line">
          <div ref={wrapRef} className="bg-bg p-4 md:p-6">
            <MuxPlayer
              ref={playerRef}
              key={reel.id}
              playbackId={reel.playbackId}
              streamType="on-demand"
              metadata={{
                video_title: reel.title,
                viewer_user_id: 'portfolio-visitor',
              }}
              primaryColor="#ECE9E2"
              secondaryColor="#0E1113"
              accentColor="#E8A33D"
              className="w-full"
            />

            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-2xl text-ink leading-tight">
                  {reel.title}
                </div>
                <div className="mt-1 text-sm text-ink-dim">
                  {reel?.client !== '' ? reel.client + ' /' : ''}{' '}
                  {reel.category}
                </div>
              </div>
              <span className="font-mono text-xs text-ink-faint border border-line px-2 py-1 shrink-0 tabular-nums">
                {reel.duration}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-faint">Edit: {reel.role}</p>
          </div>

          <div className="bg-bg flex flex-col divide-y divide-line-soft">
            {featuredReels.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActive(i)}
                className={`text-left p-5 md:p-6 flex items-center gap-4 transition-colors ${
                  i === active ? 'bg-raised' : 'hover:bg-panel'
                }`}
              >
                <span
                  className={`font-mono text-xs w-6 shrink-0 ${i === active ? 'text-amber' : 'text-ink-faint'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block truncate font-display text-lg leading-tight ${i === active ? 'text-ink' : 'text-ink-dim'}`}
                  >
                    {r.title}
                  </span>
                  <span className="block text-xs text-ink-faint mt-0.5">
                    {r?.client !== '' ? r.client + ' /' : ''} {r.views}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-ink-faint tabular-nums shrink-0">
                  {r.duration}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
