import { useEffect, useRef, useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';
import MuxPlayer from '@mux/mux-player-react';
import { SectionHeading } from './ClientChannels.jsx';

/**
 * type 'mux'   -> src is a Mux playback ID
 * type 'video' -> src is a full URL (https://...mp4) or a path under /public
 */
export default function ColorGradeCompare({
  // ---- 16:9 landscape ----
  leftSrc = '8HW8DqAtAJJsefVEuz7CxDaR02TukSm6VitP02lRFIP6M',
  rightSrc = '8HW8DqAtAJJsefVEuz7CxDaR02TukSm6VitP02lRFIP6M',
  leftType = 'mux',
  rightType = 'mux',
  leftFilter = '',
  rightFilter = '',
  // leftFilter = 'contrast(0.82) saturate(0.55) brightness(1.05)',
  // rightFilter = 'contrast(1.14) saturate(1.3) brightness(1.02) hue-rotate(-4deg)',

  // ---- 9:16 shorts (default to the same clips, cropped to vertical) ----
  shortsLeftSrc = 'UClLjGQRb2BocMxlocLmqDx02O01ZdR014ge3bhVyPuGIM',
  shortsRightSrc = 'ah802h00ozFV1F00EYJHl1Mm02xmhOt7NGMaoN9FdvoDBnI',
  shortsLeftType = leftType,
  shortsRightType = rightType,
  shortsLeftFilter = '',
  shortsRightFilter = '',
}) {
  return (
    <section id="grade" className="border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V5" title="Before / after the grade" />
        <p className="mt-4 max-w-lg text-ink-dim">
          Drag the divider to see what a pass of color correction and grading
          does to a flat, unedited clip — in widescreen and in vertical Shorts.
        </p>

        <div className="mt-12 border border-line bg-panel p-4 md:p-6">
          {/* 256:81 makes the 9:16 column exactly as tall as the 16:9 one on desktop */}
          <div className="grid gap-8 lg:grid-cols-[256fr_81fr] lg:items-start lg:gap-6">
            <div>
              <FormatLabel ratio="16:9" name="Landscape" />
              <GradeSlider
                aspect="aspect-video"
                leftSrc={leftSrc}
                rightSrc={rightSrc}
                leftType={leftType}
                rightType={rightType}
                leftFilter={leftFilter}
                rightFilter={rightFilter}
              />
            </div>

            <div className="mx-auto w-full max-w-[300px] lg:max-w-none">
              <FormatLabel ratio="9:16" name="Shorts" />
              <GradeSlider
                aspect="aspect-[9/16]"
                leftSrc={shortsLeftSrc}
                rightSrc={shortsRightSrc}
                leftType={shortsLeftType}
                rightType={shortsRightType}
                leftFilter={shortsLeftFilter}
                rightFilter={shortsRightFilter}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ink-faint">
            <span>Drag to compare</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One before/after slider with its own synced pair of videos.
 * The LEFT video is the master; the right one follows it.
 */
function GradeSlider({
  aspect,
  leftSrc,
  rightSrc,
  leftType,
  rightType,
  leftFilter,
  rightFilter,
}) {
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [leftReady, setLeftReady] = useState(false);
  const [rightReady, setRightReady] = useState(false);
  const [error, setError] = useState(null);
  const ready = leftReady && rightReady;

  useEffect(() => {
    setLeftReady(false);
    setRightReady(false);
    setError(null);
  }, [leftSrc, rightSrc, leftType, rightType]);

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

    // Pause both while off-screen (saves decoding 4 streams at once).
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) L.play?.()?.catch?.(() => {});
        else {
          L.pause?.();
          R.pause?.();
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
          L.play?.()?.catch?.(() => {});
        }

        if (!L.paused) {
          if (R.paused) R.play?.()?.catch?.(() => {});
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

  const renderMedia = (type, src, filter, ref, setReady, label, isMaster) => {
    const handleError = (e) => {
      console.error(`[ColorGradeCompare] ${label} failed to load`, {
        type,
        src,
        detail: e?.currentTarget?.error ?? e?.detail ?? e,
      });
      setError(
        type === 'mux'
          ? `${label} clip failed to load. Check the Mux playback ID.`
          : `${label} clip failed to load. Check the video URL.`,
      );
    };

    return (
      <div className="absolute inset-0 overflow-hidden" style={{ filter }}>
        {type === 'mux' ? (
          <MuxPlayer
            ref={ref}
            playbackId={src}
            streamType="on-demand"
            autoPlay={isMaster ? 'muted' : false} // only master autoplays
            loop={isMaster} // only master loops
            muted
            playsInline
            preload="auto"
            // ---- quality ----
            minResolution="1080p" // start at 1080p, don't ramp up from 360p
            maxResolution="2160p"
            renditionOrder="desc" // prefer the highest rendition
            // -----------------
            onLoadedData={() => setReady(true)}
            onCanPlay={() => setReady(true)}
            onError={handleError}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              '--controls': 'none',
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
            }}
          />
        ) : (
          <video
            ref={ref}
            src={src}
            autoPlay={isMaster}
            loop={isMaster}
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setReady(true)}
            onCanPlay={() => setReady(true)}
            onError={handleError}
            className="block h-full w-full object-cover"
          />
        )}
      </div>
    );
  };

  return (
    <div ref={wrapRef} className="relative overflow-hidden">
      {!ready && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-bg px-4 text-center font-mono text-xs text-ink-faint">
          {error ?? 'Loading clips…'}
        </div>
      )}

      <ReactCompareSlider
        onlyHandleDraggable
        className={`w-full ${aspect}`}
        style={{ width: '100%', height: '100%' }}
        itemOne={
          <div className="relative h-full w-full">
            {renderMedia(
              leftType,
              leftSrc,
              leftFilter,
              leftRef,
              setLeftReady,
              'RAW',
              true,
            )}
            <Badge label="RAW" align="left" />
          </div>
        }
        itemTwo={
          <div className="relative h-full w-full">
            {renderMedia(
              rightType,
              rightSrc,
              rightFilter,
              rightRef,
              setRightReady,
              'GRADED',
              false,
            )}
            <Badge label="GRADED" align="right" />
          </div>
        }
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
