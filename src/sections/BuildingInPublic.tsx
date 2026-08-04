import { ArrowUpRight, GitCommitHorizontal, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";

const GITHUB_USERNAME = "SurajDias";
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
const reveal = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

type GitHubProfile = {
  public_repos: number;
  followers: number;
  following: number;
};

type Stat = { label: string; value: number; icon: typeof GitCommitHorizontal };

export default function BuildingInPublic() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() as Promise<GitHubProfile> : null))
      .then((data) => setProfile(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProfile(null);
      });

    return () => controller.abort();
  }, []);

  const stats: Stat[] = profile ? [
    { label: "Public repositories", value: profile.public_repos, icon: GitCommitHorizontal },
    { label: "Followers", value: profile.followers, icon: Users },
    { label: "Following", value: profile.following, icon: Users },
  ] : [];

  return (
    <section id="building-in-public" className="border-y border-white/[.07] bg-[#0b1220]/45 py-24 sm:py-32" aria-labelledby="building-in-public-title">
      <Container>
        <SectionHeading
          eyebrow="Building in public"
          title="Building in Public"
          description="Consistently shipping code, learning in public, and documenting progress through open-source contributions."
        />

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reveal}
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
            <div className="github-calendar-scroll overflow-x-auto pb-2" aria-label={`${GITHUB_USERNAME}'s GitHub contribution calendar`}>
              <GitHubCalendar
                username={GITHUB_USERNAME}
                year="last"
                colorScheme="dark"
                blockSize={11}
                blockMargin={4}
                blockRadius={3}
                fontSize={12}
                showWeekdayLabels={["mon", "wed", "fri"]}
                theme={{ dark: ["#172033", "#12324a", "#0e587b", "#0284c7", "#7dd3fc"] }}
                labels={{ totalCount: "{{count}} contributions in the last year" }}
                tooltips={{ activity: { text: (activity) => `${activity.count} contributions on ${activity.date}` } }}
                errorMessage="GitHub activity is currently unavailable."
              />
            </div>

            {stats.length > 0 && (
              <motion.dl
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="mt-7 grid gap-3 border-t border-white/[.08] pt-5 sm:grid-cols-3"
              >
                {stats.map(({ label, value, icon: Icon }) => (
                  <motion.div key={label} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} transition={reveal} className="rounded-lg border border-white/[.08] bg-[#050816]/35 px-4 py-3">
                    <dt className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.14em] text-slate-500"><Icon size={13} className="text-sky-400" aria-hidden="true" />{label}</dt>
                    <dd className="mt-2 text-xl font-semibold tracking-[-.03em] text-slate-100">{value.toLocaleString()}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            )}

            <div className="mt-7 flex justify-end">
              <Button href={GITHUB_URL} target="_blank" rel="noopener noreferrer" ariaLabel="Follow Suraj Dias on GitHub" variant="secondary">
                Follow on GitHub <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </motion.article>
      </Container>
    </section>
  );
}
