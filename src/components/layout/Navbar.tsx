import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import { interactionTransition } from "../../lib/motion-variants";
import { cn } from "../../lib/theme";

const links = ["About", "Projects", "Tech Stack", "Certifications", "Contact"];

function MagneticTalkButton({ href, className }: { href: string; className?: string }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    <motion.a
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-wide text-slate-200 transition-colors duration-200 hover:border-accent/50 hover:text-white shadow-sm",
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
    </motion.a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (!open) {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
      return;
    }

    const navigation = mobileNavigationRef.current;
    const focusableSelector = "a[href], button:not([disabled])";
    const focusableItems = () =>
      Array.from(navigation?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    const backgroundRegions = [document.querySelector("main"), document.querySelector("footer")].filter(
      (element): element is HTMLElement => Boolean(element)
    );
    const previousAriaHidden = backgroundRegions.map((element) => element.getAttribute("aria-hidden"));

    backgroundRegions.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    });
    requestAnimationFrame(() => focusableItems()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusableItems();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
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

  return (
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

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 rounded-full border border-border-subtle bg-surface-glass/70 px-3 py-1.5 text-sm font-medium text-text-muted shadow-lg backdrop-blur-xl md:flex"
          >
            {links.map((link) => {
              const linkId = link === "Tech Stack" ? "tech" : link.toLowerCase();
              const current = active === linkId;
              return (
                <a
                  key={link}
                  href={url(link)}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 transition-colors duration-200 hover:text-text-primary",
                    current ? "text-text-primary font-semibold" : "text-text-muted"
                  )}
                >
                  {link}
                  {current && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 z-[-1] rounded-full bg-white/10 border border-accent/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <MagneticTalkButton href="#contact" />
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={toggleMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="rounded-lg border border-border-subtle bg-white/[0.03] p-2 text-text-muted transition-colors hover:border-accent/30 hover:bg-white/5 hover:text-text-primary md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={21} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              ref={mobileNavigationRef}
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={interactionTransition}
              className="mt-2 rounded-2xl border border-border-subtle bg-surface/95 p-4 backdrop-blur-2xl shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {links.map((link) => {
                  const linkId = link === "Tech Stack" ? "tech" : link.toLowerCase();
                  const current = active === linkId;
                  return (
                    <a
                      onClick={closeMenu}
                      key={link}
                      href={url(link)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        current
                          ? "bg-accent/10 font-semibold text-accent"
                          : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                      )}
                    >
                      <span>{link}</span>
                      {current && <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />}
                    </a>
                  );
                })}
                <a
                  onClick={closeMenu}
                  href="#contact"
                  className="mt-2 flex items-center justify-center rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent/20 hover:text-white"
                >
                  Let’s talk
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}

