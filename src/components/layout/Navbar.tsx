import Container from "../common/Container";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#050816]/70 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-lg font-bold tracking-[0.2em] text-white transition hover:text-sky-400"
          >
            SURAJ DIAS
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a
              href="#about"
              className="transition-colors duration-300 hover:text-white"
            >
              About
            </a>

            <a
              href="#projects"
              className="transition-colors duration-300 hover:text-white"
            >
              Projects
            </a>

            <a
              href="#tech"
              className="transition-colors duration-300 hover:text-white"
            >
              Tech Stack
            </a>

            <a
              href="#contact"
              className="transition-colors duration-300 hover:text-white"
            >
              Contact
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}