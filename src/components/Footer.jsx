export default function Footer() {
  return (
    <footer className="border-t border-line py-10 mb-10 sm:mb-0">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="font-mono text-[11px] text-ink-faint">
          END OF TIMELINE — thanks for scrubbing all the way through.
        </div>
        <div className="flex gap-6 font-mono text-xs text-ink-dim">
          <a
            href="https://wa.me/+917364877930?text=Hi!%20I%20was%20just%20looking%20through%20your%20website%20and%20wanted%20to%20connect."
            target="_blank"
            className="hover:text-amber transition-colors"
          >
            Whatsapp
          </a>
          <a
            href="https://www.instagram.com/harii_0m_"
            target="_blank"
            className="hover:text-amber transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:hariomkumar8988@gmail.com"
            target="_blank"
            className="hover:text-amber transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
