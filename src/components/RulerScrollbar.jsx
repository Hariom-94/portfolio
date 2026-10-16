import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export const marks = [
  { id: 'hero', label: 'V1', name: 'Intro' },
  { id: 'software', label: 'V2', name: 'Software' },
  { id: 'clients', label: 'V3', name: 'Clients' },
  { id: 'reel', label: 'V4', name: 'Reel' },
  { id: 'grade', label: 'V5', name: 'Grade' },
  { id: 'work', label: 'V6', name: 'Edits' },
  { id: 'contact', label: 'V7', name: 'Contact' },
];

/* ---------- tuning ---------- */
const TICKS = Array.from({ length: 101 }, (_, i) => i); // 0..100
const PAD = 12; // keeps 0 and 100 from touching the edges
const STRIP_W = 64; // px, width of the ruler strip (the w-16 area)
const PANEL_BG = 'bg-[#111215]'; // swap for your page-background token
const SMALL = 14; // px, inactive label
const BIG = 30; // px, active label
const TOP_SLOT = 26; // px between labels stacked at the top
const BOT_SLOT = 22; // px between labels stacked at the bottom
const ROTATE_IN_TRANSIT = true; // label turns vertical while it travels
const SPRING = { stiffness: 140, damping: 28, mass: 0.5 };

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (v) => v * v * (3 - 2 * v);
const pad3 = (n) => String(n).padStart(3, '0');

