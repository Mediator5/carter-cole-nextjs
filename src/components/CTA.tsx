import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function CTA({
  title = "Ready to get clear on your money?",
  intro = "Start with a complimentary consultation. We'll look at where you stand — taxes, credit, entity, books — and tell you plainly what to do next.",
  image = "/images/lashanda-mug.jpg",
}: {
  title?: string;
  intro?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-emerald-700/20 blur-3xl"
      />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <span className="eyebrow !text-gold-300">Next step</span>
          <h2 className="display mt-4 text-[32px] leading-[1.12] text-white sm:text-[42px]">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.75] text-white/70">
            {intro}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/book" className="btn-gold">
              Book Consultation
            </Link>
            <Link href="/smarttaxiq#start" className="btn-primary">
              Start Your Tax Return
            </Link>
            <a href={site.phoneHref} className="btn-ghost-light">
              Call {site.phone}
            </a>
          </div>
          <p className="mt-6 text-[13.5px] text-white/45">
            {site.hours} · Every inquiry answered within 2 business days.
          </p>
        </Reveal>

        <Reveal delay={120} className="hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={image}
              alt="Lashanda Carter, Founder of Carter Cole & Associates"
              fill
              sizes="(max-width: 1024px) 0px, 460px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
