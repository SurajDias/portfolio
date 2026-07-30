import { motion } from "framer-motion";

export default function Background() {
  return (
    <div aria-hidden="true">
      <div className="fixed inset-0 -z-50 bg-[#050816]" />
      <motion.div
        animate={{
          x: [0, 45, 0], y: [0, 35, 0], opacity: [0.14, 0.22, 0.14],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -left-48 -top-40 -z-40 h-[46rem] w-[46rem] rounded-full bg-blue-600 blur-[180px]"
      />
      <div className="fixed right-[-16rem] top-[28rem] -z-40 h-[40rem] w-[40rem] rounded-full bg-sky-500/[0.08] blur-[150px]" />
      <div
        className="fixed inset-0 -z-30 opacity-[0.035] [background-image:linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div className="noise pointer-events-none fixed inset-0 -z-20 opacity-[0.025]" />
    </div>
  );
}
