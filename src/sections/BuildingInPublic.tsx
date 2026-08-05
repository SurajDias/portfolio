import { ArrowUpRight, CalendarDays, Flame, FolderGit2, GitCommitHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { cloneElement, useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import { fadeUp } from "../lib/motion-variants";

const GITHUB_USERNAME = "SurajDias";
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

type Stat = {
  label: string;
  value: number;
  subtitle: string;
  icon: typeof GitCommitHorizontal;
};

const stats: Stat[] = [
  { label: "Contributions", value: 116, subtitle: "↗ Consistently building", icon: CalendarDays },
  { label: "Repositories", value: 8, subtitle: "3 actively maintained", icon: FolderGit2 },
  { label: "Current streak", value: 2, subtitle: "Keep building 🚀", icon: Flame },
  { label: "Longest streak", value: 4, subtitle: "Best run this year", icon: Flame },
];

function useAnimatedNumber(value: number, shouldAnimate: boolean, prefersReducedMotion: boolean) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 800, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [prefersReducedMotion, shouldAnimate, value]);

  return displayValue;
}

function StatValue({ value, shouldAnimate, prefersReducedMotion }: { value: number; shouldAnimate: boolean; prefersReducedMotion: boolean }) {
  const displayValue = useAnimatedNumber(value, shouldAnimate, prefersReducedMotion);

  return <>{displayValue.toLocaleString()}</>;
}

function getAdjacentDates(date: string) {
  const baseDate = new Date(`${date}T00:00:00Z`);

  return [-7, -1, 1, 7].map((offset) => {
    const adjacentDate = new Date(baseDate);
    adjacentDate.setUTCDate(adjacentDate.getUTCDate() + offset);
    return adjacentDate.toISOString().slice(0, 10);
  });
}

export default function BuildingInPublic() {
  const statsRef = useRef<HTMLDListElement>(null);
  const activeCalendarCells = useRef(new Set<SVGRectElement>());
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const element = statsRef.current;
    if (!element || hasEnteredViewport) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasEnteredViewport(true);
      observer.disconnect();
    }, { threshold: 0.15 });

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEnteredViewport]);

  const clearCalendarInteraction = () => {
    activeCalendarCells.current.forEach((cell) => cell.classList.remove("github-calendar-cell--adjacent"));
    activeCalendarCells.current.clear();
  };

  const highlightCalendarInteraction = (cell: SVGRectElement, date: string) => {
    clearCalendarInteraction();
    const calendar = cell.ownerSVGElement;
    if (!calendar) return;

    getAdjacentDates(date).forEach((adjacentDate) => {
      const adjacentCell = calendar.querySelector<SVGRectElement>(`[data-date="${adjacentDate}"]`);
      if (!adjacentCell) return;
      adjacentCell.classList.add("github-calendar-cell--adjacent");
      activeCalendarCells.current.add(adjacentCell);
    });
  };

  const removeCalendarInteraction = (cell: SVGRectElement) => {
    if (cell === document.activeElement || cell.matches(":hover")) return;
    clearCalendarInteraction();
  };

  return (
    <motion.section id="building-in-public" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true, margin: "-100px" }} className="border-y border-white/[.07] bg-[#0b1220]/45 py-24 sm:py-32" aria-labelledby="building-in-public-title">
      <Container>
        <SectionHeading
          eyebrow="Building in public"
          title="Building in Public"
          description="Consistently shipping code, learning in public, and documenting progress through open-source contributions."
        />

        <article
          className="mt-14 overflow-hidden rounded-xl border border-white/[.09] bg-white/[.025]"
        >
          <div className="flex items-center gap-3 border-b border-white/[.08] px-5 py-4 sm:px-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.08] bg-[#050816]/60 text-sky-300">
              <GitCommitHorizontal size={18} aria-hidden="true" />
            </span>
            <div>
              <h3 id="building-in-public-title" className="text-sm font-medium text-slate-100">GitHub Activity</h3>
              <p className="mt-0.5 text-xs text-slate-500">@{GITHUB_USERNAME}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="github-calendar-scroll -mx-5 overflow-x-auto px-5 pb-4 pt-2 sm:-mx-6 sm:px-6" aria-label={`${GITHUB_USERNAME}'s GitHub contribution calendar`}>
              <GitHubCalendar
                username={GITHUB_USERNAME}
                year="last"
                colorScheme="dark"
                blockSize={13}
                blockMargin={4}
                blockRadius={3}
                fontSize={12}
                showWeekdayLabels={["mon", "wed", "fri"]}
                theme={{ dark: ["#172033", "#12324a", "#0e587b", "#0284c7", "#7dd3fc"] }}
                labels={{ totalCount: "" }}
                renderBlock={(block, activity) => cloneElement(block, {
                  className: "github-calendar-cell",
                  tabIndex: 0,
                  "aria-label": `${activity.date}: ${activity.count} ${activity.count === 1 ? "contribution" : "contributions"}`,
                  onPointerEnter: (event) => highlightCalendarInteraction(event.currentTarget, activity.date),
                  onPointerLeave: (event) => removeCalendarInteraction(event.currentTarget),
                  onFocus: (event) => {
                    highlightCalendarInteraction(event.currentTarget, activity.date);
                    event.currentTarget.dispatchEvent(new MouseEvent("mouseenter"));
                  },
                  onBlur: (event) => {
                    event.currentTarget.dispatchEvent(new MouseEvent("mouseleave"));
                    removeCalendarInteraction(event.currentTarget);
                  },
                })}
                tooltips={{
                  activity: {
                    text: (activity) => `Date: ${activity.date} · Contributions: ${activity.count}`,
                    transitionStyles: {
                      duration: 140,
                      initial: { opacity: 0 },
                      open: { opacity: 1 },
                      close: { opacity: 0 },
                      common: { transition: "opacity 140ms ease-out" },
                    },
                  },
                }}
                errorMessage="GitHub activity is currently unavailable."
              />
            </div>

            <dl
              ref={statsRef}
              className="mt-5 grid gap-3 border-t border-white/[.08] pt-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map(({ label, value, subtitle, icon: Icon }) => (
                <div key={label} className="flex min-h-[88px] flex-col rounded-lg border border-white/[.08] bg-[#050816]/35 px-4 py-3">
                  <dt className="order-2 mt-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.14em] text-slate-400"><Icon size={13} className="text-sky-400" aria-hidden="true" />{label}</dt>
                  <dd className="order-1 text-2xl font-semibold tracking-[-.03em] text-slate-100">
                    <StatValue value={value} shouldAnimate={hasEnteredViewport} prefersReducedMotion={prefersReducedMotion} />
                  </dd>
                  <dd className="order-3 mt-1 text-xs text-slate-500">{subtitle}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex justify-end">
              <Button href={GITHUB_URL} target="_blank" rel="noopener noreferrer" ariaLabel="Follow Suraj Dias on GitHub" variant="secondary">
                Follow on GitHub <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </article>
      </Container>
    </motion.section>
  );
}
