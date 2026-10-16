import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Friendly cursor for a video-editor portfolio.
 *
 *  default  small amber dot + soft trailing ring
 *  links    a rounded amber highlight glides onto the link / button
 *  data-cursor="Play" on any element -> amber pill with that label
 *  inputs   custom cursor hides, native caret returns
 *  touch    renders nothing
 *
 * Always on top: it is portaled to <body>, uses the max z-index, and (where
 * supported) lives in the browser's top layer via the Popover API, so it also
 * stays above native <dialog> modals. It re-promotes itself whenever a dialog
 * opens.
 *
 * Usage: <CustomCursor /> once in App.jsx, then
 *   <div data-cursor="Play">…video card…</div>
 *   <div data-cursor="Drag">…before/after slider…</div>
 */

const AMBER = 'var(--color-amber, #f5a524)';
const BG = 'var(--color-bg, #0a0a0a)';
const PAD = 8; // gap between the corner brackets and the element

const STYLE_ID = 'custom-cursor-style';
const CSS = `
@media (hover: hover) and (pointer: fine) {
  html.custom-cursor, html.custom-cursor * { cursor: none !important; }
  html.custom-cursor input,
  html.custom-cursor textarea { cursor: text !important; }
  html.custom-cursor select { cursor: pointer !important; }
}`;

function measure(el) {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState({ type: 'default', label: '' });
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const layerRef = useRef(null);
  const firstMove = useRef(true);
  const targetRef = useRef(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const trailY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  // Only on devices with a real mouse.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const onChange = (e) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Hide the native cursor.
  useEffect(() => {
    if (!enabled) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
    document.documentElement.classList.add('custom-cursor');
    return () => {
      style.remove();
      document.documentElement.classList.remove('custom-cursor');
    };
  }, [enabled]);

  // Keep the cursor layer above everything, including native <dialog> modals.
  useEffect(() => {
    if (!enabled) return;
    const el = layerRef.current;
    if (!el || typeof el.showPopover !== 'function') return; // z-index fallback

    const open = () => {
      try {
        if (!el.matches(':popover-open')) el.showPopover();
      } catch {
        /* ignore */
      }
    };
    // Top-layer elements stack in the order they were shown, so re-show last.
    const promote = () => {
      try {
        el.hidePopover();
      } catch {
        /* ignore */
      }
      open();
    };

    open();

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(promote);
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.target.tagName === 'DIALOG') {
          schedule();
          return;
        }
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (
              n.nodeType === 1 &&
              (n.tagName === 'DIALOG' || n.querySelector?.('dialog, [popover]'))
            ) {
              schedule();
              return;
            }
          }
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['open'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      try {
        el.hidePopover();
      } catch {
        /* ignore */
      }
    };
  }, [enabled]);

  // Pointer tracking + hover detection.
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (firstMove.current) {
        trailX.jump(e.clientX);
        trailY.jump(e.clientY);
        firstMove.current = false;
      }
      setVisible(true);
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      targetRef.current = null;

      if (t.closest('input, textarea, select')) {
        setMode({ type: 'native', label: '' });
        return;
      }
      const tagged = t.closest('[data-cursor]');
      if (tagged) {
        setMode({ type: 'label', label: tagged.getAttribute('data-cursor') });
        return;
      }
      const interactive = t.closest('a, button, summary, [role="button"]');
      if (interactive) {
        targetRef.current = interactive;
        setRect(measure(interactive));
        setMode({ type: 'focus', label: '' });
        return;
      }
      setMode({ type: 'default', label: '' });
    };

    // Keep the highlight glued to the element while scrolling / resizing.
    const onReflow = () => {
      if (targetRef.current) setRect(measure(targetRef.current));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const root = document.documentElement;

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('scroll', onReflow, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', onReflow);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    root.addEventListener('mouseleave', onLeave);
    root.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('scroll', onReflow, { capture: true });
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      root.removeEventListener('mouseleave', onLeave);
      root.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, x, y, trailX, trailY]);

  if (!enabled) return null;

  const { type, label } = mode;
  const show = visible && type !== 'native';
  const isFocus = type === 'focus';
  const isLabel = type === 'label';

  return createPortal(
    <div
      ref={layerRef}
      popover="manual"
      aria-hidden="true"
      style={{
        // Reset the browser's default popover box so it is a transparent,
        // click-through, full-viewport layer.
        position: 'fixed',
        inset: 0,
        width: 'auto',
        height: 'auto',
        maxWidth: 'none',
        maxHeight: 'none',
        margin: 0,
        padding: 0,
        border: 0,
        background: 'transparent',
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    >
      {/* Corner brackets that snap onto links / buttons */}
      <motion.div
        className="fixed"
        initial={false}
        animate={{
          left: rect.left - PAD,
          top: rect.top - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
          opacity: show && isFocus ? 1 : 0,
          scale: pressed ? 0.97 : 1,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      >
        {[
          'left-0 top-0 border-l-2 border-t-2',
          'right-0 top-0 border-r-2 border-t-2',
          'bottom-0 left-0 border-b-2 border-l-2',
          'bottom-0 right-0 border-b-2 border-r-2',
        ].map((c) => (
          <span
            key={c}
            className={`absolute h-3 w-3 ${c}`}
            style={{ borderColor: AMBER }}
          />
        ))}
      </motion.div>

      {/* Crosshair at the pointer */}
      <motion.div className="fixed left-0 top-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{
            opacity: show ? 1 : 0,
            rotate: pressed ? 45 : 0,
            scale: isLabel ? 0.6 : isFocus ? 0.8 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* dark underlay keeps the lines visible on light backgrounds */}
            <path
              d="M14 2v8M14 18v8M2 14h8M18 14h8"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M14 2v8M14 18v8M2 14h8M18 14h8"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: AMBER,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Label pill (data-cursor="…") */}
      <motion.div
        className="fixed left-0 top-0"
        style={{ x: trailX, y: trailY }}
      >
        <motion.div
          className="ml-4 mt-4 flex origin-top-left items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-2.5 pr-3.5 font-mono text-[11px] font-medium uppercase tracking-wider"
          initial={false}
          animate={{
            opacity: show && isLabel ? 1 : 0,
            scale: show && isLabel ? (pressed ? 0.94 : 1) : 0.6,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          style={{
            background: AMBER,
            color: BG,
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M2 1l7 4-7 4z" />
          </svg>
          {label}
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
}
