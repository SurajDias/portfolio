import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import { EMAIL } from "../config/site";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimeout.current), []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(resetTimeout.current);
      resetTimeout.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-white/[.09] bg-[#0b1220]/70 px-6 py-14 sm:px-12 sm:py-16">
          <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
          <p className="relative text-[11px] font-medium uppercase leading-4 tracking-[.2em] text-sky-300">Contact</p>
          <div className="relative mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-.04em] text-slate-100 sm:text-4xl">Have a complex idea worth building?</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">I’m always interested in purposeful products, difficult technical problems, and conversations with people who care about the craft.</p>
            </div>
            <div className="flex flex-wrap gap-3 self-start md:self-auto">
              <Button href={`mailto:${EMAIL}`} className="shrink-0 self-start md:self-auto">
                <Mail size={16} /> Start a conversation <ArrowUpRight size={16} />
              </Button>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="interactive-button group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-slate-200 shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:border-sky-300/30 hover:bg-white/[0.07] hover:shadow-[0_12px_24px_rgba(14,116,144,0.12)] focus-visible:outline-offset-4"
              >
                {copied && <Check size={16} aria-hidden="true" />}
                {copied ? "Copied!" : "Copy Email"}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard." : ""}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
