import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { SectionHeading } from './ClientChannels.jsx';

// ---------------------------------------------------------------------------
// EmailJS configuration — set these values in your .env file.
// ---------------------------------------------------------------------------
const EMAILJS_SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const WHATSAPP_NUMBER = '917364877930';
const WHATSAPP_MESSAGE =
  "Hi Hariom, I'd like to discuss a video editing project. Here's my channel: ";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const projectTypes = [
  'Long-form YouTube',
  'Shorts / clips',
  'Documentary',
  'Something else',
];

const labelClass = 'block font-mono text-[14px] text-ink-faint mb-1';

const inputClass =
  'w-full min-w-0 rounded-md border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-all duration-200 focus:border-amber focus:ring-1 focus:ring-amber/30';

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');

  function handleSubmit(e) {
    e.preventDefault();

    if (!formRef.current) return;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus('error');
      console.warn(
        'EmailJS is not configured. Please check your environment variables.',
      );
      return;
    }

    setStatus('sending');

    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      .then(() => {
        setStatus('sent');
        formRef.current?.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setStatus('error');
      });
  }

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V7" title="Start a project" />

        <p className="mt-4 max-w-lg text-ink-dim">
          Send over your channel, a link to recent uploads and what you need
          edited. I reply within two business days.
        </p>

        <div className="mt-14 grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start">
          {/* Left — video editor frame */}
          <div>
            <EditorFrame />
          </div>

          {/* Right — form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <Field
                label="Name"
                name="from_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
              />
              <Field
                label="Email"
                name="reply_to"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="project_type" className={labelClass}>
                Project type
              </label>
              <select
                id="project_type"
                name="project_type"
                required
                defaultValue=""
                className={`${inputClass} [&>option]:bg-panel [&>option]:text-ink`}
              >
                <option value="" disabled>
                  Select one
                </option>
                {projectTypes.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="Channel link"
              name="channel_url"
              type="url"
              placeholder="https://youtube.com/@yourchannel"
            />

            <div>
              <label htmlFor="message" className={labelClass}>
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={3}
                placeholder="Upload frequency, footage length, style references…"
                className={`${inputClass} min-h-28 resize-y`}
              />
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="font-mono text-xs px-5 py-3 border border-amber text-amber hover:bg-amber hover:text-bg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : 'Send project brief'}
                </button>

                {status === 'sent' && (
                  <span role="status" className="text-xs text-teal font-mono">
                    Sent — I'll reply within two business days.
                  </span>
                )}
                {status === 'error' && (
                  <span role="alert" className="text-xs text-amber font-mono">
                    Couldn't send your message. Please check the configuration
                    and try again.
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4 font-mono text-[11px] text-ink-faint">
                <span className="h-px flex-1 bg-line-soft" />
                or
                <span className="h-px flex-1 bg-line-soft" />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-xs text-sm text-ink-dim">
                  Need a faster reply? Message me directly on WhatsApp.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-md border border-teal bg-teal text-bg px-5 py-3 font-mono text-xs transition-colors hover:bg-transparent hover:text-teal sm:bg-transparent sm:text-teal"
                >
                  Chat on WhatsApp
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label htmlFor={props.name} className={labelClass}>
        {label}
      </label>
      <input id={props.name} {...props} className={inputClass} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Video editor frame
// ---------------------------------------------------------------------------
const FPS = 24;
const LOOP_SECONDS = 20;
const TOTAL_FRAMES = FPS * LOOP_SECONDS;
const GLITCH_BURST_FRAMES = 10;

const pad = (n) => String(n).padStart(2, '0');

function timecode(frame) {
  const f = frame % FPS;
  const s = Math.floor(frame / FPS) % 60;
  const m = Math.floor(frame / FPS / 60);
  return `00:${pad(m)}:${pad(s)}:${pad(f)}`;
}

// Deterministic pseudo-random (0–1) so the same frame always looks the same
function rand(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Fixed pseudo-waveform so it doesn't change between renders
const waveform = Array.from({ length: 64 }, (_, i) =>
  Math.round(18 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.4)) * 72),
);

// Widths are percentages and should add up to 100
const videoClips = [
  { w: 28, label: 'intro', fx: 'GLITCH' },
  { w: 34, label: 'b-roll', fx: 'WARM GRADE' },
  { w: 38, label: 'main', fx: 'CLEAN' },
];

// Cumulative end of each clip, in percent: [28, 62, 100]
const clipEnds = videoClips.reduce((acc, c) => {
  acc.push((acc[acc.length - 1] ?? 0) + c.w);
  return acc;
}, []);

// Frames where a cut happens (including the loop start)
const cutFrames = [
  0,
  ...clipEnds.slice(0, -1).map((p) => Math.round((p / 100) * TOTAL_FRAMES)),
];

function getFx(frame, scrubbing, reduce) {
  const progress = (frame / TOTAL_FRAMES) * 100;
  let clipIdx = clipEnds.findIndex((end) => progress < end);
  if (clipIdx === -1) clipIdx = videoClips.length - 1;

  const start = clipIdx === 0 ? 0 : clipEnds[clipIdx - 1];
  const t = (progress - start) / videoClips[clipIdx].w; // 0–1 inside the clip

  // Per-clip look
  let filter;
  let scale;
  if (clipIdx === 0) {
    filter = `grayscale(${0.9 - 0.5 * t}) contrast(1.25) brightness(${0.85 + 0.15 * t})`;
    scale = 1 + 0.04 * t;
  } else if (clipIdx === 1) {
    filter = 'sepia(0.45) saturate(1.35) hue-rotate(-12deg) contrast(1.1)';
    scale = 1.12 - 0.06 * t;
  } else {
    filter = 'saturate(1.05) contrast(1.02)';
    scale = 1 + 0.08 * t;
  }

  // Glitch intensity (0–1)
  let intensity = 0;
  if (!reduce) {
    for (const c of cutFrames) {
      const d = frame - c;
      if (d >= 0 && d < GLITCH_BURST_FRAMES) {
        intensity = Math.max(intensity, 1 - d / GLITCH_BURST_FRAMES);
      }
    }
    // Random bursts during the intro clip
    if (clipIdx === 0 && rand(Math.floor(frame / 5)) > 0.85) {
      intensity = Math.max(intensity, 0.6);
    }
    if (scrubbing) intensity = Math.max(intensity, 0.35);
  }

  return { clipIdx, filter, scale, intensity };
}

// Red / cyan channel ghost used for the RGB-split look
function Ghost({ color, dx }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background: color,
        mixBlendMode: 'screen',
        isolation: 'isolate',
        opacity: 0.85,
        transform: `translateX(${dx}px)`,
      }}
    >
      <img
        src="/profile.png"
        alt=""
        className="h-full w-full object-cover object-center"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}

function EditorFrame() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const wasPlaying = useRef(false);

  const [reduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!playing || reduce) return;

    const id = setInterval(
      () => setFrame((f) => (f + 1) % TOTAL_FRAMES),
      1000 / FPS,
    );
    return () => clearInterval(id);
  }, [playing, reduce]);

  const progress = (frame / TOTAL_FRAMES) * 100;
  const { clipIdx, filter, scale, intensity } = getFx(frame, scrubbing, reduce);
  const clip = videoClips[clipIdx];

  // Glitch pieces for this frame
  const shift = intensity * 8;
  const slices =
    intensity > 0
      ? Array.from({ length: 3 }, (_, i) => {
          const top = rand(frame * 3 + i) * 80;
          const h = 4 + rand(frame * 7 + i) * 14;
          return {
            top,
            bottom: Math.max(0, 100 - top - h),
            dx: (rand(frame * 5 + i) - 0.5) * 60 * intensity,
          };
        })
      : [];

  // --- Scrubbing ----------------------------------------------------------
  function frameFromPointer(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    return Math.min(TOTAL_FRAMES - 1, Math.round(ratio * TOTAL_FRAMES));
  }

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    wasPlaying.current = playing;
    setPlaying(false);
    setScrubbing(true);
    setFrame(frameFromPointer(e));
  }

  function handlePointerMove(e) {
    if (!scrubbing) return;
    setFrame(frameFromPointer(e));
  }

  function endScrub() {
    if (!scrubbing) return;
    setScrubbing(false);
    if (wasPlaying.current) setPlaying(true);
  }

  function handleKeyDown(e) {
    const step = e.shiftKey ? FPS : 1;
    if (e.key === 'ArrowRight') {
      setFrame((f) => Math.min(TOTAL_FRAMES - 1, f + step));
    } else if (e.key === 'ArrowLeft') {
      setFrame((f) => Math.max(0, f - step));
    } else if (e.key === 'Home') {
      setFrame(0);
    } else if (e.key === 'End') {
      setFrame(TOTAL_FRAMES - 1);
    } else {
      return;
    }
    e.preventDefault();
    setPlaying(false);
  }

  return (
    <div className="border border-amber/60 bg-panel">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-amber/30 px-3 py-2 font-mono text-[10px] text-ink-faint">
        <span className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-amber ${
              playing ? 'animate-pulse' : ''
            }`}
          />
          {scrubbing ? 'SCRUB' : playing ? 'PLAY' : 'PAUSE'}
        </span>
        <span>profile.mov</span>
        <span>{FPS} fps</span>
      </div>

      {/* Program monitor */}
      <div className="relative aspect-[16/9] sm:aspect-[4/5] max-h-[460px] w-full overflow-hidden bg-bg">
        {/* Stage: grade + zoom apply to every layer inside */}
        <div
          className="absolute inset-0"
          style={{ filter, transform: `scale(${scale})` }}
        >
          <img
            src="/profile.png"
            alt="Hariom Kumar — Video Editor"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
          />

          {intensity > 0 && (
            <>
              <Ghost color="#ff0000" dx={shift} />
              <Ghost color="#00ffff" dx={-shift} />
              {slices.map((s, i) => (
                <img
                  key={i}
                  src="/profile.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                  style={{
                    clipPath: `inset(${s.top}% 0 ${s.bottom}% 0)`,
                    transform: `translateX(${s.dx}px)`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Scanlines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Safe-area guide */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[8%] border border-ink/20"
        />

        {/* Center cross */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/30" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink/30" />
        </div>

        {/* Corner crop marks */}
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 h-3 w-3 border-l border-t border-amber"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 h-3 w-3 border-r border-t border-amber"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-amber"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-amber"
        />

        {/* Active clip + effect label */}
        <span className="absolute left-8 top-2.5 bg-bg/70 px-2 py-0.5 font-mono text-[10px] text-amber">
          {clip.label.toUpperCase()} · {clip.fx}
        </span>

        {/* Timecode overlay */}
        <span className="absolute bottom-5 left-5 bg-bg/70 px-2 py-1 font-mono text-[11px] text-amber tabular-nums">
          {timecode(frame)}
        </span>
      </div>

      {/* Transport */}
      <div className="flex items-center justify-between border-t border-amber/30 px-3 py-2 font-mono text-[11px] text-ink-faint">
        <span className="tabular-nums text-ink-dim">{timecode(frame)}</span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setFrame((f) => Math.max(0, f - FPS))}
            aria-label="Back one second"
            className="hover:text-amber transition-colors"
          >
            ◀◀
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause' : 'Play'}
            className="w-4 text-center text-amber"
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button
            type="button"
            onClick={() => setFrame((f) => (f + FPS) % TOTAL_FRAMES)}
            aria-label="Forward one second"
            className="hover:text-amber transition-colors"
          >
            ▶▶
          </button>
        </div>

        <span className="tabular-nums">{timecode(TOTAL_FRAMES)}</span>
      </div>

      {/* Timeline */}
      <div className="border-t border-amber/30 px-3 pb-3 pt-4">
        <div className="relative">
          {/* Ruler (offset by the 1.75rem label column) */}
          <div
            aria-hidden="true"
            className="mb-2 ml-7 flex h-2 items-end justify-between border-b border-line-soft"
          >
            {Array.from({ length: 21 }).map((_, i) => (
              <span
                key={i}
                className={`w-px bg-line ${i % 5 === 0 ? 'h-2' : 'h-1'}`}
              />
            ))}
          </div>

          {/* V1 track */}
          <div className="flex items-center gap-2">
            <span className="w-5 font-mono text-[9px] text-ink-faint">V1</span>
            <div className="flex h-7 flex-1 gap-px">
              {videoClips.map((c, i) => (
                <div
                  key={c.label}
                  style={{ width: `${c.w}%` }}
                  className={`truncate border border-amber/50 px-1.5 font-mono text-[9px] leading-7 text-amber transition-colors ${
                    i === clipIdx ? 'bg-amber/30' : 'bg-amber/10'
                  }`}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* A1 track */}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="w-5 font-mono text-[9px] text-ink-faint">A1</span>
            <div className="flex h-7 flex-1 items-center gap-px border border-line bg-bg/40 px-0.5">
              {waveform.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-ink-faint/60"
                />
              ))}
            </div>
          </div>

          {/* Playhead */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-7 right-0"
          >
            <div
              className="absolute bottom-0 top-0"
              style={{ left: `${progress}%` }}
            >
              <span className="absolute -top-0.5 left-0 h-0 w-0 -translate-x-1/2 border-x-4 border-t-[6px] border-x-transparent border-t-amber" />
              <span className="block h-full w-px bg-amber" />
            </div>
          </div>

          {/* Scrub area: drag anywhere on the timeline */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Timeline playhead"
            aria-valuemin={0}
            aria-valuemax={TOTAL_FRAMES - 1}
            aria-valuenow={frame}
            aria-valuetext={timecode(frame)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endScrub}
            onPointerCancel={endScrub}
            onKeyDown={handleKeyDown}
            className="absolute inset-y-0 left-7 right-0 cursor-ew-resize touch-pan-y outline-none focus-visible:ring-1 focus-visible:ring-amber/60"
          />
        </div>

        <p className="mt-3 pl-7 font-mono text-[9px] text-ink-faint">
          Drag the timeline to scrub
        </p>
      </div>
    </div>
  );
}
