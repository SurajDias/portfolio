import KineticTypography from "./KineticTypography";

type Props = { eyebrow: string; title: string; description?: string };

export default function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-2xl">
      <p className="mb-4 text-xs font-semibold uppercase leading-4 tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <KineticTypography
        text={title}
        as="h2"
        className="text-3xl font-extrabold leading-tight tracking-[-0.035em] text-text-primary sm:text-4xl"
      />
      {description && (
        <p className="mt-5 text-base leading-7 text-text-muted font-normal">
          {description}
        </p>
      )}
    </div>
  );
}

