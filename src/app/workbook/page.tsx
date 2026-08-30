import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/Section";
import Accordion, { type FaqItem } from "@/components/Accordion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "From Starter to Builder — 30-Day Workbook",
  description:
    "A 30-day workbook by Lashanda Carter for people who keep starting over. Stop collecting goals and build the foundation. $17.",
  alternates: { canonical: "/workbook" },
  openGraph: {
    title: "From Starter to Builder — the 30-day workbook",
    description:
      "You don't need another idea. You need a foundation. 49 pages, $17.",
    images: [{ url: "/images/workbook-cover.png" }],
  },
};

/**
 * Checkout is not wired yet. Put your Stripe Payment Link, Gumroad URL, or
 * other checkout here and every button on this page goes live at once.
 * Leave it empty and the buttons become a clearly-labelled waitlist prompt
 * rather than a dead link.
 */
const CHECKOUT_URL = "";

const parts = [
  {
    n: "01",
    title: "The Starter's Assessment",
    body: "Before you build, you have to know where you're starting from. An honest read on what you actually have — not what you meant to set up.",
  },
  {
    n: "02",
    title: "The Builder's Blueprint",
    body: "What are you really building? Business, side hustle or movement — and what does freedom look like for you specifically, ranked in your own order.",
  },
  {
    n: "03",
    title: "The Foundation",
    body: "Systems, not goals. The difference between 'get my bookkeeping in order' and a routine that survives a bad week.",
  },
  {
    n: "04",
    title: "30 Days of Building",
    body: "One focus per day. Small enough that you'll actually do it, sequenced so each day builds on the last.",
  },
  {
    n: "05",
    title: "From Starter to Builder",
    body: "The mindset shift that makes the rest stick — and what to do when the motivation runs out, because it will.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "What exactly do I get?",
    a: "A 49-page PDF workbook you can print or fill in on screen. Five parts, 30 days of prompts, assessments, trackers and writing space. It's yours permanently — no subscription, no expiry.",
  },
  {
    q: "Is this a course or a book?",
    a: "Neither. It's a workbook, which means you write in it. There are no videos to fall behind on and no login to forget. The work happens on the page.",
  },
  {
    q: "Do I have to finish it in 30 days?",
    a: "No. It's structured as 30 days but it isn't a race — go faster or slower as your life allows. The one thing worth not skipping is the writing parts, because that's where the actual thinking happens.",
  },
  {
    q: "I haven't started a business yet. Is it still for me?",
    a: "Yes, and arguably it's better before you start. Most of what the workbook covers is cheaper to set up correctly than to fix later — the entity, the separate account, the routines.",
  },
  {
    q: "I've been in business for years. Will it be too basic?",
    a: "It depends what you've been avoiding. Plenty of established owners are strong on revenue and weak on systems, and this is aimed squarely at that gap. Run the free checklist first — if you score 20+ out of 24, you probably don't need the workbook.",
  },
  {
    q: "Why only $17?",
    a: "Deliberate. The people who most need a foundation are usually the ones watching every dollar. I wanted it to cost less than the thing you'd otherwise buy without thinking about it.",
  },
];

