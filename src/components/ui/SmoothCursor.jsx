import { useEffect, useRef } from "react";

const SmoothCursor = () => {
  // Refs for the two cursor elements
  const smallCircleRef = useRef(null);
  const bigCircleRef = useRef(null);

  // Refs to store the current and target positions
  const mousePos = useRef({ x: 0, y: 0 });
  const smallCirclePos = useRef({ x: 0, y: 0 });
  const bigCirclePos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null); // To store the requestAnimationFrame ID

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Update the target mouse position
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      // Easing factor for smooth movement
      const easing = 0.15;

      // --- Small Circle Animation ---
      // Calculate the distance to move
      const smXDist = mousePos.current.x - smallCirclePos.current.x;
      const smYDist = mousePos.current.y - smallCirclePos.current.y;

      // Update the small circle's position with easing
      smallCirclePos.current.x += smXDist * easing;
      smallCirclePos.current.y += smYDist * easing;

      // --- Big Circle Animation (with a slower easing for a trailing effect) ---
      const bigCircleEasing = 0.1;
      const lgXDist = mousePos.current.x - bigCirclePos.current.x;
      const lgYDist = mousePos.current.y - bigCirclePos.current.y;

      bigCirclePos.current.x += lgXDist * bigCircleEasing;
      bigCirclePos.current.y += lgYDist * bigCircleEasing;

      // Apply the new positions to the DOM elements using transform for performance
      if (smallCircleRef.current) {
        smallCircleRef.current.style.transform = `translate3d(${smallCirclePos.current.x}px, ${smallCirclePos.current.y}px, 0)`;
      }
      if (bigCircleRef.current) {
        bigCircleRef.current.style.transform = `translate3d(${bigCirclePos.current.x}px, ${bigCirclePos.current.y}px, 0)`;
      }

      // Continue the loop
      rafId.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    rafId.current = requestAnimationFrame(animate);

    // --- Cleanup function ---
    // This will run when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Big Circle (Outline) */}
      <div
        ref={bigCircleRef}
        style={{
          position: "fixed",
          top: -15, // Offset to center
          left: -15, // Offset to center
          width: 30,
          height: 30,
          border: "2px solid #008ff9",
          borderRadius: "50%",
          pointerEvents: "none", // Allows clicking through the element
          zIndex: 9999,
          mixBlendMode: "difference", // Cool blending effect
        }}
      />
      {/* Small Circle (Solid) */}
      <div
        ref={smallCircleRef}
        style={{
          position: "fixed",
          top: -4, // Offset to center
          left: -4, // Offset to center
          width: 8,
          height: 8,
          background: "#fff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
};

export default SmoothCursor;
