import { useMemo, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { X, Play, Eye, Sparkles } from 'lucide-react';
import { portfolioItems, categories } from '../data.js';
import { SectionHeading } from './ClientChannels.jsx';

export default function PortfolioGrid() {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);

  const items = useMemo(
    () =>
      filter === 'All'
        ? portfolioItems
        : portfolioItems.filter((i) => i.category === filter),
    [filter],
  );

  return (
    <section
      id="work"
      className="border-b border-line py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background ambient glow matching your video workspace aesthetic */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionHeading tag="V5" title="The full cut list" />
            <p className="mt-4 max-w-lg text-ink-dim text-sm md:text-base">
              {portfolioItems.length}+ cinematic edits across five distinct
              formats. Filter by type or explore the complete curated reel.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-panel p-1.5 border border-line">
            {['All', ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`font-mono text-xs px-3.5 py-2 transition-all duration-200 ${
                  filter === c
                    ? 'bg-amber text-bg font-semibold shadow-sm'
                    : 'text-ink-faint hover:text-ink hover:bg-line/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setOpen(item)}
              className="group relative bg-panel border border-line overflow-hidden text-left flex flex-col transition-all duration-300 hover:border-amber/60 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/40"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-bg">
                <div className="absolute inset-0 bg-gradient-to-br from-panel to-raised" />
                <img
                  src={thumbnailUrl(item.playbackId, item.thumbTime)}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Subtle vignette layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-[2px]">
                  <span className="w-12 h-12 rounded-full border border-amber/60 flex items-center justify-center bg-amber text-bg shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play
                      size={16}
                      className="translate-x-[1px]"
                      fill="currentColor"
                    />
                  </span>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[10px] tracking-wider text-ink border border-line/80 px-2 py-0.5 bg-bg/80 backdrop-blur-md uppercase">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] text-amber border border-amber/30 tabular-nums bg-bg/80 backdrop-blur-md px-1.5 py-0.5 font-medium">
                    {item.duration}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex flex-col justify-between flex-1 bg-panel">
                <div>
                  <span className="block text-sm font-display font-medium text-ink leading-snug line-clamp-2 group-hover:text-amber transition-colors">
                    {item.title}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-ink-faint">
                  <span className="truncate font-medium text-ink-dim">
                    {item.client}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-teal tabular-nums shrink-0">
                    <Eye size={12} className="opacity-70" />
                    {item.views}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && <PlayerModal item={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function thumbnailUrl(playbackId, time = 1) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop&time=${time}`;
}

function PlayerModal({ item, onClose }) {
  const isVertical = item.aspectRatio === '9/16' || item.category === 'Shorts';

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full bg-panel border border-line shadow-2xl overflow-hidden transform transition-all ${
          isVertical ? 'max-w-[400px]' : 'max-w-4xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-line bg-bg/50">
          <div>
            <div className="font-display text-lg md:text-xl text-ink leading-tight">
              {item.title}
            </div>
            <div className="text-xs font-mono text-ink-faint mt-1 flex items-center gap-2">
              {item?.client && (
                <>
                  <a
                    href={`https://www.youtube.com/${item?.handle}`}
                    target="_blank"
                    className="text-amber"
                  >
                    {item?.client}
                  </a>
                  <span>•</span>
                </>
              )}
              <span>{item.category}</span>
              <span>•</span>
              <span className="text-teal">{item.views}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink p-2 border border-transparent hover:border-line rounded transition-colors"
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        </div>

        {/* Player */}
        <div className="p-2 md:p-4 bg-black">
          <MuxPlayer
            playbackId={item.playbackId}
            streamType="on-demand"
            autoPlay
            metadata={{
              video_title: item.title,
              viewer_user_id: 'portfolio-visitor',
            }}
            primaryColor="#ECE9E2"
            secondaryColor="#0E1113"
            accentColor="#E8A33D"
            style={{
              width: '100%',
              aspectRatio: isVertical ? '9/16' : '16/9',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          />
        </div>
      </div>
    </div>
  );
}
