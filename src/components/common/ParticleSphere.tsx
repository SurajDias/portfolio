import { useEffect, useMemo, useRef } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

type SpherePoint = {
  x: number;
  y: number;
  z: number;
  color: "#38bdf8" | "#a78bfa";
};

const POINT_COUNT = 240;
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
      const sphereRadius = Math.min(width * 0.42, height * 0.45);
      const centerX = width * 0.52;
      const centerY = height * 0.5;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      for (const point of points) {
        const rotatedX = point.x * cosine + point.z * sine;
        const rotatedZ = point.z * cosine - point.x * sine;
        const perspective = 3 / (3 - rotatedZ);
        const depth = (perspective - 0.75) / 0.75;

        context.beginPath();
        context.arc(
          centerX + rotatedX * sphereRadius * perspective,
          centerY + point.y * sphereRadius * perspective,
          0.75 + depth * 0.45,
          0,
          Math.PI * 2,
        );
        context.fillStyle = point.color;
        context.globalAlpha = 0.16 + depth * 0.1;
        context.fill();
      }

      context.globalAlpha = 1;
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

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}
