import Reveal from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`eyebrow ${align === "center" ? "justify-center" : ""} ${
            light ? "!text-gold-300" : ""
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`display mt-4 text-[30px] leading-[1.15] sm:text-[38px] ${
          light ? "!text-white" : ""
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`prose-body mt-5 ${light ? "!text-white/70" : ""}`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy pb-16 pt-16 text-white sm:pb-20 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-emerald-700/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[320px] w-[320px] rounded-full bg-gold/10 blur-3xl"
      />
      <div className="container-x relative">
        <Reveal className="max-w-3xl">
          <span className="eyebrow !text-gold-300">{eyebrow}</span>
          <h1 className="display mt-5 text-[36px] leading-[1.08] text-white sm:text-[52px]">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-white/70">
              {intro}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
