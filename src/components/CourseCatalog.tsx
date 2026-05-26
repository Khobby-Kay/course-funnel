import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  courseCheckoutPath,
  courseLandingPath,
} from "@/lib/courses";
import { getPublishedCourses } from "@/lib/courses/server";

const TRUST_STATS = [
  { value: "1,400+", label: "Students enrolled", icon: "👥" },
  { value: "4.8★", label: "Average rating", icon: "⭐" },
  { value: "30 days", label: "Money-back guarantee", icon: "🛡️" },
  { value: "Lifetime", label: "Course access", icon: "∞" },
] as const;

const WHY_US = [
  {
    icon: "🎯",
    title: "Built to Get You Paid",
    description:
      "Every program focuses on income — not theory. Templates, scripts, and action steps you use with real clients.",
    accent: "border-gold/30 bg-gold/5",
  },
  {
    icon: "🌍",
    title: "Made for African Markets",
    description:
      "Pricing, outreach, and examples tuned for Ghana & West Africa — MoMo, WhatsApp, and local businesses.",
    accent: "border-purple/30 bg-purple/5",
  },
  {
    icon: "⚡",
    title: "Start This Week",
    description:
      "Clear 14-day roadmaps. No fluff. Enroll today, apply tomorrow, and build proof fast.",
    accent: "border-white/20 bg-white/5",
  },
] as const;

const PAYMENT_BADGES = ["Mobile Money", "Bank Transfer", "Card", "Visa / Mastercard"];

