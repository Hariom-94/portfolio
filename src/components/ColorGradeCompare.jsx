import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';
import { SectionHeading } from './ClientChannels.jsx';

/**
 * Before / after color-grade comparison. Needs:  npm i hls.js
 *
 * Each src can be ANY of these:
 *   - a Mux playback ID                     "UClLjGQR..."
 *   - any stream.mux.com URL                "https://stream.mux.com/UClLjGQR.../high.mp4"
 *   - an .m3u8 URL                          "https://example.com/video.m3u8"
 *   - a plain video file URL (.mp4 / .webm) "https://cdn.example.com/clip.mp4"
 *
 * Mux IDs / URLs are always played through the HLS stream (no MP4 support
 * needed on the asset), locked to the highest quality up to `maxHeight`.
 *
 * Minimal usage:
 *   <ColorGradeCompare leftSrc="<RAW>" rightSrc="<GRADED>" />
 */
export default function ColorGradeCompare({
  leftSrc,
  rightSrc,
  leftFilter = '',
  rightFilter = '',
  leftPoster,
  rightPoster,
  aspect, // optional number, e.g. 16 / 9. Omit to auto-detect.
  maxHeight = 1080, // highest stream quality to lock to (use 2160 for 4K)

  // ---- optional second (vertical) pair ----
  shortsLeftSrc,
  shortsRightSrc,
  shortsLeftFilter = '',
  shortsRightFilter = '',
  shortsLeftPoster,
  shortsRightPoster,
}) {
  const hasShorts = Boolean(shortsLeftSrc && shortsRightSrc);

  return (
    <section id="grade" className="border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V5" title="Before / after the grade" />
        <p className="mt-4 max-w-lg text-ink-dim">
          Drag the divider to see what a pass of color correction and grading
          does to a flat, unedited clip
          {hasShorts ? ' — in widescreen and in vertical Shorts.' : '.'}
        </p>

        <div className="mt-12 border border-line bg-panel p-4 md:p-6">
          {hasShorts ? (
            // 256:81 makes the 9:16 column exactly as tall as the 16:9 one on desktop
            <div className="grid gap-8 lg:grid-cols-[256fr_81fr] lg:items-start lg:gap-6">
              <div>
                <FormatLabel ratio="16:9" name="Landscape" />
                <GradeSlider
                  aspect={16 / 9}
                  maxHeight={maxHeight}
                  leftSrc={leftSrc}
                  rightSrc={rightSrc}
                  leftFilter={leftFilter}
                  rightFilter={rightFilter}
                  leftPoster={leftPoster}
                  rightPoster={rightPoster}
                />
              </div>

              <div className="mx-auto w-full max-w-[300px] lg:max-w-none">
                <FormatLabel ratio="9:16" name="Shorts" />
                <GradeSlider
                  aspect={9 / 16}
                  maxHeight={maxHeight}
                  leftSrc={shortsLeftSrc}
                  rightSrc={shortsRightSrc}
                  leftFilter={shortsLeftFilter}
                  rightFilter={shortsRightFilter}
                  leftPoster={shortsLeftPoster}
                  rightPoster={shortsRightPoster}
                />
              </div>
            </div>
          ) : (
            <GradeSlider
              single
              aspect={aspect}
              maxHeight={maxHeight}
              leftSrc={leftSrc}
              rightSrc={rightSrc}
              leftFilter={leftFilter}
              rightFilter={rightFilter}
              leftPoster={leftPoster}
              rightPoster={rightPoster}
            />
          )}

          <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ink-faint">
            <span>Drag to compare</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Source resolving                                                     */
/* ------------------------------------------------------------------ */

const MUX_URL_RE = /^https?:\/\/stream\.mux\.com\/([A-Za-z0-9]+)/;
const BARE_ID_RE = /^[A-Za-z0-9]{20,}$/;

function resolveSource(src) {
  if (!src) return { kind: 'none' };

  const m = src.match(MUX_URL_RE);
  const id = m ? m[1] : BARE_ID_RE.test(src) ? src : null;
  if (id) {
    return {
      kind: 'hls',
      url: `https://stream.mux.com/${id}.m3u8`,
      poster: `https://image.mux.com/${id}/thumbnail.webp?time=0`,
    };
  }
  if (/\.m3u8(\?|$)/i.test(src)) return { kind: 'hls', url: src };
  return { kind: 'file', url: src };
}

/* ------------------------------------------------------------------ */
/* Slider                                                               */
/* ------------------------------------------------------------------ */

/**
 * One before/after slider with its own synced pair of videos.
 * The LEFT video is the master; the right one follows it.
 */
function GradeSlider({
  aspect,
  single = false,
  maxHeight,
  leftSrc,
  rightSrc,
  leftFilter,
  rightFilter,
  leftPoster,
  rightPoster,
}) {
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [leftReady, setLeftReady] = useState(false);
  const [rightReady, setRightReady] = useState(false);
  const [detected, setDetected] = useState(null);
  const [error, setError] = useState(null);
  const ready = leftReady && rightReady;

  // Forced aspect > detected from the video > 16:9 until metadata arrives.
  const ratio = aspect ?? detected ?? 16 / 9;

  useEffect(() => {
    setLeftReady(false);
    setRightReady(false);
    setDetected(null);
    setError(null);
  }, [leftSrc, rightSrc]);

  // Frame-accurate sync: LEFT is the master, RIGHT follows it.
  useEffect(() => {
    if (!ready) return;
    const L = leftRef.current;
    const R = rightRef.current;
    const wrap = wrapRef.current;
    if (!L || !R || !wrap) return;

    let raf = 0;
    let holding = false; // true while we paused the master to let a clip buffer
    let visible = true;

    R.currentTime = L.currentTime;

    // Play only while on-screen (saves decoding two streams per slider).
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) L.play().catch(() => {});
        else {
          L.pause();
          R.pause();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(wrap);

    const tick = () => {
      if (visible) {
        const bothBuffered = L.readyState >= 3 && R.readyState >= 3;

        // If either clip is starved, freeze both until both can play.
        if (!bothBuffered) {
          if (!L.paused) {
            L.pause();
            holding = true;
          }
        } else if (holding) {
          holding = false;
          R.currentTime = L.currentTime;
          L.play().catch(() => {});
        }

        if (!L.paused) {
          if (R.paused) R.play().catch(() => {});
          const drift = R.currentTime - L.currentTime;
          const abs = Math.abs(drift);

          if (abs > 0.25) {
            // big gap (e.g. loop wrap) -> hard seek
            R.currentTime = L.currentTime;
            R.playbackRate = 1;
          } else if (abs > 0.04) {
            // small gap -> gently speed up / slow down, no stutter
            R.playbackRate = Math.min(1.08, Math.max(0.92, 1 - drift * 0.6));
          } else {
            R.playbackRate = 1;
          }
        } else if (!R.paused) {
          R.pause();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onSeeking = () => {
      R.currentTime = L.currentTime;
    };
    L.addEventListener('seeking', onSeeking);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      L.removeEventListener('seeking', onSeeking);
    };
  }, [ready]);

  const handleError = (label) => (e) => {
    console.error(
      `[ColorGradeCompare] ${label} clip failed to load`,
      e?.currentTarget?.error ?? e,
    );
    setError(
      `${label} clip failed to load. Check the Mux playback ID (it must use the public playback policy) or the video URL.`,
    );
  };

  const handleMeta = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) setDetected(videoWidth / videoHeight);
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full overflow-hidden"
      style={{
        aspectRatio: ratio,
        // keep a vertical clip from becoming huge when it's the only slider
        maxWidth: single && ratio < 1 ? 380 : undefined,
      }}
    >
      {!ready && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-bg px-4 text-center font-mono text-xs text-ink-faint">
          {error ?? 'Loading clips…'}
        </div>
      )}

      <ReactCompareSlider
        onlyHandleDraggable
        style={{ width: '100%', height: '100%' }}
        itemOne={
          <div className="relative h-full w-full">
            <Clip
              src={leftSrc}
              poster={leftPoster}
              filter={leftFilter}
              maxHeight={maxHeight}
              videoRef={leftRef}
              onReady={() => setLeftReady(true)}
              onMeta={handleMeta}
              onError={handleError('RAW')}
            />
            <Badge label="RAW" align="left" />
          </div>
        }
        itemTwo={
          <div className="relative h-full w-full">
            <Clip
              src={rightSrc}
              poster={rightPoster}
              filter={rightFilter}
              maxHeight={maxHeight}
              videoRef={rightRef}
              onReady={() => setRightReady(true)}
              onError={handleError('GRADED')}
            />
            <Badge label="GRADED" align="right" />
          </div>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One video (HLS via hls.js, native HLS on Safari, or a plain file)    */
/* ------------------------------------------------------------------ */

function Clip({
  src,
  poster,
  filter,
  maxHeight,
  videoRef,
  onReady,
  onMeta,
  onError,
}) {
  const source = useMemo(() => resolveSource(src), [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || source.kind === 'none') return;

    let hls = null;
    let cancelled = false;

    if (
      source.kind === 'file' ||
      v.canPlayType('application/vnd.apple.mpegurl')
    ) {
      // plain file, or Safari / iOS which play HLS natively
      v.src = source.url;
    } else {
      // loaded on demand so it doesn't bloat the main bundle
      import('hls.js')
        .then(({ default: Hls }) => {
          if (cancelled) return;
          if (!Hls.isSupported()) {
            onError();
            return;
          }

          hls = new Hls({ maxBufferLength: 20, capLevelToPlayerSize: false });

          // Lock to the best quality <= maxHeight so start is sharp and
          // both clips always show the same quality.
          hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
            // Compare on the SHORT side so vertical clips (e.g. 1080x1920)
            // aren't wrongly capped, then take the best level <= maxHeight.
            const side = (l) =>
              Math.min(l.width || Infinity, l.height || Infinity);
            let best = 0;
            data.levels.forEach((lvl, i) => {
              const s = side(lvl);
              if (s <= maxHeight && s >= side(data.levels[best])) best = i;
            });
            console.info(
              '[ColorGradeCompare] available levels:',
              data.levels.map((l) => `${l.width}x${l.height}`),
              '-> using',
              `${data.levels[best].width}x${data.levels[best].height}`,
            );
            hls.startLevel = best;
            hls.currentLevel = best;
          });

          hls.on(Hls.Events.ERROR, (_, d) => {
            if (d.fatal) onError();
          });

          hls.attachMedia(v);
          hls.loadSource(source.url);
        })
        .catch(() => onError());
    }

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
      v.removeAttribute('src');
      v.load();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.url, source.kind, maxHeight]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ filter: filter || undefined }}
    >
      <video
        ref={videoRef}
        poster={poster ?? source.poster}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        onLoadedMetadata={onMeta}
        onLoadedData={onReady}
        onCanPlay={onReady}
        onError={onError}
        className="block h-full w-full object-cover"
      />
    </div>
  );
}

function FormatLabel({ ratio, name }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-ink-faint">
      <span className="border border-line px-2 py-1 text-ink tabular-nums">
        {ratio}
      </span>
      <span className="uppercase tracking-wider">{name}</span>
    </div>
  );
}

function Badge({ label, align }) {
  return (
    <span
      className={`pointer-events-none absolute top-3 z-20 border border-line bg-bg/70 px-2 py-1 font-mono text-[10px] tracking-wide text-ink ${
        align === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      {label}
    </span>
  );
}
