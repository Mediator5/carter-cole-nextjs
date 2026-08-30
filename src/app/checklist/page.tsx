import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/Section";
import ChecklistOptIn from "@/components/ChecklistOptIn";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Business Foundation Checklist",
  description:
    "24 things that hold a business up — legal, financial, operations, brand and mindset. A free checklist from Lashanda Carter of Carter Cole & Associates.",
  alternates: { canonical: "/checklist" },
  openGraph: {
    title: "The Starter to Builder Foundation Checklist — free",
    description:
      "Check off what you have. Circle what you're missing. That's your starting line.",
  },
};

const sections = [
  {
    title: "Legal & Financial",
    items: [
      "Business entity is set up",
      "EIN number secured",
      "Business bank account is separate",
      "Bookkeeping system in place",
      "Tracking income & expenses monthly",
      "Know my tax deadlines",
    ],
  },
  {
    title: "Operations & Systems",
    items: [
      "Daily routine is written down",
      "Tasks are tracked, not in my head",
      "Client process is documented",
      "Deadlines have reminders set",
      "I review my week every Friday",
      "I have a simple filing system",
    ],
  },
  {
    title: "Brand & Audience",
    items: [
      "I know who my audience is",
      "I post consistently",
      "My profiles look professional",
      "I engage with my audience",
      "I have a product or offer ready",
      "I know my price point",
    ],
  },
  {
    title: "Mindset & Growth",
    items: [
      "I know my vision in one sentence",
      "I've told people what I'm building",
      "I've cut out major distractions",
      "I celebrate small wins",
      "I learn from failures, not quit",
      "I show up even when unmotivated",
    ],
  },
];

export default function ChecklistPage() {
  return (
    <>
      {/* HERO + FORM */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-emerald-700/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-1/4 h-[380px] w-[380px] rounded-full bg-gold/10 blur-3xl"
        />

        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <Reveal>
              <span className="eyebrow !text-gold-300">
                Free download · No cost, no catch
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-6 text-balance text-[38px] leading-[1.06] text-white sm:text-[52px]">
                You don&rsquo;t need another idea.
                <br />
                <span className="text-gold-300">You need a foundation.</span>
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-7 max-w-xl text-[17.5px] leading-[1.75] text-white/70">
                The Starter to Builder Foundation Checklist is 24 things that
                hold a business up — the entity, the books, the routines, the
                offer, the mindset. Check off what you have. Circle what
                you&rsquo;re missing.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <p className="mt-5 max-w-xl text-[16px] leading-[1.75] text-white/55">
                Most people find the same thing: it isn&rsquo;t the big
                expensive pieces that are missing. It&rsquo;s the small
                structural ones nobody told them to handle.
              </p>
            </Reveal>
            <Reveal delay={270}>
              <div className="mt-9 flex items-center gap-5 border-t border-white/12 pt-8">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/images/lashanda-headshot-polo.jpg"
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <p className="text-[14.5px] leading-snug text-white/60">
                  Built by <strong className="text-white">Lashanda Carter</strong>
                  , founder of Carter Cole &amp; Associates — after starting six
                  businesses and learning this the expensive way.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div id="get" className="scroll-mt-28">
              <ChecklistOptIn variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S ON IT */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What's on it"
            title="Four sections. Twenty-four boxes. One honest score."
            intro="Almost nobody is missing all four sections. Most people are strong in two and quietly avoiding the other two — and that's exactly where the next real gain is."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="card h-full">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    {s.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-snug text-navy/70"
                      >
                        <span
                          aria-hidden
                          className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 border-gold/60"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-navy/10 bg-cream p-7 text-center">
              <p className="display text-[22px] text-navy">
                Your score: ____ / 24
              </p>
              <p className="mt-2 text-[15px] text-navy/60">
                The unchecked ones? That&rsquo;s your to-do list — finally
                written down in one place.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECOND CHANCE OPT-IN */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Get your copy"
              title="Send it to me"
              intro="Enter your name and email and the checklist opens immediately — a copy lands in your inbox too, so you can find it again in six months when you need it."
            />
            <Reveal delay={120}>
              <p className="mt-8 text-[15px] leading-relaxed text-navy/55">
                After that you&rsquo;ll get a short series of emails about
                building the foundation — the same things I tell clients on the
                phone. If they&rsquo;re not useful, one click removes you and
                the checklist is still yours.
              </p>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <ChecklistOptIn />
          </Reveal>
        </div>
      </section>

      {/* WORKBOOK TEASE */}
      <section className="bg-navy py-20 text-white sm:py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="relative mx-auto aspect-[8.5/11] w-full max-w-[320px] overflow-hidden rounded-xl border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
              <Image
                src="/images/workbook-cover.png"
                alt="From Starter to Builder workbook cover"
                fill
                sizes="(max-width: 1024px) 70vw, 320px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow !text-gold-300">After the checklist</span>
            <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[38px]">
              The checklist shows the gaps. The workbook closes them.
            </h2>
            <p className="mt-6 max-w-xl text-[16.5px] leading-[1.8] text-white/70">
              From Starter to Builder is a 30-day workbook — one focus per day,
              pages you actually write on. It&rsquo;s $17, priced deliberately
              low because the people who most need a foundation are usually
              watching every dollar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/workbook" className="btn-gold">
                See the workbook — $17
              </Link>
              <a href={site.phoneHref} className="btn-ghost-light">
                Or talk to us: {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
