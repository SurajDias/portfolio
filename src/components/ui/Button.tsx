type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  return (
    <button
      className="
      rounded-xl
      bg-blue-600
      px-6
      py-3
      font-medium
      transition-all
      duration-300
      hover:scale-105
      hover:bg-blue-500
      "
    >
      {children}
    </button>
  );
}