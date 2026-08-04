import { useEffect, useMemo, useRef, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

type SpherePoint = {
  x: number;
  y: number;
  z: number;
  color: "#38bdf8" | "#a78bfa";
};

const POINT_COUNT = 520;
const ROTATION_DURATION = 75_000;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function createSpherePoints(): SpherePoint[] {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const vertical = 1 - (index / (POINT_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - vertical * vertical);
    const angle = index * GOLDEN_ANGLE;

    return {
      x: Math.cos(angle) * radius,
      y: vertical,
      z: Math.sin(angle) * radius,
      color: index % 5 < 3 ? "#38bdf8" : "#a78bfa",
    };
  });
}

/** Lightweight, non-interactive Canvas2D sphere used as an ambient hero backdrop. */
export default function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const points = useMemo(createSpherePoints, []);
  const [hasEntered, setHasEntered] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setHasEntered(true);
      return;
    }

    const frame = requestAnimationFrame(() => setHasEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame: number | undefined;
    let elapsed = 0;
    let previousTimestamp: number | undefined;
    let inView = false;
    let documentVisible = document.visibilityState === "visible";
    let width = 0;
    let height = 0;

    const draw = () => {
      if (!width || !height) return;

      const dpr = window.devicePixelRatio || 1;
      const rotation = (elapsed / ROTATION_DURATION) * Math.PI * 2;
      const cosine = Math.cos(rotation);
      const sine = Math.sin(rotation);
      const sphereRadius = Math.min(width * 0.38, height * 0.42);
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      // The diffuse center glow makes the point cloud feel like a single volume,
      // while the points themselves retain the detail of its surface.
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, sphereRadius * 1.15);
      glow.addColorStop(0, "rgba(56, 189, 248, 0.12)");
      glow.addColorStop(0.38, "rgba(167, 139, 250, 0.055)");
      glow.addColorStop(1, "rgba(56, 189, 248, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const projectedPoints = points.map((point) => {
        const rotatedX = point.x * cosine + point.z * sine;
        const rotatedZ = point.z * cosine - point.x * sine;
        const depth = (rotatedZ + 1) / 2;
        const perspective = 0.88 + depth * 0.24;

        return { point, rotatedX, depth, perspective };
      });

      // Draw the far hemisphere first. Depth controls both size and alpha so the
      // rotation reads as a volumetric sphere rather than a flat star field.
      projectedPoints.sort((a, b) => a.depth - b.depth);

      for (const { point, rotatedX, depth, perspective } of projectedPoints) {
        const size = 0.8 + depth * 1.7;

        context.beginPath();
        context.arc(
          centerX + rotatedX * sphereRadius * perspective,
          centerY + point.y * sphereRadius * perspective,
          size,
          0,
          Math.PI * 2,
        );
        context.fillStyle = point.color;
        context.globalAlpha = 0.1 + depth * 0.5;
        context.shadowColor = point.color;
        context.shadowBlur = depth > 0.72 ? 5 * depth : 0;
        context.fill();
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw();
    };

    const stop = () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
      previousTimestamp = undefined;
    };

    const frame = (timestamp: number) => {
      if (previousTimestamp !== undefined) elapsed += timestamp - previousTimestamp;
      previousTimestamp = timestamp;
      draw();
      animationFrame = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reducedMotion || !inView || !documentVisible || animationFrame !== undefined) return;
      animationFrame = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && documentVisible) start();
      else stop();
    });
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      documentVisible = document.visibilityState === "visible";
      if (documentVisible) start();
      else stop();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resize();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [points, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute -left-12 -top-8 z-0 h-[min(660px,82%)] w-[min(720px,72vw)] origin-center [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_0%,#000_52%,transparent_100%)] [mask-image:radial-gradient(ellipse_at_center,#000_0%,#000_52%,transparent_100%)] transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none lg:-left-24 lg:w-[min(720px,58vw)] ${hasEntered ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
    />
  );
}
