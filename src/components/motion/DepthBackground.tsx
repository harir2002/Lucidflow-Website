import { useEffect, useRef } from "react";

/**
 * DepthBackground: Subtle global visual depth system
 * Adds grain texture, faint line fragments, and ambient glow
 * Non-interactive, low-opacity decorative layer
 */
export function DepthBackground() {
  const noiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create subtle noise texture using canvas
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate fine grain noise
    const imageData = ctx.createImageData(256, 256);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 30; // Very subtle
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL();

    if (noiseRef.current) {
      noiseRef.current.style.backgroundImage = `url(${dataUrl})`;
    }
  }, []);

  return (
    <>
      {/* Grain texture overlay */}
      <div
        ref={noiseRef}
        className="pointer-events-none fixed inset-0 top-0 left-0 z-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Subtle decorative line fragments */}
      <svg
        className="pointer-events-none fixed inset-0 top-0 left-0 z-0 opacity-[0.02]"
        aria-hidden="true"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        {/* Random technical line fragments */}
        <line x1="0" y1="15%" x2="8%" y2="12%" stroke="white" strokeWidth="0.5" />
        <line x1="92%" y1="25%" x2="100%" y2="28%" stroke="white" strokeWidth="0.5" />
        <line x1="5%" y1="45%" x2="12%" y2="42%" stroke="white" strokeWidth="0.5" />
        <line x1="88%" y1="55%" x2="96%" y2="58%" stroke="white" strokeWidth="0.5" />
        <line x1="3%" y1="75%" x2="10%" y2="72%" stroke="white" strokeWidth="0.5" />
        <line x1="90%" y1="85%" x2="98%" y2="88%" stroke="white" strokeWidth="0.5" />

        {/* Small accent dots */}
        <circle cx="4%" cy="20%" r="1.5" fill="white" />
        <circle cx="94%" cy="35%" r="1" fill="white" />
        <circle cx="6%" cy="60%" r="1.2" fill="white" />
        <circle cx="92%" cy="70%" r="1.5" fill="white" />
        <circle cx="8%" cy="80%" r="1" fill="white" />
      </svg>
    </>
  );
}
