import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { SectionHeading } from './ClientChannels.jsx';

// ---------------------------------------------------------------------------
// EmailJS setup — replace these three values with your own from
// https://dashboard.emailjs.com, or read the README for the walkthrough.
// ---------------------------------------------------------------------------
const EMAILJS_SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const projectTypes = [
  'Long-form YouTube',
  'Shorts / clips',
  'Brand film',
  'Documentary',
  'Something else',
];

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function handleSubmit(e) {
    e.preventDefault();
    if (!formRef.current) return;

    if (EMAILJS_SERVICE_ID.startsWith('YOUR_')) {
      setStatus('error');
      console.warn(
        'EmailJS is not configured yet — set EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY in src/components/Contact.jsx',
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
        console.error(err);
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

        <div className="mt-12 grid lg:grid-cols-[1fr_1.3fr] gap-px bg-line border border-line">
          <div className="bg-bg p-6 md:p-10 flex flex-col justify-between">
            <div className="space-y-8">
              <InfoRow label="Availability" value="Booking for Q1" />
              <InfoRow label="Turnaround" value="3–7 days per long-form edit" />
              <InfoRow
                label="Delivery"
                value="4K ProRes / H.264, capped or open captions"
              />
              <InfoRow
                label="Based in"
                value="West Bengal, India — works with clients worldwide"
              />
            </div>
            <div className="mt-10 pt-6 border-t border-line-soft font-mono text-xs text-ink-faint">
              hariomkumar8988@gmail.com
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-bg p-6 md:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Field
                label="Name"
                name="from_name"
                type="text"
                required
                autoComplete="name"
              />
              <Field
                label="Email"
                name="reply_to"
                type="email"
                required
                autoComplete="email"
              />
            </div>

            <div className="mt-6">
              <label className="block font-mono text-[11px] text-ink-faint mb-2">
                Project type
              </label>
              <select
                name="project_type"
                required
                defaultValue=""
                className="w-full bg-panel border border-line px-3 py-2.5 text-sm text-ink focus:border-amber outline-none"
              >
                <option value="" disabled>
                  Select one
                </option>
                {projectTypes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="block font-mono text-[11px] text-ink-faint mb-2">
                Channel link
              </label>
              <input
                type="url"
                name="channel_url"
                placeholder="https://youtube.com/@yourchannel"
                className="w-full bg-panel border border-line px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-amber outline-none"
              />
            </div>

            <div className="mt-6">
              <label className="block font-mono text-[11px] text-ink-faint mb-2">
                Project details
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Upload frequency, footage length, style references…"
                className="w-full bg-panel border border-line px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-amber outline-none resize-none"
              />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="font-mono text-xs px-5 py-3 bg-amber text-bg font-medium hover:bg-ink transition-colors disabled:opacity-60"
              >
                {status === 'sending' ? 'Rendering…' : 'Send project brief'}
              </button>

              {status === 'sent' && (
                <span className="text-xs text-teal font-mono">
                  Sent — I'll reply within two business days.
                </span>
              )}
              {status === 'error' && (
                <span className="text-xs text-amber font-mono">
                  Couldn't send yet — connect EmailJS in Contact.jsx.
                </span>
              )}
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
      <label className="block font-mono text-[11px] text-ink-faint mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-panel border border-line px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-amber outline-none"
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line-soft pb-3">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="text-sm text-ink text-right">{value}</span>
    </div>
  );
}
