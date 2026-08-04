import { ArrowUpRight, CalendarDays, Flame, FolderGit2, GitCommitHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import { fadeUp } from "../lib/motion-variants";

const GITHUB_USERNAME = "SurajDias";
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
type GitHubProfile = {
  public_repos: number;
};

type Contribution = {
  date: string;
  count: number;
};

type ContributionResponse = {
  contributions: Contribution[];
};

type ContributionStats = {
  total: number;
  currentStreak: number;
  longestStreak: number;
};

type Stat = { label: string; value: number | null; icon: typeof GitCommitHorizontal };

const contributionApiUrl = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function getContributionStats(contributions: Contribution[]): ContributionStats {
  const dailyCounts = new Map(contributions.map(({ date, count }) => [date, count]));
  const sortedContributions = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  let longestStreak = 0;
  let activeStreak = 0;

  for (const { count } of sortedContributions) {
    activeStreak = count > 0 ? activeStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, activeStreak);
  }

  const streakEnd = new Date();
  if ((dailyCounts.get(dateKey(streakEnd)) ?? 0) === 0) {
    streakEnd.setDate(streakEnd.getDate() - 1);
  }

  let currentStreak = 0;
  while ((dailyCounts.get(dateKey(streakEnd)) ?? 0) > 0) {
    currentStreak += 1;
    streakEnd.setDate(streakEnd.getDate() - 1);
  }

  return {
    total: contributions.reduce((sum, { count }) => sum + count, 0),
    currentStreak,
    longestStreak,
  };
}

export default function BuildingInPublic() {
  const [repositoryCount, setRepositoryCount] = useState<number | null>(null);
  const [contributionStats, setContributionStats] = useState<ContributionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    Promise.allSettled([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() as Promise<GitHubProfile> : Promise.reject(new Error("GitHub profile unavailable")))),
      fetch(contributionApiUrl, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() as Promise<ContributionResponse> : Promise.reject(new Error("GitHub contributions unavailable")))),
    ]).then(([profileResult, contributionsResult]) => {
      if (controller.signal.aborted) return;

      if (profileResult.status === "fulfilled") {
        setRepositoryCount(profileResult.value.public_repos);
      }

      if (contributionsResult.status === "fulfilled") {
        setContributionStats(getContributionStats(contributionsResult.value.contributions));
      }

      setIsLoading(false);
    }).catch(() => {
      // Promise.allSettled resolves individual request failures so the section can retain its fallbacks.
      if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
  }, []);

  const stats: Stat[] = [
    { label: "Total contributions (last 12 months)", value: contributionStats?.total ?? null, icon: CalendarDays },
    { label: "Public repositories", value: repositoryCount, icon: FolderGit2 },
    { label: "Current streak", value: contributionStats?.currentStreak ?? null, icon: Flame },
    { label: "Longest streak", value: contributionStats?.longestStreak ?? null, icon: Flame },
  ];

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
                tooltips={{ activity: { text: (activity) => `${activity.count} contributions on ${activity.date}` } }}
                errorMessage="GitHub activity is currently unavailable."
              />
            </div>

            <dl
              aria-busy={isLoading}
              className="mt-5 grid gap-3 border-t border-white/[.08] pt-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="min-h-[88px] rounded-lg border border-white/[.08] bg-[#050816]/35 px-4 py-3">
                  <dt className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.14em] text-slate-500"><Icon size={13} className="text-sky-400" aria-hidden="true" />{label}</dt>
                  <dd className="mt-2 text-xl font-semibold tracking-[-.03em] text-slate-100" aria-live="polite">
                    {value === null ? (isLoading ? "Loading…" : "Unavailable") : value.toLocaleString()}
                  </dd>
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
