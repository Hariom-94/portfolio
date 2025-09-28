import { useEffect, useRef } from "react";

// The isVisible prop is used to hide the cursor when hovering over
// elements with a 'pointer' cursor, consistent with the logic in App.jsx.
export const GooeyCursor = ({ isVisible = true }) => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  const cursorPos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    // requestAnimationFrame provides a smoother animation loop
    const animate = () => {
      // Easing creates a trailing "follow" effect for the larger dot
      const easing = 0.15;
      const dx = cursorPos.current.x - followerPos.current.x;
      const dy = cursorPos.current.y - followerPos.current.y;

      followerPos.current.x += dx * easing;
      followerPos.current.y += dy * easing;

      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // If the cursor shouldn't be visible, render nothing.
  if (!isVisible) {
    return null;
  }

  return (
    <div>
      {/* The SVG filter is the magic behind the gooey effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="gooey-effect-filter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* The container has the filter applied */}
      <div
        style={{ filter: "url(#gooey-effect-filter)" }}
        className="w-full h-full fixed top-0 left-0 pointer-events-none z-[9999]"
      >
        {/* The actual cursor dots, now styled as outlines */}
        <div
          ref={cursorRef}
          className="bg-transparent border-2 border-white mix-blend-difference w-5 h-5 rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        />
        <div
          ref={followerRef}
          className="bg-transparent border-2 border-white mix-blend-difference w-8 h-8 rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};
