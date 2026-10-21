import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clientChannels, edited_videos } from '../data';
import { useEditedVideoViews } from '../hooks/useEditedVideoViews';

const compact = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export default function Hero() {
  const {
    totalViews: TOTAL_VIEWS,
    totalLikes,
    viewsById,
    foundCount,
  } = useEditedVideoViews();
  const [activeBar, setActiveBar] = useState(null);
  const totalEdits = edited_videos.length;

  // Ranked lists (no extra API calls)
  const rankedVideos = [...edited_videos].sort(
    (a, b) => (viewsById[b.yt_id] ?? 0) - (viewsById[a.yt_id] ?? 0),
  );
  const rankedChannels = [...clientChannels].sort((a, b) => b.views - a.views);
  const millionPlus = rankedVideos.filter(
    (v) => (viewsById[v.yt_id] ?? 0) >= 1_000_000,
  );

  // Derived stats; show an em dash until the first response arrives
  const ready = foundCount > 0;
  const avgViews = ready ? Math.round(TOTAL_VIEWS / foundCount) : 0;
  const topViews = ready ? Math.max(...Object.values(viewsById)) : 0;
  const likeRate = TOTAL_VIEWS ? (totalLikes / TOTAL_VIEWS) * 100 : 0;

  return (
    <section
      id="hero"
      className="relative pt-40 pb-24 md:pt-40 md:pb-32 border-b border-line overflow-hidden"
    >
      <Waveform activeBar={activeBar} setActiveBar={setActiveBar} />
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-faint border border-line px-2 py-1 mb-8">
            <span className="w-1.5 h-1.5 bg-amber" />
            V1
          </div>
          <h1 className="font-display font-semibold leading-[0.92] text-ink text-[clamp(2.6rem,7vw,6.2rem)] max-w-4xl">
            Editing that keeps{' '}
            <span className="text-amber font-glitch font-normal">millions</span>{' '}
            of people watching to the last frame.
          </h1>
          <p className="mt-8 max-w-[37rem] text-ink-dim text-base md:text-lg leading-relaxed">
            Hi, I'm <span className="text-amber font-cursive">Hariom</span>, a
            passionate video editor with{' '}
            <span className="text-amber font-cursive">2+ years</span> of
            experience transforming raw footage into{' '}
            <span className="text-amber font-cursive">stunning</span>,{' '}
            <span className="text-amber font-cursive">cinematic</span>,{' '}
            <span className="text-amber font-cursive">impactful</span> videos
            for brands, creators, and storytellers.{' '}
            <span className="text-amber font-cursive underline">
              Let's bring your ideas to life!
            </span>
          </p>
        </motion.div>

        {/* Container draws top + left borders; every Stat draws right + bottom,
            so the grid stays fully outlined across both rows. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 border-t border-l border-line"
        >
          {/* Row 1 */}
          <Stat
            big
            value={Number(TOTAL_VIEWS).toLocaleString('en-US')}
            label="Total views across edited videos"
            hint="Top videos"
            info="Combined YouTube views of only the videos I edited, fetched from YouTube. It doesn't include the channels' other videos, or videos edited by someone else."
            popover={
              <VideosList
                title="Edited videos · by views"
                videos={rankedVideos}
                viewsById={viewsById}
              />
            }
          />
          <Stat
            value={`${totalEdits}+`}
            label="Videos edited"
            info="Number of videos in my portfolio that I edited. Videos published before I joined a channel, or edited by others, are not counted."
          />
          <Stat
            value={clientChannels.length}
            label="Creator channels"
            hint="Who I've worked with"
            info="YouTube channels I've edited videos for. The subscriber and view numbers inside are the whole channel's totals, not just my videos."
            popover={<ChannelsList channels={rankedChannels} />}
          />

          {/* Row 2 */}
          <Stat
            value={ready ? millionPlus.length : '—'}
            label="Videos over 1M views"
            hint={millionPlus.length ? 'See them' : undefined}
            info="How many of the videos I edited have passed one million views on YouTube."
            popover={
              millionPlus.length ? (
                <VideosList
                  title="Videos over 1M views"
                  videos={millionPlus}
                  viewsById={viewsById}
                />
              ) : undefined
            }
          />
          <Stat
            value={ready ? compact.format(topViews) : '—'}
            label="Views on my best video"
            hint="Top 5 videos"
            info="Views on the single most-watched video I edited. Hover to see the top five."
            popover={
              <VideosList
                title="Top 5 videos"
                videos={rankedVideos.slice(0, 5)}
                viewsById={viewsById}
              />
            }
          />
          <Stat
            value={ready ? compact.format(avgViews) : '—'}
            label="Average views per video"
            info="Total views divided by the number of videos I edited. It shows typical performance, so one viral video doesn't carry the number."
          />
          <Stat
            value={ready ? `${likeRate.toFixed(1)}%` : '—'}
            label="Like rate across edits"
            info="Likes divided by views across the videos I edited. Videos that hide their like count are counted as zero, so the real rate may be slightly higher."
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Stat: opens an explanation (and optional list) on hover / tap / focus ---------- */

const EDGE = 16; // min gap kept between the popover and the viewport edge
const MAX_PANEL_H = 480; // never taller than this, even with lots of room

// The area the popover can really be seen in: the viewport, shrunk by any
// ancestor that clips its content (overflow hidden / auto / scroll / clip).
// This is what stops a popover being cut off by the hero's overflow-hidden.
function getVisibleBounds(el) {
  const clips = /(hidden|clip|auto|scroll)/;
  let top = 0;
  let left = 0;
  let right = window.innerWidth;
  let bottom = window.innerHeight;

  let p = el.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const cs = getComputedStyle(p);
    if (clips.test(cs.overflowX) || clips.test(cs.overflowY)) {
      const r = p.getBoundingClientRect();
      top = Math.max(top, r.top);
      left = Math.max(left, r.left);
      right = Math.min(right, r.right);
      bottom = Math.min(bottom, r.bottom);
    }
    p = p.parentElement;
  }
  return { top, left, right, bottom };
}

function Stat({ value, label, big, info, hint, popover }) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState(null); // { v: 'above'|'below', h: 'left'|'right', maxH }
  const rootRef = useRef(null);
  const interactive = Boolean(info || popover);
  const hasList = Boolean(popover);

  // Pick the side of the stat that has the most visible room.
  // Re-measured on open, resize and scroll so it always stays in view.
  useLayoutEffect(() => {
    if (!open) {
      setPlace(null);
      return;
    }

    const measure = () => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const b = getVisibleBounds(el);

      // vertical: whichever side has more VISIBLE space
      const above = r.top - b.top - EDGE;
      const below = b.bottom - r.bottom - EDGE;
      const v = below > above ? 'below' : 'above';
      const room = v === 'below' ? below : above;
      const maxH = Math.max(160, Math.min(room, MAX_PANEL_H));

      // horizontal: align to the left edge unless that overflows more
      const w = Math.min(hasList ? 416 : 288, b.right - b.left - 2 * EDGE);
      const overflowIfLeft = Math.max(0, r.left + w - (b.right - EDGE));
      const overflowIfRight = Math.max(0, b.left + EDGE - (r.right - w));
      const h = overflowIfLeft <= overflowIfRight ? 'left' : 'right';

      setPlace((prev) =>
        prev && prev.v === v && prev.h === h && prev.maxH === maxH
          ? prev
          : { v, h, maxH },
      );
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, hasList]);

  // Close when tapping/clicking outside (needed for touch devices)
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const handlers = interactive
    ? {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onClick: () => setOpen(true), // tap on touch; outside tap closes
        onFocus: () => setOpen(true),
        onBlur: (e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        },
        onKeyDown: (e) => e.key === 'Escape' && setOpen(false),
        tabIndex: 0,
      }
    : {};

  const slide = place?.v === 'above' ? 8 : -8;

  return (
    <div
      ref={rootRef}
      {...handlers}
      style={open ? { zIndex: 1000 } : undefined}
      className={`relative z-999 p-6 md:p-8 border-r border-b border-line outline-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${big ? 'col-span-2' : ''}`}
    >
      <div
        className={`font-mono tabular-nums text-teal ${
          big ? 'text-[clamp(2rem,5vw,3.4rem)]' : 'text-2xl md:text-3xl'
        }`}
      >
        {value}
      </div>
      <div className="mt-2 text-xs md:text-sm text-ink-faint leading-snug max-w-[18ch]">
        {label}
      </div>

      {interactive && (
        <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-amber opacity-70 group-hover:opacity-100 transition-opacity">
          {hint ?? "What's this?"}
          <span
            className={`inline-block transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          >
            ▲
          </span>
        </div>
      )}

      <AnimatePresence>
        {open && interactive && place && (
          <motion.div
            initial={{ opacity: 0, y: slide }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: slide }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            // flush against the stat (no margin) = no hover gap
            className={`absolute ${
              place.v === 'above' ? 'bottom-full' : 'top-full'
            } ${place.h === 'left' ? 'left-0' : 'right-0'} ${
              hasList
                ? 'w-[min(26rem,calc(100vw-2rem))]'
                : 'w-[min(18rem,calc(100vw-2rem))]'
            } cursor-default`}
          >
            <div
              className={`${panel} flex flex-col`}
              style={{ maxHeight: place.maxH }}
            >
              {info && <InfoBlock text={info} divider={hasList} />}
              {popover}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Popover contents ---------- */

// Glass panel. Swap bg-[#0c0c0d] for your background token if you have one.
const panel =
  'border border-line/70 bg-[#0c0c0d]/80 backdrop-blur-lg backdrop-saturate-150 shadow-2xl';

function InfoBlock({ text, divider }) {
  return (
    <div
      className={`shrink-0 px-4 py-3 ${
        divider ? 'border-b border-line/70' : ''
      }`}
    >
      <p className="font-display text-[13px] leading-relaxed text-ink-dim">
        {text}
      </p>
    </div>
  );
}

function ListHeader({ title, count }) {
  return (
    <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-line/70 font-display text-[11px] uppercase tracking-wider text-ink-faint">
      <span>{title}</span>
      <span>{count}</span>
    </div>
  );
}

function VideosList({ title, videos, viewsById }) {
  return (
    <>
      <ListHeader title={title} count={videos.length} />
      <ul className="min-h-0 max-h-72 overflow-y-auto overscroll-contain">
        {videos.map((v, i) => {
          const views = viewsById[v.yt_id];
          return (
            <li key={v.yt_id}>
              <a
                href={`https://www.youtube.com/watch?v=${v.yt_id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors"
              >
                <span className="w-5 shrink-0 text-right font-mono text-[10px] text-ink-faint">
                  {i + 1}
                </span>
                <img
                  src={`https://i.ytimg.com/vi/${v.yt_id}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="w-20 shrink-0 aspect-video object-cover bg-black"
                />
                <p className="min-w-0 flex-1 font-display text-sm font-medium leading-snug text-ink line-clamp-2">
                  {v.title}
                </p>
                <span className="shrink-0 font-mono text-xs text-teal">
                  {views != null ? compact.format(views) : '…'}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function ChannelsList({ channels }) {
  return (
    <>
      <ListHeader title="Creator channels" count={channels.length} />
      <ul className="min-h-0 max-h-72 overflow-y-auto overscroll-contain">
        {channels.map((c) => (
          <li key={c.handle}>
            <a
              href={`https://www.youtube.com/${c.handle}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
            >
              <img
                src={c.avatar}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-10 h-10 shrink-0 rounded-full object-cover"
                style={{ backgroundColor: `#${c.color}` }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-ink truncate">
                  {c.name}
                </p>
                <p className="font-display text-xs text-ink-faint truncate">
                  {c.niche} · since {c.since}
                </p>
              </div>
              <div className="shrink-0 text-right font-mono text-xs">
                <div className="text-teal">{c.subs} subs</div>
                <div className="text-ink-faint">
                  {compact.format(c.views)} views
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------- Waveform (unchanged) ---------- */

export function Waveform({ activeBar, setActiveBar }) {
  const [time, setTime] = useState(0);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) * 0.001;
      setTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const bars = Array.from({ length: 140 }).map((_, i) => {
    const speed = 0.8;
    const t = time * speed;
    return (
      6 +
      Math.abs(Math.sin(i * 0.35 + t * 1.8)) * 40 +
      Math.abs(Math.sin(i * 0.9 - t * 2.2)) * 14
    );
  });

  return (
    <div className="z-99 absolute right-0 top-0 bottom-0 w-1/2 opacity-35 pointer-events-auto hidden lg:flex items-center justify-end gap-[2px]">
      {bars.map((h, i) => {
        const isHovered = activeBar === i;
        return (
          <div
            key={i}
            onMouseEnter={() => setActiveBar(i)}
            onMouseLeave={() => setActiveBar(null)}
            className="h-full flex items-center cursor-pointer px-[0.5px]"
          >
            <div
              className={`w-[2px] rounded-full origin-center ${
                isHovered
                  ? 'bg-amber scale-y-150 opacity-100 z-10'
                  : 'bg-ink opacity-50'
              }`}
              style={{
                height: `${h}%`,
                transitionProperty: 'transform, background-color, opacity',
                transitionDuration: isHovered ? '75ms' : '200ms',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