function CheckoutButton({
  className = "btn-gold",
  label = "Get the workbook — $17",
}: {
  className?: string;
  label?: string;
}) {
  if (!CHECKOUT_URL) {
    return (
      <Link href="/checklist#get" className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}

export default function WorkbookPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-emerald-700/25 blur-3xl"
        />
        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Reveal>
              <span className="eyebrow !text-gold-300">
                The 30-day workbook
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-6 text-balance text-[38px] leading-[1.06] text-white sm:text-[52px]">
                From Starter
                <br />
                <span className="text-gold-300">to Builder</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 text-[17px] leading-[1.7] text-white/75">
                30 days to stop starting over and start building with intention.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-[16.5px] leading-[1.8] text-white/65">
                I&rsquo;ve always been a starter. Give me an idea and I&rsquo;ll
                run with it — find the clients, bring in the revenue, make it
                work. I&rsquo;ve done it six times. Starting was never my
                problem. Building the foundation was.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CheckoutButton />
                <span className="text-[14px] text-white/45">
                  49 pages · instant download · yours to keep
                </span>
              </div>
            </Reveal>
            <Reveal delay={310}>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-7 text-[13.5px] text-white/55">
                <span>✓ Print it or fill it in on screen</span>
                <span>✓ No subscription</span>
                <span>✓ No login to forget</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="relative mx-auto aspect-[8.5/11] w-full max-w-[380px]">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[20px] border border-gold/25"
              />
              <div className="relative h-full w-full overflow-hidden rounded-[14px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)]">
                <Image
                  src="/images/workbook-cover.png"
                  alt="From Starter to Builder workbook cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 380px"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Who this is for"
            title="If you keep starting and never quite building"
            intro="This isn't for people who need motivation. It's for people who have plenty of drive and no structure underneath it."
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "You've started more than once",
                b: "Ideas aren't your problem. Following through past the exciting part is where it keeps stalling.",
              },
              {
                t: "The money goes out faster than it comes in",
                b: "You're bringing in revenue and somehow still paying everyone but yourself.",
              },
              {
                t: "It all lives in your head",
                b: "No written routine, no documented process, no filing system. Which works until the week you're sick.",
              },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 80}>
                <div className="card h-full">
                  <div className="rule-gold" />
                  <h3 className="display mt-5 text-[21px] leading-tight">
                    {x.t}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-navy/60">
                    {x.b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={280}>
            <blockquote className="mx-auto mt-14 max-w-2xl border-l-2 border-gold pl-7">
              <p className="display text-[24px] leading-[1.45] text-navy sm:text-[27px]">
                &ldquo;And when you&rsquo;re worn out and not seeing the return,
                you give up. Not because it couldn&rsquo;t work — but because
                you couldn&rsquo;t see how to make it work for you.&rdquo;
              </p>
              <footer className="mt-4 text-[14px] text-navy/50">
                — Lashanda Carter
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Inside the workbook"
            title="Five parts, thirty days"
            align="center"
          />
          <div className="mx-auto mt-14 max-w-3xl space-y-4">
            {parts.map((p, i) => (
              <Reveal key={p.n} delay={i * 60}>
                <div className="flex gap-6 rounded-2xl border border-navy/10 bg-white p-7">
                  <span className="display shrink-0 text-[34px] leading-none text-gold">
                    {p.n}
                  </span>
                  <div>
                    <h3 className="display text-[22px] leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.7] text-navy/60">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={380}>
            <div className="mt-12 text-center">
              <CheckoutButton className="btn-primary" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRICE */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border-2 border-gold/40 bg-white p-10 text-center sm:p-14">
              <span className="eyebrow justify-center">One-time</span>
              <div className="mt-6 flex items-start justify-center gap-1">
                <span className="display mt-2 text-[28px] text-navy">$</span>
                <span className="display text-[76px] leading-none text-navy">
                  17
                </span>
              </div>
              <p className="mt-4 text-[16px] text-navy/60">
                49-page PDF workbook · instant download · yours permanently
              </p>
              <div className="mt-8">
                <CheckoutButton className="btn-gold w-full sm:w-auto" />
              </div>
              {!CHECKOUT_URL && (
                <p className="mt-5 text-[13px] leading-relaxed text-navy/45">
                  Checkout is being set up. Grab the free checklist and
                  you&rsquo;ll be first to know the moment it opens.
                </p>
              )}
              <div className="mt-8 border-t border-navy/10 pt-6 text-left">
                <p className="text-[14.5px] leading-relaxed text-navy/60">
                  <strong className="text-navy">Not sure yet?</strong> Start
                  with the{" "}
                  <Link
                    href="/checklist"
                    className="font-semibold text-emerald-700 underline decoration-gold underline-offset-4"
                  >
                    free Foundation Checklist
                  </Link>
                  . If you score 20 or more out of 24, you probably don&rsquo;t
                  need this workbook — and I&rsquo;d rather tell you that than
                  take your $17.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AUTHOR */}
      <section className="bg-navy py-20 text-white sm:py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-[20px]">
              <Image
                src="/images/lashanda-desk-writing.jpg"
                alt="Lashanda Carter at her desk"
                fill
                sizes="(max-width: 1024px) 80vw, 380px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow !text-gold-300">Who wrote it</span>
            <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[36px]">
              I spent years being the starter
            </h2>
            <div className="mt-6 space-y-5 text-[16.5px] leading-[1.8] text-white/70">
              <p>
                I hired people. Paid them well. But without systems, the money
                went out faster than it came in. I was paying everyone but
                myself.
              </p>
              <p>
                Now I&rsquo;m learning to be the builder — and Carter Cole &amp;
                Associates exists so other people don&rsquo;t have to learn it
                the way I did, one expensive mistake at a time.
              </p>
              <p className="text-white/50">
                Lashanda Carter is the founder of Carter Cole &amp; Associates
                and its tax division, SmartTaxIQ. She has been starting and
                growing businesses since {site.founded}.
              </p>
            </div>
            <Link href="/about" className="btn-ghost-light mt-8">
              More about Lashanda
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Questions"
              title="Before you buy"
              intro="Anything else, call us — a real person answers."
            />
          </div>
          <Reveal delay={100}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="display mx-auto max-w-2xl text-[30px] leading-tight sm:text-[38px]">
              Thirty days from now will arrive either way
            </h2>
            <p className="prose-body mx-auto mt-5 max-w-xl">
              The only question is whether you get there with a foundation under
              you or the same gaps you have today.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CheckoutButton />
              <Link href="/checklist" className="btn-ghost">
                Start with the free checklist
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
