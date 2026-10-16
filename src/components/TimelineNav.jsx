import { useEffect, useState } from 'react';
import headerLogo from '../assets/header_logo.png';

const marks = [
  { id: 'hero', label: 'V1', name: 'Intro' },
  { id: 'software', label: 'V2', name: 'Software' },
  { id: 'clients', label: 'V3', name: 'Clients' },
  { id: 'reel', label: 'V4', name: 'Reel' },
  { id: 'grade', label: 'V5', name: 'Grade' },
  { id: 'work', label: 'V6', name: 'Edits' },
  { id: 'contact', label: 'V7', name: 'Contact' },
];

export default function TimelineNav() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('hero');
  const [markPositions, setMarkPositions] = useState({});

  useEffect(() => {
    function updateMetrics() {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;

      // Calculate exact percentage position based on each section's actual scroll offsetTop
      const positions = {};
      marks.forEach((m) => {
        const el = document.getElementById(m.id);
        if (el && maxScroll > 0) {
          positions[m.id] = Math.min(1, Math.max(0, el.offsetTop / maxScroll));
        } else {
          positions[m.id] = 0;
        }
      });
      setMarkPositions(positions);
    }

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      setProgress(
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0,
      );

      const scrollPosition = scrollTop + window.innerHeight * 0.3;
      let current = marks[0].id;

      for (const m of marks) {
        const el = document.getElementById(m.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = m.id;
            break;
          } else if (scrollPosition >= top) {
            current = m.id;
          }
        }
      }
      setActive(current);
    }

    updateMetrics();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateMetrics, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  function jump(id) {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 56;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  const timecode = formatTimecode(progress);

  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex items-center h-14 gap-4 md:gap-8">
          <span className="font-display text-xl tracking-tight text-ink shrink-0">
            {/* HARI<span className="text-amber">OM</span>*/}
            <img src={headerLogo} className="w-15 h-5" />
          </span>

          {/* ruler */}
          <div className="relative flex-1 h-14 hidden sm:block">
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {Array.from({ length: 60 }).map((_, i) => (
                <line
                  key={i}
                  x1={`${(i / 59) * 100}%`}
                  x2={`${(i / 59) * 100}%`}
                  y1={i % 5 === 0 ? '58%' : '68%'}
                  y2="78%"
                  stroke="#262B2F"
                  strokeWidth="1"
                />
              ))}
            </svg>

            {/* Position markers relative to their exact section scroll heights */}
            <div className="absolute inset-0">
              {marks.map((m) => {
                const pos = markPositions[m.id] ?? 0;
                return (
                  <button
                    key={m.id}
                    onClick={() => jump(m.id)}
                    className="group absolute -translate-x-1/2 top-0 bottom-0 flex flex-col items-center justify-center cursor-pointer"
                    style={{ left: `${pos * 100}%` }}
                  >
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 border transition-colors ${
                        active === m.id
                          ? 'border-amber text-amber bg-amber/10'
                          : 'border-line text-ink-faint group-hover:text-ink-dim group-hover:border-ink-faint'
                      }`}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* playhead */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none transition-[left] duration-75"
              style={{ left: `${progress * 100}%` }}
            >
              <div className="w-px h-full bg-amber" />
              <div className="absolute -top-0.5 -left-[3px] w-[7px] h-[7px] bg-amber rotate-45" />
            </div>
          </div>

          <span className="font-mono text-xs text-ink-dim shrink-0 tabular-nums">
            {timecode}
          </span>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              jump('contact');
            }}
            className="shrink-0 hidden md:inline-flex items-center gap-2 text-xs font-mono border border-line px-3 py-1.5 text-ink hover:border-amber hover:text-amber transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </div>
  );
}

function formatTimecode(p) {
  const totalFrames = Math.round(p * (3 * 60 * 24 + 23));
  const fps = 24;
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}
