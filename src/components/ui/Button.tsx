import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-500"
    >
      {children}
    </motion.button>
  );
}