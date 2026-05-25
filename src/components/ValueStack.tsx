import Button from "@/components/ui/Button";
import type { CoursePageData } from "@/lib/courses/types";

type ValueStackProps = { data: CoursePageData };

export default function ValueStack({ data }: ValueStackProps) {
  const { course, ctas, valueStack, checkoutPath } = data;
  const totalValue = valueStack.reduce((sum, item) => sum + item.value, 0);

  return (
    <section id="offer" className="py-20 lg:py-28 bg-gray-light scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2">
            The Complete Offer
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Here&apos;s Everything You Get Today
          </h2>
          <p className="text-gray-muted leading-relaxed">
            If you bought these separately, you&apos;d pay {course.currency}{" "}
            {totalValue.toLocaleString()}+. You get the full stack for one payment.
          </p>
        </div>

        <article className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden mb-8">
          <ul className="divide-y divide-black/5">
            {valueStack.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-4 p-5">
                <span className="flex items-center gap-3 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-purple/10 text-purple flex items-center justify-center text-xs font-bold shrink-0">
                    ✔
                  </span>
                  {item.name}
                </span>
                <span className="text-gray-muted text-sm font-medium shrink-0 line-through">
                  {course.currency} {item.value.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <div className="bg-black text-white p-6 space-y-2">
            <div className="flex justify-between text-white/60">
              <span>Total Value</span>
              <span className="line-through">
                {course.currency} {totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Your Price Today</span>
              <span className="text-3xl font-bold text-gold">
                {course.currency} {course.price}
              </span>
            </div>
            <p className="text-gold/80 text-sm pt-1">
              You save {course.currency} {(totalValue - course.price).toLocaleString()} (
              {Math.round(((totalValue - course.price) / totalValue) * 100)}% off)
            </p>
          </div>
        </article>

        <Button href={checkoutPath} size="lg" className="w-full">
          {ctas.primary} →
        </Button>
        <p className="text-center text-gray-muted text-sm mt-4">
          {course.guaranteeDays}-day money-back guarantee · Instant access · No subscription
        </p>
      </div>
    </section>
  );
}