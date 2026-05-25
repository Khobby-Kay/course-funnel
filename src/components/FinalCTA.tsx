import Button from "@/components/ui/Button";
import type { CoursePageData } from "@/lib/courses/types";

type FinalCTAProps = { data: CoursePageData };

export default function FinalCTA({ data }: FinalCTAProps) {
  const { course, ctas, checkoutPath } = data;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-black via-purple/40 to-black relative overflow-hidden">
      <span className="absolute top-10 right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" aria-hidden />
      <span className="absolute bottom-10 left-10 w-64 h-64 bg-purple/20 rounded-full blur-3xl" aria-hidden />

      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          In {course.duration.toLowerCase()} you&apos;ll wish you started today.
        </h2>
        <p className="text-white/70 text-lg mb-2 max-w-2xl mx-auto">
          {course.students} students already made the decision. The system works — if you work it.
        </p>
        <p className="text-gold font-semibold mb-8">
          {course.currency} {course.price} · {course.guaranteeDays}-day guarantee · Instant access
        </p>
        <Button href={checkoutPath} size="lg">
          {ctas.final} →
        </Button>
        <p className="text-white/40 text-sm mt-4">No subscription. No upsells to finish. Own it forever.</p>
      </article>
    </section>
  );
}
