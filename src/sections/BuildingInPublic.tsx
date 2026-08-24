import { ArrowUpRight, CalendarDays, Flame, FolderGit2, GitCommitHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import CountUp from "../components/ui/CountUp";
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

type SnakeGame = {
  cells: Map<string, SVGRectElement>;
  snake: string[];
  food: string;
  direction: number;
  nextDirection: number;
  intervalId: ReturnType<typeof window.setInterval>;
};

const stats: Stat[] = [
  { label: "Contributions", value: 116, subtitle: "↗ Consistently building", icon: CalendarDays },
  { label: "Repositories", value: 8, subtitle: "3 actively maintained", icon: FolderGit2 },
  { label: "Current streak", value: 2, subtitle: "Keep building 🚀", icon: Flame },
  { label: "Longest streak", value: 4, subtitle: "Best run this year", icon: Flame },
];



function getAdjacentDates(date: string) {
  const baseDate = new Date(`${date}T00:00:00Z`);

  return [-7, -1, 1, 7].map((offset) => {
    const adjacentDate = new Date(baseDate);
    adjacentDate.setUTCDate(adjacentDate.getUTCDate() + offset);
    return adjacentDate.toISOString().slice(0, 10);
  });
}

function addDays(date: string, days: number) {
  const nextDate = new Date(`${date}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

export default function BuildingInPublic() {
  const statsRef = useRef<HTMLDListElement>(null);
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const snakeHintRef = useRef<HTMLButtonElement>(null);
  const activeCalendarCells = useRef(new Set<SVGRectElement>());
  const snakeGame = useRef<SnakeGame | null>(null);
  const snakeParticles = useRef(new Set<HTMLSpanElement>());
  const snakeParticleTimeouts = useRef(new Set<ReturnType<typeof window.setTimeout>>());
  const isSnakeActiveRef = useRef(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [snakeMessage, setSnakeMessage] = useState("");


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
    if (isSnakeActiveRef.current) return;
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
    if (isSnakeActiveRef.current) return;
    if (cell === document.activeElement || cell.matches(":hover")) return;
    clearCalendarInteraction();
  };

  const clearSnakeParticles = useCallback(() => {
    snakeParticleTimeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    snakeParticleTimeouts.current.clear();
    snakeParticles.current.forEach((particle) => particle.remove());
    snakeParticles.current.clear();
  }, []);

  const clearSnakeBoard = useCallback(() => {
    calendarScrollRef.current?.classList.remove("github-calendar--playing");
    calendarScrollRef.current?.querySelectorAll<SVGRectElement>(".github-calendar-cell--snake, .github-calendar-cell--snake-head, .github-calendar-cell--food, .github-calendar-cell--burst")
      .forEach((cell) => cell.classList.remove("github-calendar-cell--snake", "github-calendar-cell--snake-head", "github-calendar-cell--food", "github-calendar-cell--burst"));
    clearSnakeParticles();
  }, [clearSnakeParticles]);

  const stopSnake = useCallback((message = "") => {
    const game = snakeGame.current;
    if (game) window.clearInterval(game.intervalId);
    snakeGame.current = null;
    isSnakeActiveRef.current = false;
    clearSnakeBoard();
    setSnakeMessage(message);
    window.requestAnimationFrame(() => snakeHintRef.current?.focus({ preventScroll: true }));
  }, [clearSnakeBoard]);

  const burstAt = useCallback((cell: SVGRectElement) => {
    const container = calendarScrollRef.current;
    if (!container) return;

    const cellBounds = cell.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    cell.classList.add("github-calendar-cell--burst");

    for (let index = 0; index < 5; index += 1) {
      const particle = document.createElement("span");
      particle.className = "github-snake-particle";
      particle.style.left = `${cellBounds.left - containerBounds.left + container.scrollLeft + cellBounds.width / 2}px`;
      particle.style.top = `${cellBounds.top - containerBounds.top + container.scrollTop + cellBounds.height / 2}px`;
      particle.style.setProperty("--snake-particle-x", `${(Math.random() - 0.5) * 24}px`);
      particle.style.setProperty("--snake-particle-y", `${(Math.random() - 0.5) * 24}px`);
      container.appendChild(particle);
      snakeParticles.current.add(particle);

      const timeoutId = window.setTimeout(() => {
        particle.remove();
        snakeParticles.current.delete(particle);
        snakeParticleTimeouts.current.delete(timeoutId);
      }, 460);
      snakeParticleTimeouts.current.add(timeoutId);
    }

    const burstTimeout = window.setTimeout(() => {
      cell.classList.remove("github-calendar-cell--burst");
      snakeParticleTimeouts.current.delete(burstTimeout);
    }, 460);
    snakeParticleTimeouts.current.add(burstTimeout);
  }, []);

  const paintSnake = useCallback((game: SnakeGame, previousSnake: string[] = []) => {
    previousSnake.forEach((date) => game.cells.get(date)?.classList.remove("github-calendar-cell--snake", "github-calendar-cell--snake-head"));
    game.snake.forEach((date, index) => {
      const cell = game.cells.get(date);
      if (!cell) return;
      cell.classList.add("github-calendar-cell--snake");
      if (index === 0) cell.classList.add("github-calendar-cell--snake-head");
    });
    game.cells.get(game.food)?.classList.add("github-calendar-cell--food");
  }, []);

  const startSnake = useCallback(() => {
    if (isSnakeActiveRef.current) return;

    const cells = new Map<string, SVGRectElement>();
    calendarScrollRef.current?.querySelectorAll<SVGRectElement>(".github-calendar-cell[data-date]")
      .forEach((cell) => {
        if (cell.dataset.date) cells.set(cell.dataset.date, cell);
      });

    const head = [...cells.keys()].find((date) => cells.has(addDays(date, -7)) && cells.has(addDays(date, -14)) && cells.has(addDays(date, 7)));
    if (!head) return;

    const snake = [head, addDays(head, -7), addDays(head, -14)];
    const availableFoodCells = [...cells.keys()].filter((date) => !snake.includes(date));
    const food = availableFoodCells[Math.floor(Math.random() * availableFoodCells.length)];
    if (!food) return;

    clearCalendarInteraction();
    clearSnakeBoard();
    isSnakeActiveRef.current = true;
    calendarScrollRef.current?.classList.add("github-calendar--playing");
    setSnakeMessage("Snake active. Use arrow keys or WASD. Press Escape to exit.");

    const game: SnakeGame = { cells, snake, food, direction: 7, nextDirection: 7, intervalId: 0 };
    snakeGame.current = game;
    paintSnake(game);
    calendarScrollRef.current?.focus({ preventScroll: true });

    game.intervalId = window.setInterval(() => {
      const currentGame = snakeGame.current;
      if (!currentGame) return;

      if (currentGame.nextDirection !== -currentGame.direction) {
        currentGame.direction = currentGame.nextDirection;
      }

      const nextHead = addDays(currentGame.snake[0], currentGame.direction);
      const willEat = nextHead === currentGame.food;
      const occupiedCells = willEat ? currentGame.snake : currentGame.snake.slice(0, -1);
      if (!currentGame.cells.has(nextHead) || occupiedCells.includes(nextHead)) {
        stopSnake("Snake game over. Press S to play again.");
        return;
      }

      const previousSnake = [...currentGame.snake];
      currentGame.snake.unshift(nextHead);
      if (!willEat) currentGame.snake.pop();

      if (willEat) {
        const eatenCell = currentGame.cells.get(currentGame.food);
        eatenCell?.classList.remove("github-calendar-cell--food");
        if (eatenCell) burstAt(eatenCell);
        const foodOptions = [...currentGame.cells.keys()].filter((date) => !currentGame.snake.includes(date));
        currentGame.food = foodOptions[Math.floor(Math.random() * foodOptions.length)];
      }

      paintSnake(currentGame, previousSnake);
    }, 145);
  }, [burstAt, clearSnakeBoard, paintSnake, stopSnake]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches("input, textarea, select, [contenteditable='true']");

      if (!isSnakeActiveRef.current) {
        if (event.key.toLowerCase() === "s" && !isTyping) startSnake();
        return;
      }

      const directionByKey: Record<string, number> = {
        ArrowUp: -1,
        w: -1,
        ArrowDown: 1,
        s: 1,
        ArrowLeft: -7,
        a: -7,
        ArrowRight: 7,
        d: 7,
      };

      if (event.key === "Escape") {
        event.preventDefault();
        stopSnake();
        return;
      }

      const nextDirection = directionByKey[event.key] ?? directionByKey[event.key.toLowerCase()];
      if (nextDirection) {
        event.preventDefault();
        const game = snakeGame.current;
        if (game && nextDirection !== -game.direction) game.nextDirection = nextDirection;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (isSnakeActiveRef.current) stopSnake();
    };
  }, [startSnake, stopSnake]);

  return (
    <section
      id="building-in-public"
      className="relative border-y border-border-subtle bg-surface/20 py-24 sm:py-32"
      aria-labelledby="building-in-public-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-corner opacity-40" />
      <Container>
        <SectionHeading
          eyebrow="Building in public"
          title="Building in Public"
          description="Consistently shipping code, learning in public, and documenting progress through open-source contributions."
        />

        <motion.article
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="glass-card mt-14 overflow-hidden rounded-3xl border border-border-subtle bg-surface-glass/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-accent/30"
        >
          <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-4 sm:px-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent shadow-inner">
              <GitCommitHorizontal size={18} aria-hidden="true" />
            </span>
            <div>
              <h3 id="building-in-public-title" className="text-sm font-bold text-text-primary">
                GitHub Activity
              </h3>
              <p className="mt-0.5 text-xs font-medium text-text-muted">@{GITHUB_USERNAME}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div
              ref={calendarScrollRef}
              tabIndex={-1}
              className="github-calendar-scroll relative -mx-6 overflow-x-auto px-6 pb-4 pt-2 sm:-mx-8 sm:px-8"
              aria-label={`${GITHUB_USERNAME}'s GitHub contribution calendar`}
            >
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
                renderBlock={(block, activity) =>
                  cloneElement(block, {
                    className: "github-calendar-cell",
                    tabIndex: 0,
                    "aria-label": `${activity.date}: ${activity.count} ${activity.count === 1 ? "contribution" : "contributions"}`,
                    onPointerEnter: (event) =>
                      highlightCalendarInteraction(event.currentTarget, activity.date),
                    onPointerLeave: (event) =>
                      removeCalendarInteraction(event.currentTarget),
                    onFocus: (event) => {
                      highlightCalendarInteraction(event.currentTarget, activity.date);
                      event.currentTarget.dispatchEvent(new MouseEvent("mouseenter"));
                    },
                    onBlur: (event) => {
                      event.currentTarget.dispatchEvent(new MouseEvent("mouseleave"));
                      removeCalendarInteraction(event.currentTarget);
                    },
                  })
                }
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
              <button
                ref={snakeHintRef}
                type="button"
                onClick={startSnake}
                className="mt-3 text-[11px] font-medium text-text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
              >
                Press S to play
              </button>
              <p className="sr-only" aria-live="polite">
                {snakeMessage}
              </p>
            </div>

            <dl
              ref={statsRef}
              className="mt-6 grid gap-4 border-t border-border-subtle/60 pt-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map(({ label, value, subtitle, icon: Icon }) => (
                <div
                  key={label}
                  className="glass flex min-h-[92px] flex-col rounded-2xl border border-border-subtle bg-white/[0.025] px-4 py-3.5 backdrop-blur-md transition-all duration-300 hover:border-accent/30 hover:bg-white/[0.05]"
                >
                  <dt className="order-2 mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    <Icon size={13} className="text-accent" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="order-1 text-2xl font-extrabold tracking-tight text-text-primary">
                    <CountUp to={value} duration={1.0} />
                  </dd>
                  <dd className="order-3 mt-1 text-xs text-text-muted/70 font-medium">{subtitle}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex justify-end">
              <Button
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="Follow Suraj Dias on GitHub"
                variant="secondary"
              >
                Follow on GitHub <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </motion.article>
      </Container>
    </section>
  );
}

