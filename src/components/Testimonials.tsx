import { testimonials } from "@/lib/site";
import Reveal from "./Reveal";
import { SectionHeading } from "./Section";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#ddb33c" aria-hidden>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({
  limit = 6,
  className = "",
}: {
  limit?: number;
  className?: string;
}) {
  return (
    <section className={`bg-cream py-20 sm:py-24 ${className}`}>
      <div className="container-x">
        <SectionHeading
          eyebrow="Client results"
          title="The work speaks, but our clients say it better"
          intro="Rated excellent across independent reviews — for credit turnarounds, clean returns, and businesses launched the right way."
          align="center"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, limit).map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <figure className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-7 shadow-[0_18px_40px_-32px_rgba(15,29,68,0.5)]">
                <Stars />
                <blockquote className="mt-5 flex-1 text-[15.5px] leading-[1.7] text-navy/80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-navy/10 pt-5">
                  <span className="block text-[15px] font-semibold text-navy">
                    {t.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-navy/50">
                    {t.detail}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
