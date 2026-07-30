import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Container from "../common/Container";

const links = ["About", "Projects", "Tech Stack", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  const url = (link: string) => `#${link === "Tech Stack" ? "tech" : link.toLowerCase()}`;
  return <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-white/[.08] bg-[#050816]/75 backdrop-blur-xl" : "bg-transparent"}`}>
    <Container><div className="flex h-[72px] items-center justify-between">
      <a href="#top" className="text-sm font-semibold tracking-[.18em] text-white transition hover:text-sky-300">SURAJ<span className="text-sky-400">.</span></a>
      <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">{links.map(link => <a key={link} href={url(link)} className="transition-colors hover:text-white">{link}</a>)}</nav>
      <a href="#contact" className="hidden rounded-md border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-white/5 md:block">Let’s talk</a>
      <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="text-slate-300 md:hidden">{open ? <X size={20} /> : <Menu size={21} />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[.08] md:hidden"><div className="flex flex-col py-3">{links.map(link => <a onClick={() => setOpen(false)} key={link} href={url(link)} className="py-3 text-sm text-slate-300">{link}</a>)}</div></motion.nav>}</AnimatePresence>
    </Container></header>;
}
