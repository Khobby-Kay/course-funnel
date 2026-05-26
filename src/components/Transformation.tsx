import CheckMark from "@/components/ui/CheckMark";
import type { CoursePageData } from "@/lib/courses/types";

type TransformationProps = { data: CoursePageData };

export default function Transformation({ data }: TransformationProps) {
  const { transformation } = data;
  return (
    <section className="py-20 lg:py-28 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            What Changes in 14 Days
          </h2>
          <p className="text-white/60 leading-relaxed">
            Same person. Same phone. Different system. Different results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <article className="rounded-2xl p-8 border border-red-500/20 bg-red-500/5">
            <p className="text-red-400 font-bold uppercase tracking-wider text-sm mb-6">
              Before — Without a System
            </p>
            <ul className="space-y-4">
              {transformation.before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 shrink-0" aria-hidden>
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl p-8 border border-gold/30 bg-gold/5 relative overflow-hidden">
            <span className="absolute top-4 right-4 text-xs font-bold bg-gold text-black px-2 py-1 rounded">
              AFTER
            </span>
            <p className="text-gold font-bold uppercase tracking-wider text-sm mb-6">
              After — With This System
            </p>
            <ul className="space-y-4">
              {transformation.after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white">
                  <CheckMark className="w-5 h-5 shrink-0 mt-0.5 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}