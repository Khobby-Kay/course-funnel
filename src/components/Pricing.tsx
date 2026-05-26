import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/CountdownTimer";
import { ACTIVE_PAYMENT_OPTIONS } from "@/lib/constants";
import type { CoursePageData } from "@/lib/courses/types";

type PricingProps = { data: CoursePageData };

export default function Pricing({ data }: PricingProps) {
  const { course, ctas, valueStack, checkoutPath } = data;
  const totalValue = valueStack.reduce((sum, item) => sum + item.value, 0);
  const savings = totalValue - course.price;

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-black relative overflow-hidden scroll-mt-24">
      <span
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />

      <article className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-gold font-bold uppercase tracking-wider text-sm mb-2">One Decision</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get {course.currency} {totalValue.toLocaleString()} of Value for {course.currency}{" "}
            {course.price}
          </h2>
          <p className="text-white/60">
            {course.roiStatement}. Pay once, own forever. No hidden fees.
          </p>
        </div>

        <section className="grid lg:grid-cols-3 gap-8 items-start">
          <aside className="space-y-4">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold">
              {course.discount}
            </span>
            <CountdownTimer />
            <p className="text-white/50 text-sm">
              When the timer hits zero, price returns to {course.currency} {course.oldPrice}.
            </p>
          </aside>

          <article className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <p className="text-white/60 text-sm mb-1 text-center">Everything listed above</p>
            <p className="text-center text-white/40 line-through text-lg mb-1">
              {course.currency} {totalValue.toLocaleString()}
            </p>
            <p className="text-5xl font-bold text-gold mb-1 text-center">
              {course.currency} {course.price}
            </p>
            <p className="text-center text-green-400 text-sm font-medium mb-6">
              You save {course.currency} {savings.toLocaleString()}
            </p>
            <ul className="space-y-2.5">
              {valueStack.slice(0, 5).map((item) => (
                <li key={item.name} className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="text-gold" aria-hidden>
                    ✔
                  </span>
                  {item.name.split(" (")[0]}
                </li>
              ))}
              <li className="text-white/50 text-sm pl-5">+ {valueStack.length - 5} more bonuses</li>
            </ul>
          </article>

          <aside className="space-y-6">
            <Button href={checkoutPath} size="lg" className="w-full">
              {ctas.primary} →
            </Button>
            <p className="text-white/60 text-sm text-center">
              🔒 Secure checkout · Instant access · {course.guaranteeDays}-day guarantee
            </p>

            <ul className="flex flex-wrap gap-2 justify-center">
              {ACTIVE_PAYMENT_OPTIONS.map((method) => (
                <li
                  key={method.id}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium"
                >
                  {method.label}
                </li>
              ))}
            </ul>

            <div className="text-center text-white/50 text-sm border border-white/10 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-white/80">The Math Is Simple</p>
              <p>
                One freelance client at GHS 500–2,000 pays for this course many times over. The only
                question is whether you&apos;ll be the one who executes.
              </p>
            </div>
          </aside>
        </section>
      </article>
    </section>
  );
}
