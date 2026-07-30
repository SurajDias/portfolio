import Container from "../components/common/Container";
import Button from "../components/ui/Button";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center">
      <Container>

        <p className="mb-4 tracking-[0.3em] text-sky-400">
          SOFTWARE ENGINEER
        </p>

        <h1 className="max-w-4xl text-6xl font-black leading-tight md:text-8xl">
          Turning Ideas into
          <br />
          Production-Ready Software
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-slate-400">
          I build scalable backend systems,
          AI-powered applications,
          and modern full-stack software focused on
          performance, reliability, and user experience.
        </p>

        <div className="mt-10">
          <Button>
            View Projects
          </Button>
        </div>

      </Container>
    </section>
  );
}