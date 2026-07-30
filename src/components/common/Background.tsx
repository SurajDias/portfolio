export default function Background() {
  return (
    <>
      {/* Base Background */}
      <div className="fixed inset-0 -z-50 bg-[#050816]" />

      {/* Blue Glow */}
      <div
        className="
          fixed
          left-1/2
          top-0
          -z-40
          h-[600px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-blue-500/10
          blur-[140px]
        "
      />

      {/* Grid */}
      <div
        className="
          fixed
          inset-0
          -z-30
          opacity-[0.04]
          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:60px_60px]
        "
      />
    </>
  );
}