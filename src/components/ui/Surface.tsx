import React from "react";
import { cn } from "../../lib/theme";

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

/**
 * 3-Tier Surface Elevation System
 * Level 1: Base resting card surface (subtle 7% opacity border, soft shadow)
 * Level 2: Elevated interactive surface (12% border opacity, medium shadow + subtle glow)
 * Level 3: High-contrast modal / popover surface (30% accent border opacity, strong shadow + glow)
 */
export default function Surface({
  level = 1,
  children,
  className = "",
  hoverEffect = false,
  ...props
}: SurfaceProps) {
  const levelClasses = {
    1: "surface-level-1",
    2: "surface-level-2",
    3: "surface-level-3",
  };

  const hoverClasses = hoverEffect
    ? "transition-all duration-300 hover:border-accent/40 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.08)]"
    : "";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        levelClasses[level],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
