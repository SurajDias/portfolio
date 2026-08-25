import { lazy, Suspense, useState } from "react";
import { MotionConfig } from "motion/react";
import Background from "./components/common/Background";
import CursorSpotlight from "./components/common/CursorSpotlight";
import CustomCursor from "./components/common/CustomCursor";
import IntroSequence from "./components/common/IntroSequence";
import Container from "./components/common/Container";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import { entranceTransition } from "./lib/motion-variants";
import useSmoothScroll from "./hooks/useSmoothScroll";
import { ContactModalProvider } from "./components/common/ContactModal";

const Projects = lazy(() => import("./sections/Projects"));
const TechStack = lazy(() => import("./sections/TechStack"));
const Certifications = lazy(() => import("./sections/Certifications"));
const BuildingInPublic = lazy(() => import("./sections/BuildingInPublic"));
const About = lazy(() => import("./sections/About"));
const Contact = lazy(() => import("./sections/Contact"));

function App() {
  useSmoothScroll();
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <MotionConfig reducedMotion="user" transition={entranceTransition}>
      <ContactModalProvider>
        <div className="relative overflow-x-clip">
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-[60] rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-950 focus:not-sr-only focus:outline-none"
          >
            Skip to content
          </a>
          <IntroSequence onComplete={() => setIsIntroComplete(true)} />
          <Background />
          <CursorSpotlight />
          <CustomCursor />
          <Navbar />
          <main id="main-content">
            <Hero isIntroComplete={isIntroComplete} />
            <Suspense fallback={<SectionLoadingFallback />}>
              <Projects />
              <TechStack />
              <Certifications />
              <BuildingInPublic />
              <About />
              <Contact />
            </Suspense>
          </main>
          <Footer />
        </div>
      </ContactModalProvider>
    </MotionConfig>
  );
}

function SectionLoadingFallback() {
  return (
    <div className="py-24 sm:py-32" role="status" aria-live="polite">
      <Container>
        <div className="h-44 animate-pulse rounded-3xl border border-border-subtle bg-surface-glass/40 backdrop-blur-md" />
        <span className="sr-only">Loading portfolio sections</span>
      </Container>
    </div>
  );
}

export default App;

