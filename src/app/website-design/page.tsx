import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/Section";
import Accordion, { type FaqItem } from "@/components/Accordion";
import WebsitePackages from "@/components/WebsitePackages";
import CTA from "@/components/CTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Design & Development",
  description:
    "Website design and development for Detroit small businesses. Three fixed-price packages from $150 — responsive design, SEO setup, lead capture and e-commerce builds from Carter Cole & Associates.",
  alternates: { canonical: "/website-design" },
};

const steps = [
  {
    n: "01",
    title: "Tell us what the site has to do",
    body: "A short call or a filled-in form. We want to know who you are selling to, what you want them to do when they land, and what you already have — logo, photos, copy, an old site worth keeping anything from.",
  },
  {
    n: "02",
    title: "Pick the package that fits",
    body: "Most businesses need the Standard build. If you only need to exist and be findable, Starter does that properly. If you are taking bookings or payments, that is Premium.",
  },
  {
    n: "03",
    title: "We design and build it",
    body: "You see it before anyone else does, on a private preview link. Your revision rounds happen here, against the real thing rather than a description of it.",
  },
  {
    n: "04",
    title: "It goes live in your name",
    body: "Your domain, your hosting account, your site. We connect it, check it on real phones, and hand over a walkthrough so you are not dependent on us to change a phone number.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Do I need to buy a domain and hosting separately?",
    a: "Yes. Clients are responsible for purchasing and providing their own domain name and hosting or platform subscriptions. We will assist with connecting domain settings upon request. We ask you to buy these in your own name on purpose — it means the site, the address and the account are yours outright, and you are never locked in to anybody.",
  },
  {
    q: "What counts as a revision?",
    a: "Revisions cover layout, copy adjustments, and styling within the agreed initial project scope. Major scope additions outside the chosen tier will be quoted separately — adding a booking system to a Starter build, for instance, or going from six pages to twelve. We will always tell you before anything becomes a separate quote, never after.",
  },
  {
    q: "How long does it take, and when does the clock start?",
    a: "Project timelines begin once all required client branding, logos, copy, and access details are provided. Starter builds typically take a few days from that point, Standard around a week, and Premium longer depending on the functionality involved. The most common cause of a slow project is waiting on content, which is why we ask for it up front.",
  },
  {
    q: "What if I do not have copy or photos yet?",
    a: "That is normal and it is not a problem. Tell us at the start and we will build with clearly marked placeholders so you can see the shape of the thing, then drop your real content in. What we will not do is invent facts about your business and quietly publish them.",
  },
  {
    q: "Who owns the finished website?",
    a: "You do. There is no monthly fee to us, no proprietary platform you have to keep renting, and no part of the site we hold back. If you later want somebody else to work on it, they can.",
  },
  {
    q: "Can you work on a site I already have?",
    a: "Often, yes — it depends what it was built on. Send us the address through the form below and we will tell you honestly whether it is worth rebuilding or improving, including when the honest answer is that you do not need us.",
  },
];

export default function WebsiteDesignPage() {
  return (
    <>
      <PageHero
        eyebrow="Website design & development"
        title="Your business deserves a website people trust"
        intro="Most small businesses lose work before the first conversation, because the website either does not exist or does not look like somewhere you would hand over your card details. Three fixed-price packages, built properly, owned by you."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#packages" className="btn-gold">
            See the packages
          </Link>
          <a href={site.phoneHref} className="btn-ghost-light">
            Call {site.phone}
          </a>
        </div>
      </PageHero>

      <div id="packages" className="scroll-mt-24 bg-cream">
        <WebsitePackages />
      </div>

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, and you know where you stand at each one"
            intro="No long discovery phase, no jargon, and no invoice that arrives bigger than the number you agreed."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="card-hover h-full">
                  <span className="display text-[34px] leading-none text-gold">
                    {s.n}
                  </span>
                  <h3 className="display mt-4 text-[22px] leading-tight">
                    {s.title}
                  </h3>
                  <p className="prose-body mt-3 text-[15.5px]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Before you book"
            title="The things worth knowing in advance"
            intro="Written down here rather than discovered halfway through. If anything below is unclear, ask us before you pay."
          />
          <Reveal delay={120}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTA
        title="Tell us what you need the site to do"
        intro="Send us a few lines about your business and which package looks closest. We will come back within two business days with a straight answer — including if we think you need less than you asked for."
      />
    </>
  );
}