export default async function CourseCatalog() {
  const courses = await getPublishedCourses();

  return (
    <>
      {/* Hero — black + purple = authority & premium; gold = action */}
      <header className="relative overflow-hidden bg-black text-white pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple/40 to-black" />
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-purple/25 rounded-full blur-3xl animate-pulse-glow"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl animate-pulse-glow"
          aria-hidden
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-purple/10 rounded-full pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden />
                Enrolling now · Limited launch pricing
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold mb-6 leading-[1.08] tracking-tight">
                Skills That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-hover">
                  Pay You Back
                </span>
              </h1>

              <p className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Professional online programs for Africans ready to earn — with step-by-step systems,
                done-for-you templates, and lifetime access from one payment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button href="#courses" size="lg">
                  Explore Programs →
                </Button>
                <Button href="#why-us" variant="secondary" size="lg">
                  Why Students Trust Us
                </Button>
              </div>

              <p className="text-white/40 text-sm flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1">
                <span>🔒 Secure checkout</span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span>Instant access after payment</span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span>30-day guarantee</span>
              </p>
            </div>

            {/* Social proof card — white on dark = clarity & trust */}
            <aside className="hidden lg:block">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl shadow-purple/20">
                <p className="text-gold text-xs font-bold uppercase tracking-widest mb-6">
                  Trusted by learners across Ghana
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {TRUST_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-black/40 border border-white/10 p-4 text-center"
                    >
                      <span className="text-2xl mb-2 block" aria-hidden>
                        {stat.icon}
                      </span>
                      <p className="text-2xl font-bold text-gold">{stat.value}</p>
                      <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <blockquote className="border-l-2 border-gold pl-4 text-white/80 text-sm italic leading-relaxed">
                  &ldquo;I paid once, got instant access, and had a clear plan from Day 1. No confusion —
                  just execution.&rdquo;
                </blockquote>
                <p className="text-white/40 text-xs mt-3">— Verified student, Accra</p>
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* Trust strip — light bg = honesty, openness */}
      <section className="bg-white border-y border-black/5 py-6" aria-label="Trust indicators">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
            {PAYMENT_BADGES.map((badge) => (
              <span
                key={badge}
                className="text-sm font-medium text-gray-muted flex items-center gap-2"
              >
                <span className="text-purple" aria-hidden>
                  ✔
                </span>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile stats */}
      <section className="lg:hidden bg-purple/5 border-b border-purple/10 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-4">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white border border-black/5 p-4 text-center shadow-sm"
            >
              <p className="text-xl font-bold text-purple">{stat.value}</p>
              <p className="text-gray-muted text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section id="courses" className="py-20 lg:py-28 bg-gray-light scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-purple font-bold uppercase tracking-wider text-sm mb-3">
              Our Programs
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              Choose Your Path to Income
            </h2>
            <p className="text-gray-muted leading-relaxed">
              Each program is a complete business-in-a-box — training, templates, and a clear
              roadmap. Pick one and start this week.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {courses.map((item, index) => {
              const meta = item.marketing.course;
              const { catalog } = item;
              const landing = courseLandingPath(item.slug);
              const savings = meta.oldPrice - meta.price;
              const isFeatured = index === 0;

              return (
                <article
                  key={item.slug}
                  className={`group rounded-3xl bg-white overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? "ring-2 ring-gold/50 shadow-xl shadow-gold/10"
                      : "border border-black/5 shadow-md hover:shadow-xl hover:shadow-purple/10"
                  }`}
                >
                  <div className="relative bg-gradient-to-br from-purple via-purple-light/80 to-black text-white overflow-hidden min-h-[200px]">
                    {item.media?.screenshots?.[0] && (
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.media.screenshots[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="relative p-8">
                    {isFeatured && (
                      <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gold text-black text-xs font-bold uppercase tracking-wide">
                        Most Popular
                      </span>
                    )}
                    <div
                      className="absolute -bottom-8 -right-8 w-40 h-40 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-colors"
                      aria-hidden
                    />
                    <span className="text-5xl mb-4 block relative" aria-hidden>
                      {catalog.emoji}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 relative">{meta.title}</h3>
                    <p className="text-gold font-semibold text-sm mb-3 relative">{catalog.tagline}</p>
                    <p className="text-white/75 text-sm leading-relaxed relative max-w-md">
                      {catalog.description}
                    </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <ul className="space-y-3 mb-6 flex-1">
                      {catalog.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-3 text-sm text-gray-muted"
                        >
                          <span
                            className="w-5 h-5 rounded-full bg-purple/10 text-purple flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                            aria-hidden
                          >
                            ✔
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-2xl bg-gray-light border border-black/5 p-5 mb-6">
                      <div className="flex flex-wrap items-end gap-2 mb-1">
                        <span className="text-3xl sm:text-4xl font-bold text-black">
                          {meta.currency} {meta.price}
                        </span>
                        <span className="text-gray-muted line-through text-sm pb-1">
                          {meta.currency} {meta.oldPrice}
                        </span>
                      </div>
                      <p className="text-green-700 text-sm font-semibold mb-2">
                        Save {meta.currency} {savings} today
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-muted">
                        <span className="flex items-center gap-1">
                          <span className="text-gold">★</span> {meta.rating}
                        </span>
                        <span>·</span>
                        <span>{meta.students} students</span>
                        <span>·</span>
                        <span>{meta.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button href={landing} size="md" className="flex-1">
                        View Full Program →
                      </Button>
                      <Button
                        href={courseCheckoutPath(item.slug)}
                        variant={isFeatured ? "primary" : "outline"}
                        size="md"
                        className="flex-1"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us — purple accents = wisdom, premium education */}
      <section id="why-us" className="py-20 lg:py-28 bg-black text-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-gold font-bold uppercase tracking-wider text-sm mb-3">Why Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built Like a Business, Not a Hobby Course
            </h2>
            <p className="text-white/60 leading-relaxed">
              Real systems, real templates, and support when you need it — designed so you feel
              confident before you pay and focused after you enroll.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {WHY_US.map((item) => (
              <article
                key={item.title}
                className={`rounded-2xl border p-8 ${item.accent} hover:border-gold/40 transition-colors`}
              >
                <span className="text-4xl mb-4 block" aria-hidden>
                  {item.icon}
                </span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee band — gold = safety & value */}
      <section className="py-16 bg-gradient-to-r from-purple/20 via-gold/10 to-purple/20 border-y border-gold/20">
        <article className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-4xl mb-4 block" aria-hidden>
            🛡️
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black">
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-gray-muted leading-relaxed mb-6">
            Try any program risk-free. Go through the material, use the templates — if it&apos;s not
            worth every cedi, email us for a full refund. We only win when you win.
          </p>
          <Button href="#courses" size="lg">
            Choose Your Program →
          </Button>
        </article>
      </section>

      {/* Marketer note — subtle, professional */}
      <section className="py-14 bg-gray-light border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-purple/10 p-8 lg:p-10 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-purple font-bold uppercase tracking-wider text-xs mb-2">
                  For marketers & ads
                </p>
                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  Direct links for higher conversion
                </h2>
                <p className="text-gray-muted text-sm leading-relaxed">
                  Send ad traffic straight to a program&apos;s dedicated page — visitors see one offer,
                  one price, one checkout. No distractions.
                </p>
              </div>
              <ul className="space-y-3">
                {courses.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={courseLandingPath(item.slug)}
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 rounded-xl bg-gray-light hover:bg-purple/5 border border-transparent hover:border-purple/20 transition-colors group"
                    >
                      <span className="text-sm font-semibold text-black group-hover:text-purple shrink-0">
                        {item.marketing.course.title}
                      </span>
                      <span className="text-xs font-mono text-gray-muted truncate">
                        /courses/{item.slug}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — dark + gold button = urgency & premium close */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple/30 to-transparent pointer-events-none" aria-hidden />
        <article className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Next Client Is One Skill Away
          </h2>
          <p className="text-white/65 text-lg mb-8 leading-relaxed">
            Stop scrolling for free answers. Invest in a system, get templates, and start executing —
            today.
          </p>
          <Button href="#courses" size="lg">
            See All Programs →
          </Button>
          <p className="text-white/35 text-sm mt-6">
            Questions?{" "}
            <Link href="/contact" className="text-gold hover:underline font-medium">
              Talk to our team
            </Link>
          </p>
        </article>
      </section>
    </>
  );
}
