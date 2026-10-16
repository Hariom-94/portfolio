import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TOTAL_VIEWS,
  clientChannels,
  portfolioItems,
  featuredReels,
} from '../data.js';

function useLiveViews(target, durationMs = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const liveInterval = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / durationMs);
        // Smooth ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          // Animation finished → start slow continuous growth
          liveInterval.current = setInterval(() => {
            setValue((prev) => prev + Math.floor(Math.random() * 7) + 2); // +2 to +8 views
          }, 2500);
        }
      };

      requestAnimationFrame(tick);
    };

    // IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    // Fallback for cases where element is already in view on load
    const fallbackTimer = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        startAnimation();
      }
    }, 400);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
      if (liveInterval.current) clearInterval(liveInterval.current);
    };
  }, [target, durationMs]);

  return [value, ref];
}

export default function Hero() {
  const [value, ref] = useLiveViews(TOTAL_VIEWS);
  const [activeBar, setActiveBar] = useState(null);
  const longForm = featuredReels.length;
  // const totalEdits = portfolioItems.length + featuredReels.length;
  const totalEdits = 45;

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
          <p className="mt-8 max-w-xl text-ink-dim text-base md:text-lg leading-relaxed">
            I cut long-form YouTube video for creators who need every minute to
            earn its retention — story structure, pacing, sound design and
            color, from raw footage to publish-ready file.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 border border-line"
        >
          <Stat
            value={value.toLocaleString('en-US')}
            label="Total views across edited videos"
            big
          />
          <Stat value={`${totalEdits}+`} label="Videos edited" />
          {/* <Stat value={longForm} label="Flagship long-form pieces" />*/}
          <Stat value={clientChannels.length} label="Creator channels" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label, big }) {
  return (
    <div
      className={`z-999 p-6 md:p-8 border-line ${
        big
          ? 'col-span-2 border-b md:border-b-0 md:border-r'
          : 'border-t md:border-t-0 md:border-r last:border-r-0 border-line'
      }`}
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
    </div>
  );
}

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
    const h =
      6 +
      Math.abs(Math.sin(i * 0.35 + t * 1.8)) * 40 +
      Math.abs(Math.sin(i * 0.9 - t * 2.2)) * 14;
    return h;
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
