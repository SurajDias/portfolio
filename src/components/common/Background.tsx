import { motion } from "framer-motion";

export default function Background() {
  return (
    <>
      {/* Base Background */}
      <div className="fixed inset-0 -z-50 bg-[#050816]" />

      {/* Animated Blue Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed left-1/2 top-0 -z-40 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-blue-500 blur-[170px]"
      />

      {/* Engineering Grid */}
      <div
        className="
          fixed
          inset-0
          -z-30
          opacity-[0.05]
          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:60px_60px]
        "
      />
    </>
  );
}