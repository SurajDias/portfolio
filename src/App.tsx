import Background from "./components/common/Background";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./sections/Hero";
import { MotionConfig } from "framer-motion";
import { lazy, Suspense } from "react";
import Container from "./components/common/Container";

const Projects = lazy(() => import("./sections/Projects"));
const TechStack = lazy(() => import("./sections/TechStack"));
const About = lazy(() => import("./sections/About"));
const Contact = lazy(() => import("./sections/Contact"));

function App() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="overflow-x-clip">
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-[60] rounded bg-sky-300 px-3 py-2 text-sm font-medium text-slate-950 focus:not-sr-only">Skip to content</a>
      <Background />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionLoadingFallback />}>
          <Projects />
          <TechStack />
          <About />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
    </MotionConfig>
  );
}

function SectionLoadingFallback() {
  return (
    <div className="py-24 sm:py-32" role="status" aria-live="polite">
      <Container>
        <div className="h-40 animate-pulse rounded-2xl border border-white/[.08] bg-white/[.025]" />
        <span className="sr-only">Loading portfolio sections</span>
      </Container>
    </div>
  );
}

export default App;
