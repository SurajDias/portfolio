import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Container from "../common/Container";

const links = ["About", "Projects", "Tech Stack", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
    };
    const sections = ["top", "about", "projects", "tech", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-38% 0px -52%", threshold: [0, 0.15, 0.5] });
    sections.forEach((section) => observer.observe(section));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  const url = (link: string) => `#${link === "Tech Stack" ? "tech" : link.toLowerCase()}`;
  return <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-white/[.08] bg-[#050816]/75 shadow-[0_10px_30px_rgba(0,0,0,.08)] backdrop-blur-xl" : "bg-transparent"}`}>
    <motion.div aria-hidden="true" className="absolute bottom-0 left-0 h-px origin-left bg-gradient-to-r from-sky-300 via-blue-500 to-transparent" style={{ width: `${progress}%` }} />
    <Container><div className="flex h-[72px] items-center justify-between">
      <a href="#top" aria-label="Suraj Dias, back to top" className="text-sm font-semibold tracking-[.18em] text-white transition hover:text-sky-300">SURAJ<span className="text-sky-400">.</span></a>
      <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">{links.map(link => { const current = active === (link === "Tech Stack" ? "tech" : link.toLowerCase()); return <a key={link} href={url(link)} aria-current={current ? "page" : undefined} className={`relative py-2 transition-colors hover:text-white ${current ? "text-slate-100" : ""}`}>{link}{current && <motion.span layoutId="nav-active" className="absolute inset-x-0 -bottom-[1px] h-px bg-sky-300" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}</a>; })}</nav>
      <a href="#contact" className="hidden rounded-md border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-white/5 md:block">Let’s talk</a>
      <button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation" className="rounded p-2 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden">{open ? <X size={20} /> : <Menu size={21} />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .2 }} className="overflow-hidden border-t border-white/[.08] bg-[#050816]/95 backdrop-blur-xl md:hidden"><div className="flex flex-col py-2">{links.map(link => <a onClick={() => setOpen(false)} key={link} href={url(link)} className="rounded px-2 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">{link}</a>)}<a onClick={() => setOpen(false)} href="#contact" className="mt-1 rounded px-2 py-3 text-sm text-sky-300">Let’s talk</a></div></motion.nav>}</AnimatePresence>
    </Container></header>;
}
