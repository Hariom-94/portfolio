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
  leftSrc = 'UClLjGQRb2BocMxlocLmqDx02O01ZdR014ge3bhVyPuGIM',
  rightSrc = 'ah802h00ozFV1F00EYJHl1Mm02xmhOt7NGMaoN9FdvoDBnI',
  leftType = 'mux',
  rightType = 'mux',
  leftFilter = '',
  // leftFilter = 'contrast(0.82) saturate(0.55) brightness(1.05)',
  rightFilter = '',
  // rightFilter = 'contrast(1.14) saturate(1.3) brightness(1.02) hue-rotate(-4deg)',

  // ---- 9:16 shorts (default to the same clips, cropped to vertical) ----
  shortsLeftSrc = leftSrc,
  shortsRightSrc = rightSrc,
  shortsLeftType = leftType,
  shortsRightType = rightType,
  shortsLeftFilter = leftFilter,
  shortsRightFilter = rightFilter,
}) {
  return (
    <section id="grade" className="border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHeading tag="V4" title="Before / after the grade" />
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
  // Both <video> and <MuxPlayer> refs expose currentTime / paused / play() /
  // pause() and fire play / pause / seeking / timeupdate, so we can use the
  // ref directly without digging for an inner element.
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [leftReady, setLeftReady] = useState(false);
  const [rightReady, setRightReady] = useState(false);
  const [error, setError] = useState(null);
  const ready = leftReady && rightReady;

  // Reset state if the sources change.
  useEffect(() => {
    setLeftReady(false);
    setRightReady(false);
    setError(null);
  }, [leftSrc, rightSrc, leftType, rightType]);

  // Attach sync listeners once both players exist and have loaded.
  useEffect(() => {
    if (!ready) return;
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    if (!leftEl || !rightEl) return;

    rightEl.currentTime = leftEl.currentTime;
    if (!leftEl.paused) rightEl.play?.()?.catch?.(() => {});

    const resync = () => {
      if (Math.abs(leftEl.currentTime - rightEl.currentTime) > 0.15) {
        rightEl.currentTime = leftEl.currentTime;
      }
    };
    const onPlay = () => {
      rightEl.currentTime = leftEl.currentTime;
      rightEl.play?.()?.catch?.(() => {});
    };
    const onPause = () => rightEl.pause?.();
    const onSeeking = () => {
      rightEl.currentTime = leftEl.currentTime;
    };

    leftEl.addEventListener('play', onPlay);
    leftEl.addEventListener('pause', onPause);
    leftEl.addEventListener('seeking', onSeeking);
    leftEl.addEventListener('seeked', resync);
    leftEl.addEventListener('timeupdate', resync);

    return () => {
      leftEl.removeEventListener('play', onPlay);
      leftEl.removeEventListener('pause', onPause);
      leftEl.removeEventListener('seeking', onSeeking);
      leftEl.removeEventListener('seeked', resync);
      leftEl.removeEventListener('timeupdate', resync);
    };
  }, [ready]);

  const renderMedia = (type, src, filter, ref, setReady, label) => {
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

    // Filter goes on a wrapper so it works for both <video> and the Mux web component.
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ filter }}>
        {type === 'mux' ? (
          <MuxPlayer
            ref={ref}
            playbackId={src}
            streamType="on-demand"
            autoPlay="muted"
            loop
            muted
            playsInline
            preload="auto"
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
            autoPlay
            loop
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
    <div className="relative overflow-hidden">
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
