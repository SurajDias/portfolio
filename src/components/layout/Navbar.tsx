import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import { EMAIL, LINKEDIN_URL } from "../../config/site";
import { easeReveal } from "../../lib/motion-constants";
import useReducedMotion from "../../hooks/useReducedMotion";
import { cn } from "../../lib/theme";

import { useContactModal } from "../common/ContactModal";

const links = ["About", "Projects", "Tech Stack", "Certifications", "Contact"];

function MagneticTalkButton({ onClick, className }: { onClick?: () => void; className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPosition({ x: distanceX * 0.18, y: distanceY * 0.18 });

    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x: glowX, y: glowY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-wide text-slate-200 transition-colors duration-200 hover:border-accent/50 hover:text-white shadow-sm cursor-pointer",
        className
      )}
    >
      {isHovered && (
        <span
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(100px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(56, 189, 248, 0.3), transparent 75%)`,
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">Let’s talk</span>
    </motion.button>
  );
}

function formatLocalTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${hours}:${formattedMinutes}${ampm}`;
}

function LocalTimeChip() {
  const [timeStr, setTimeStr] = useState(() => formatLocalTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(formatLocalTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden md:inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.03] px-3.5 py-1.5 text-xs backdrop-blur-md font-mono transition-colors duration-200 hover:border-accent/30"
      title="Current local time"
    >
      <span className="text-[11px] text-text-muted/50 font-normal uppercase tracking-wider">
        Local time
      </span>
      <span className="tabular-nums font-semibold text-text-muted/90">
        {timeStr}
      </span>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { openContactModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
    };
    const sections = ["top", "about", "projects", "tech", "certifications", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-38% 0px -52%", threshold: [0, 0.15, 0.5] }
    );
    sections.forEach((section) => observer.observe(section));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock page scroll while overlay is open & support Escape key + focus handling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    if (!open) {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
      return;
    }

    const backgroundRegions = [document.querySelector("main"), document.querySelector("footer")].filter(
      (element): element is HTMLElement => Boolean(element)
    );
    const previousAriaHidden = backgroundRegions.map((element) => element.getAttribute("aria-hidden"));

    backgroundRegions.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      backgroundRegions.forEach((element, index) => {
        element.removeAttribute("inert");
        const previousValue = previousAriaHidden[index];
        if (previousValue === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", previousValue);
      });
    };
  }, [open]);

  const url = (link: string) => `#${link === "Tech Stack" ? "tech" : link.toLowerCase()}`;
  const closeMenu = () => setOpen(false);
  const toggleMenu = () => {
    if (!open) restoreFocusRef.current = menuButtonRef.current;
    setOpen((isOpen) => !isOpen);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border-subtle bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "bg-transparent py-2"
        )}
      >
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-accent via-sky-400 to-indigo-500 opacity-90 transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
        <Container>
          <div className="flex h-[72px] items-center justify-between">
            <a
              href="#top"
              aria-label="Suraj Dias, back to top"
              className="group flex items-center gap-0.5 text-sm font-extrabold tracking-[0.2em] text-text-primary transition-colors hover:text-accent"
            >
              <span>SURAJ</span>
              <span className="text-accent transition-transform group-hover:scale-125">.</span>
            </a>

            <div className="flex items-center gap-3">
              <LocalTimeChip />

              <div className="hidden sm:block">
                <MagneticTalkButton onClick={openContactModal} />
              </div>

              {/* Full-Screen Menu Trigger Button */}
              <button
                type="button"
                ref={menuButtonRef}
                onClick={toggleMenu}
                aria-label={open ? "Close menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="fullscreen-navigation"
                className="group glass inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-primary transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent shadow-sm"
              >
                <span>Menu</span>
                <Menu size={16} className="text-accent transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Full-Screen Overlay Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="fullscreen-nav-overlay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-label="Navigation Overlay"
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-background/96 backdrop-blur-2xl p-6 sm:p-12 lg:p-16 select-none overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
              <a
                href="#top"
                onClick={closeMenu}
                aria-label="Suraj Dias, back to top"
                className="group flex items-center gap-0.5 text-sm font-extrabold tracking-[0.2em] text-text-primary transition-colors hover:text-accent"
              >
                <span>SURAJ</span>
                <span className="text-accent transition-transform group-hover:scale-125">.</span>
              </a>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="group rounded-full border border-border-subtle bg-white/[0.05] p-3 text-text-muted transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
              >
                <X size={24} className="transition-transform duration-300 group-hover:rotate-90 text-accent" />
              </button>
            </div>

            {/* Main Navigation Links List (Large typography, 1 per line, staggered rise-in) */}
            <nav
              id="fullscreen-navigation"
              aria-label="Full-screen navigation"
              className="my-auto py-8 max-w-7xl w-full mx-auto"
            >
              <ul className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                {links.map((link, index) => {
                  const linkId = link === "Tech Stack" ? "tech" : link.toLowerCase();
                  const current = active === linkId;
                  const isContactLink = link === "Contact";

                  return (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        ...easeReveal,
                        delay: reducedMotion ? 0 : 0.12 + index * 0.07,
                      }}
                    >
                      <a
                        href={isContactLink ? undefined : url(link)}
                        onClick={(e) => {
                          closeMenu();
                          if (isContactLink) {
                            e.preventDefault();
                            openContactModal();
                          }
                        }}
                        className={cn(
                          "group inline-flex items-baseline gap-4 sm:gap-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight transition-colors duration-200 cursor-pointer",
                          current ? "text-accent" : "text-text-primary hover:text-accent"
                        )}
                      >
                        <span className="font-mono text-sm sm:text-base text-accent/60 group-hover:text-accent transition-colors font-semibold">
                          0{index + 1}
                        </span>
                        <span>{link}</span>
                        {current && (
                          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse" />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Footer inside Overlay */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border-subtle max-w-7xl w-full mx-auto text-xs text-text-muted font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for opportunities</span>
              </div>

              <div className="flex items-center gap-6">
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-accent flex items-center gap-1"
                >
                  {EMAIL}
                  <ArrowUpRight size={12} />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent flex items-center gap-1"
                >
                  LinkedIn
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
