import { useEffect, useMemo, useRef, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

type SpherePoint = {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  alpha: number;
};

const POINT_COUNT = 520;
const ROTATION_DURATION = 75_000;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function noise(index: number, offset = 0) {
  const value = Math.sin((index + 1) * 12.9898 + offset * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createSpherePoints(): SpherePoint[] {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    // Keep the even coverage of a Fibonacci sphere, then introduce a tiny,
    // deterministic irregularity so it reads as a cloud rather than a grid.
    const vertical = Math.max(-1, Math.min(1, 1 - (index / (POINT_COUNT - 1)) * 2 + (noise(index, 1) - 0.5) * 0.045));
    const radius = Math.sqrt(1 - vertical * vertical);
    const angle = index * GOLDEN_ANGLE + (noise(index, 2) - 0.5) * 0.18;

    return {
      x: Math.cos(angle) * radius,
      y: vertical,
      z: Math.sin(angle) * radius,
      size: 0.72 + noise(index, 3) * 1.15,
      brightness: 0.76 + noise(index, 4) * 0.42,
      alpha: 0.72 + noise(index, 5) * 0.28,
    };
  });
}

/** Lightweight, non-interactive Canvas2D sphere used as an ambient hero backdrop. */
export default function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const points = useMemo(createSpherePoints, []);
  const [hasEntered, setHasEntered] = useState(reducedMotion);
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const draw = () => {
      if (!width || !height) return;

      const dpr = window.devicePixelRatio || 1;
      const rotation = (elapsed / ROTATION_DURATION) * Math.PI * 2;
      const cosine = Math.cos(rotation);
      const sine = Math.sin(rotation);
      const sphereRadius = Math.min(width * 0.38, height * 0.42);
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.025;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.025;
      const centerX = width * 0.5 + pointer.current.x * 7;
      const centerY = height * 0.48 + pointer.current.y * 5;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      // The diffuse center glow makes the point cloud feel like a single volume,
      // while the points themselves retain the detail of its surface.
      // Stronger, wider purple bloom with an extra stop for a smoother falloff.
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, sphereRadius * 1.42);
      glow.addColorStop(0, "rgba(176, 85, 247, 0.30)");
      glow.addColorStop(0.22, "rgba(147, 92, 246, 0.16)");
      glow.addColorStop(0.5, "rgba(96, 140, 247, 0.07)");
      glow.addColorStop(0.75, "rgba(56, 189, 248, 0.03)");
      glow.addColorStop(1, "rgba(139, 92, 246, 0)");
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
        // Colour blend keyed to vertical position (not rotation), so the sphere
        // holds a stable cyan-base to magenta-crown gradient as it spins.
        const blend = Math.min(1, Math.max(0, (1 - point.y) * 0.5));
        const red = Math.round((56 + (196 - 56) * blend) * point.brightness);
        const green = Math.round((189 + (96 - 189) * blend) * point.brightness);
        const blue = Math.round((248 + (247 - 248) * blend) * point.brightness);
        const color = `rgb(${red}, ${green}, ${blue})`;
        const size = point.size * (0.68 + depth * 1.35);

        context.beginPath();
        context.arc(
          centerX + rotatedX * sphereRadius * perspective,
          centerY + point.y * sphereRadius * perspective,
          size,
          0,
          Math.PI * 2,
        );
        context.fillStyle = color;
        context.globalAlpha = (0.08 + depth * 0.58) * point.alpha;
        context.shadowColor = color;
        context.shadowBlur = depth > 0.66 ? 4.5 * depth : 0;
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
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    resize();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [points, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute -left-16 top-1/2 z-0 h-[min(720px,88%)] w-[min(780px,76vw)] -translate-y-1/2 origin-center [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_0%,#000_38%,rgba(0,0,0,.45)_70%,transparent_100%)] [mask-image:radial-gradient(ellipse_at_center,#000_0%,#000_38%,rgba(0,0,0,.45)_70%,transparent_100%)] transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none lg:-left-32 lg:w-[min(780px,62vw)] ${hasEntered ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
    />
  );
}