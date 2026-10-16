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

const labelClass = 'block font-mono text-[11px] text-ink-faint mb-1';

const inputClass =
  'w-full bg-transparent border-0 border-b border-line px-0 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-amber focus:ring-0 outline-none transition-colors';

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
                className={`${inputClass} [&>option]:bg-panel`}
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
                className={`${inputClass} resize-none`}
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
                  className="group inline-flex items-center gap-2 font-mono text-xs px-5 py-3 border border-line text-ink hover:border-teal hover:text-teal transition-colors"
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

const pad = (n) => String(n).padStart(2, '0');

function timecode(frame) {
  const f = frame % FPS;
  const s = Math.floor(frame / FPS) % 60;
  const m = Math.floor(frame / FPS / 60);
  return `00:${pad(m)}:${pad(s)}:${pad(f)}`;
}

// Fixed pseudo-waveform so it doesn't change between renders
const waveform = Array.from({ length: 64 }, (_, i) =>
  Math.round(18 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.4)) * 72),
);

// Widths are percentages and should add up to 100
const videoClips = [
  { w: 28, label: 'intro' },
  { w: 34, label: 'b-roll' },
  { w: 38, label: 'main' },
];

function EditorFrame() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!playing || reduce) return;

    const id = setInterval(
      () => setFrame((f) => (f + 1) % TOTAL_FRAMES),
      1000 / FPS,
    );
    return () => clearInterval(id);
  }, [playing]);

  const progress = (frame / TOTAL_FRAMES) * 100;

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
          {playing ? 'PLAY' : 'PAUSE'}
        </span>
        <span>profile.mov</span>
        <span>{FPS} fps</span>
      </div>

      {/* Program monitor */}
      <div className="relative aspect-[16/9] sm:aspect-[4/5] max-h-[460px] w-full overflow-hidden bg-bg">
        <img
          src="/profile.png"
          alt="Hariom Kumar — Video Editor"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
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
              {videoClips.map((c) => (
                <div
                  key={c.label}
                  style={{ width: `${c.w}%` }}
                  className="truncate border border-amber/50 bg-amber/15 px-1.5 font-mono text-[9px] leading-7 text-amber"
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

          {/* Playhead — container lines up with the track area */}
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
        </div>
      </div>
    </div>
  );
}