function RulerLabel({ item, i, n, p, h, interactive, onJump }) {
  const t = useTransform(p, (v) => smooth(clamp(v - (i - 1), 0, 1)));
  const act = useTransform(p, (v) => clamp(1 - Math.abs(v - i), 0, 1));

  const y = useTransform([t, h], ([tv, hv]) =>
    lerp(hv - PAD - (n - 1 - i) * BOT_SLOT - SMALL, PAD + i * TOP_SLOT, tv),
  );
  const fontSize = useTransform(act, [0, 1], [SMALL, BIG]);
  const opacity = useTransform(act, [0, 1], [0.5, 1]);
  const rotate = useTransform(t, (v) =>
    ROTATE_IN_TRANSIT ? -90 * Math.sin(Math.PI * v) : 0,
  );

  return (
    <motion.button
      type="button"
      title={`${item.label} · ${item.name}`}
      onClick={(e) => onJump(e, item.id)}
      onPointerDown={(e) => e.stopPropagation()}
      className={`absolute right-0 top-0 cursor-pointer font-scroll whitespace-nowrap font-display font-bold uppercase leading-none tracking-[0.12em] text-ink ${
        interactive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ y, fontSize, opacity, rotate, originX: 1, originY: 0.5 }}
    >
      {item.name}
    </motion.button>
  );
}

function MobileNav({ items, activeIdx, progress, onJump }) {
  const [sheet, setSheet] = useState(false);
  const cur = items[activeIdx] ?? items[0];
  if (!cur) return null;

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {sheet && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[999] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
            />
            <motion.ul
              key="sheet"
              className="fixed inset-x-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))_+_3.5rem)] z-[1000] overflow-hidden border border-line bg-[#111215]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {items.map((m, i) => (
                <li key={m.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSheet(false);
                      onJump(null, m.id);
                    }}
                    className={`flex min-h-[48px] w-full items-center justify-between px-4 font-display text-sm font-semibold uppercase tracking-[0.14em] ${
                      i === activeIdx ? 'text-ink' : 'text-ink-faint'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="font-mono text-[10px] text-ink-faint">
                      {m.label}
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={sheet}
        onClick={() => setSheet((v) => !v)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[1000] flex min-h-[44px] -translate-x-1/2 items-center gap-3 overflow-hidden border border-line bg-[#111215] px-4"
      >
        <span className="font-mono text-[10px] text-ink-faint">
          {cur.label}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={cur.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ink"
          >
            {cur.name}
          </motion.span>
        </AnimatePresence>
        <span className="font-mono text-[10px] text-teal">
          {pad3(Math.floor(progress))}%
        </span>
        <span
          className="absolute bottom-0 left-0 h-px bg-teal"
          style={{ width: `${progress}%` }}
        />
      </button>
    </div>
  );
}

export default function RulerScrollbar({
  items = marks,
  topOffset, // px override; leave undefined to auto-measure the navbar
  navSelector = 'header, nav', // CSS selector of your fixed/sticky navbar
  scrollOffset = 50, // px of space left above a section after clicking a label
}) {
  const railRef = useRef(null);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const settle = useRef(null);
  const lastActive = useRef(0);

  const topsRef = useRef([]); // section tops in page px
  const vhRef = useRef(800);
  const maxRef = useRef(1);

  const [H, setH] = useState(800);
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState({ top: 0, height: 15 });
  const [offsets, setOffsets] = useState({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  // pointer over the ruler strip: { x, y } in viewport px, { u } = ruler value 0-100
  const [hover, setHover] = useState(null);

  const n = items.length;
  const { scrollY } = useScroll();
  const hMV = useMotionValue(800);

  // Start the rail below a fixed/sticky navbar so the top labels stay visible.
  const [navH, setNavH] = useState(0);
  useEffect(() => {
    if (topOffset != null) return;
    const el = document.querySelector(navSelector);
    if (!el) return;
    const update = () => {
      const pos = getComputedStyle(el).position;
      const fixed = pos === 'fixed' || pos === 'sticky';
      setNavH(
        fixed ? Math.max(0, Math.round(el.getBoundingClientRect().bottom)) : 0,
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [topOffset, navSelector]);

  // fractional section index from scroll position
  const rawP = useTransform(scrollY, (y) => {
    const tops = topsRef.current;
    if (!tops.length) return 0;
    const frac = clamp(y / maxRef.current, 0, 1);
    const r = y + vhRef.current * (0.4 + 0.6 * frac); // reaches the last section at page end
    if (r <= tops[0]) return 0;
    for (let i = tops.length - 1; i >= 0; i--) {
      if (r >= tops[i]) {
        if (i === tops.length - 1) return i;
        const span = Math.max(tops[i + 1] - tops[i], 1);
        return i + clamp((r - tops[i]) / span, 0, 1);
      }
    }
    return 0;
  });
  const p = useSpring(rawP, SPRING);

  useEffect(
    () =>
      p.on('change', (v) => {
        const a = clamp(Math.round(v), 0, n - 1);
        if (a !== lastActive.current) {
          lastActive.current = a;
          setActiveIdx(a);
        }
      }),
    [p, n],
  );

  const setOpenAnimated = useCallback((v) => {
    setOpen(v);
    setAnimating(true);
    clearTimeout(settle.current);
    settle.current = setTimeout(() => setAnimating(false), 420);
  }, []);

  const measure = useCallback(() => {
    const docH = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    const y = window.scrollY;
    const max = Math.max(docH - vh, 1);

    vhRef.current = vh;
    maxRef.current = max;
    setProgress(clamp((y / max) * 100, 0, 100));
    setView({ top: (y / docH) * 100, height: (vh / docH) * 100 });

    const tops = [];
    const next = {};
    items.forEach((m, i) => {
      const el = document.getElementById(m.id);
      const top = el
        ? el.getBoundingClientRect().top + y
        : (tops[i - 1] ?? 0) + 1;
      tops.push(top);
      next[m.id] = (top / docH) * 100;
    });
    topsRef.current = tops;
    setOffsets(next);
  }, [items]);

  useEffect(() => {
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    if (!railRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setH(e.contentRect.height);
      hMV.set(e.contentRect.height);
    });
    ro.observe(railRef.current);
    return () => ro.disconnect();
  }, [hMV]);

  /* ---------- ruler geometry ---------- */
  const span = Math.max(H - PAD * 2, 1);
  const lineY = PAD + (progress / 100) * span;
  const ppuIdle = clamp(span / Math.max(view.height, 4), 36, 120);
  const ppu = open ? span / 100 : ppuIdle;
  const tickY = (u) => (open ? PAD + u * ppu : lineY + (u - progress) * ppu);
  const tr = animating
    ? 'transition-[top,height,opacity] duration-300 ease-out'
    : '';

  // tick under the pointer (only meaningful while the full ruler is open)
  const hoverU = hover && open ? Math.round(hover.u) : null;

  /* ---------- interaction ---------- */
  const scrubTo = (clientY) => {
    const rect = railRef.current.getBoundingClientRect();
    const pct = clamp((clientY - rect.top - PAD) / span, 0, 1);
    window.scrollTo({ top: pct * maxRef.current });
  };
  const onPointerDown = (e) => {
    dragging.current = true;
    setOpenAnimated(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubTo(e.clientY);
  };
  const onPointerMove = (e) => dragging.current && scrubTo(e.clientY);
  const onPointerUp = () => {
    dragging.current = false;
    if (!hovering.current) setOpenAnimated(false);
  };
  // "+" cursor + highlighted tick only while over the ruler strip (not the labels)
  const onMouseMove = (e) => {
    if (!railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    if (rect.right - e.clientX > STRIP_W) {
      setHover(null);
      return;
    }
    setHover({
      x: e.clientX,
      y: e.clientY,
      u: clamp(((e.clientY - rect.top - PAD) / span) * 100, 0, 100),
    });
  };
  const jump = (e, id) => {
    e?.stopPropagation();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const small =
    'font-display text-[14px] font-semibold uppercase tracking-[0.14em] leading-tight transition-colors';

  return (
    <>
      <aside
        className="fixed bottom-0 right-0 z-[1000] hidden select-none md:block"
        style={{ top: topOffset ?? navH }}
        aria-label="Page navigation"
      >
        <div
          ref={railRef}
          onMouseEnter={() => {
            hovering.current = true;
            setOpenAnimated(true);
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => {
            hovering.current = false;
            setHover(null);
            if (!dragging.current) setOpenAnimated(false);
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`relative h-full touch-none transition-[width,background-color] duration-300
          ${hover ? 'cursor-none' : 'cursor-pointer'}
          ${open ? `w-52 border-l border-line ${PANEL_BG}` : 'w-16 border-l border-transparent'}`}
        >
          {/* ---------- ruler ---------- */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className={`absolute right-0 w-16 border-y border-ink-faint ${tr}`}
              style={{
                top: PAD + (view.top / 100) * span,
                height: (view.height / 100) * span,
                opacity: open ? 1 : 0,
              }}
            >
              <div className="absolute inset-0 bg-ink opacity-[0.07]" />
            </div>

            {TICKS.map((u) => {
              const major = u % 5 === 0;
              const hot = hoverU === u;
              // hide a neighbouring major number so it doesn't collide with the hot one
              const crowded =
                hoverU != null && !hot && Math.abs(hoverU - u) <= 1;
              return (
                <div
                  key={u}
                  className={`absolute right-0 flex h-0 items-center justify-end ${tr}`}
                  style={{ top: tickY(u) }}
                >
                  {(major || hot) && !crowded && (
                    <span
                      className={`mr-2 font-mono text-[9px] leading-none ${
                        hot
                          ? 'text-ink'
                          : Math.abs(progress - u) < 2.5
                            ? 'text-ink-dim'
                            : 'text-ink-faint'
                      }`}
                    >
                      {u}
                    </span>
                  )}
                  <span
                    className={`block transition-[width,background-color] duration-100 ${
                      hot
                        ? 'h-0.5 w-9 bg-ink opacity-100'
                        : `h-px bg-ink-faint opacity-60 ${major ? 'w-5' : 'w-2.5'}`
                    }`}
                  />
                </div>
              );
            })}

            <div
              className={`absolute right-0 w-16 border-t border-teal ${tr}`}
              style={{ top: lineY }}
            >
              <span className="absolute right-0.5 top-1 font-mono text-[9px] leading-none text-teal">
                {pad3(Math.floor(progress))} %
              </span>
            </div>
          </div>

          {/* ---------- HOVER: labels at real section positions ---------- */}
          <div
            className={`absolute inset-0 overflow-hidden transition-opacity duration-300
            ${open ? 'opacity-100 delay-100' : 'pointer-events-none opacity-0'}`}
          >
            {items.map((m, i) => {
              const pos = offsets[m.id];
              if (pos == null) return null;
              const y = clamp(PAD + (pos / 100) * span, 14, H - 14);
              return (
                <button
                  key={m.id}
                  type="button"
                  title={`${m.label} · ${m.name}`}
                  onClick={(e) => jump(e, m.id)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="group/label absolute left-0 right-0 flex -translate-y-1/2 cursor-pointer justify-end pr-[72px]"
                  style={{ top: y }}
                >
                  <span
                    className={`${small} ${
                      i === activeIdx ? 'text-ink' : 'text-ink-dim'
                    } group-hover/label:text-ink`}
                  >
                    {m.name}
                  </span>
                  <span className="absolute right-0 top-1/2 h-0.5 w-16 origin-right -translate-y-1/2 scale-x-0 bg-ink transition-transform duration-200 group-hover/label:scale-x-100" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- "+" cursor that replaces the pointer over the ruler ---------- */}
        {hover && (
          <span
            aria-hidden
            className="pointer-events-none fixed z-[1001] -translate-x-1/2 -translate-y-1/2 font-mono text-xl font-light leading-none text-ink"
            style={{ left: hover.x, top: hover.y }}
          >
            +
          </span>
        )}

        {/* ---------- IDLE: scroll-driven labels ----------
          Sibling of the rail (not a child) so hovering/clicking a label doesn't
          open the rail and fade the label out from under the cursor. */}
        <div
          className={`pointer-events-none absolute inset-y-0 right-[72px] w-0 transition-opacity duration-200
          ${open ? 'opacity-0' : 'opacity-100'}`}
        >
          {items.map((m, i) => (
            <RulerLabel
              key={m.id}
              item={m}
              i={i}
              n={n}
              p={p}
              h={hMV}
              interactive={!open}
              onJump={jump}
            />
          ))}
        </div>
      </aside>

      <MobileNav
        items={items}
        activeIdx={activeIdx}
        progress={progress}
        onJump={jump}
      />
    </>
  );
}
