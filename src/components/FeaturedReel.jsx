import { useEffect, useRef, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { featuredReels } from '../data.js';
import { SectionHeading } from './ClientChannels.jsx';

const thumbUrl = (r) =>
  r.thumbnail ??
  `https://image.mux.com/${r.playbackId}/thumbnail.jpg?width=320&height=180&fit_mode=smartcrop&time=${r.thumbTime ?? 5}`;

export default function FeaturedReel() {
  const [active, setActive] = useState(0);
  const reel = featuredReels[active];
  const isVertical = reel.aspectRatio === '9/16' || reel.category === 'Shorts';

  const playerRef = useRef(null); // the <mux-player> element
  const wrapRef = useRef(null); // the box around the player

  // Pause the video as soon as the player is mostly scrolled out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Don't pause while the player is fullscreen
        if (document.fullscreenElement || document.webkitFullscreenElement)
          return;
        if (!entry.isIntersecting) playerRef.current?.pause?.();
      },
      { threshold: 0.25 }, // pause once less than 25% of it is visible
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // When the player's own fullscreen button is pressed, rotate to landscape
  // (landscape videos only). Release the lock when leaving fullscreen.
  // Works on Android Chrome; iPhone Safari rotates with the phone by itself.
  useEffect(() => {
    const onFsChange = async () => {
      const fsEl =
        document.fullscreenElement || document.webkitFullscreenElement;
      try {
        if (fsEl && !isVertical) await screen.orientation?.lock?.('landscape');
        else screen.orientation?.unlock?.();
      } catch {
        // Not supported or not allowed, ignore
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      try {
        screen.orientation?.unlock?.();
      } catch {
        // ignore
      }
    };
  }, [isVertical]);

  return (
    <section id="reel" className="border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V4" title="Four long-form edits" />
        <p className="mt-4 max-w-lg text-ink-dim">
          The full-length pieces — the ones where structure, pacing and a clean
          sound mix decide whether someone watches to minute twenty.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-px bg-line border border-line">
          <div ref={wrapRef} className="bg-bg p-4 md:p-6 min-w-0">
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
              className="block w-full max-w-full"
              style={{
                aspectRatio: reel.aspectRatio === '16/9' ? '16 / 9' : '9 / 16',
                '--media-object-fit': 'contain',
                '--media-object-position': 'center',
              }}
            />

            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
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

          <div className="bg-bg flex flex-col divide-y divide-line-soft min-w-0">
            {featuredReels.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActive(i)}
                className={`group text-left p-4 md:p-5 flex items-center gap-4 transition-colors ${
                  i === active ? 'bg-raised' : 'hover:bg-panel'
                }`}
              >
                {/* Thumbnail */}
                <span
                  className={`relative block w-28 md:w-36 shrink-0 aspect-video overflow-hidden border ${
                    i === active ? 'border-amber' : 'border-line'
                  }`}
                >
                  <img
                    src={thumbUrl(r)}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full object-cover transition-opacity ${
                      i === active
                        ? 'opacity-100'
                        : 'opacity-70 group-hover:opacity-100'
                    }`}
                  />
                  <span className="absolute left-1.5 top-1.5 bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                    <span className={i === active ? 'text-amber' : ''}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-ink tabular-nums">
                    {r.duration}
                  </span>
                </span>

                {/* Text */}
                <span className="flex-1 min-w-0">
                  <span
                    className={`block truncate font-display text-lg leading-tight ${
                      i === active ? 'text-ink' : 'text-ink-dim'
                    }`}
                  >
                    {r.title}
                  </span>
                  <span className="block text-xs text-ink-faint mt-0.5">
                    {r?.client !== ''
                      ? r.client + ` / ${r.views}`
                      : 'Self Practice'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
