import { motion } from "framer-motion";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center">
      <Container>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 tracking-[0.3em] text-sky-400"
        >
          SOFTWARE ENGINEER
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="max-w-4xl text-6xl font-black leading-tight md:text-8xl"
        >
          Turning Ideas into
          <br />
          Production-Ready Software
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-8 max-w-2xl text-lg text-slate-400"
        >
          I build scalable backend systems, AI-powered applications,
          and modern full-stack software focused on performance,
          reliability, and user experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-10"
        >
          <Button>View Projects</Button>
        </motion.div>
      </Container>
    </section>
  );
}