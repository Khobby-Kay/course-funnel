import Button from "@/components/ui/Button";
import CourseCoverImage from "@/components/CourseCoverImage";
import CheckMark from "@/components/ui/CheckMark";
import type { CoursePageData } from "@/lib/courses/types";

type HeroProps = { data: CoursePageData };

export default function Hero({ data }: HeroProps) {
  const { course, heroOutcomes, ctas, checkoutPath, media } = data;

  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-x-hidden pt-20 pb-24 lg:pb-16">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple/30 to-black" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple/20 rounded-full blur-3xl animate-pulse-glow" aria-hidden />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple/10 rounded-full" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/10 rounded-full" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold">
            {course.discount}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
            {course.headline}
          </h1>

          <p className="text-lg text-white/70 max-w-xl leading-relaxed">{course.subheadline}</p>

          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              {course.lessons} lessons
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              {course.duration} roadmap
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold font-medium">
              Worth {course.currency} {course.totalValue.toLocaleString()}+
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button href={checkoutPath} size="lg">
              {ctas.primary} →
            </Button>
            <Button href="#preview" variant="secondary" size="lg">
              {ctas.secondary}
            </Button>
          </div>

          <p className="text-white/50 text-sm">
            {course.roiStatement}. {course.guaranteeDays}-day guarantee included.
          </p>

          <div className="flex items-center gap-4 pt-1 flex-wrap">
            <div className="flex text-gold text-lg tracking-widest" aria-hidden>
              ★★★★★
            </div>
            <span className="text-white font-semibold">
              {course.rating} from {course.students} students
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple/30 border border-white/10 aspect-[4/3] bg-gradient-to-br from-purple/40 to-black">
            <CourseCoverImage
              title={course.headline}
              coverUrl={media?.coverImage}
              badge={data.badge}
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white font-semibold text-lg">From Zero → First Client</p>
              <p className="text-white/60 text-sm mt-1">The {course.duration.toLowerCase()} execution system</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 lg:-left-10 bg-white rounded-2xl p-5 shadow-xl max-w-xs animate-float border border-gold/20">
            <p className="text-xs font-bold text-purple uppercase tracking-wider mb-3">
              You walk away with
            </p>
            <ul className="space-y-2.5">
              {heroOutcomes.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-black">
                  <CheckMark className="w-5 h-5 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
