import type { CoursePageData } from "@/lib/courses/types";

const ICONS = ["🌱", "🎓", "🚀", "💼", "💻", "🎨"];

type WhoIsThisForProps = { data: CoursePageData };

export default function WhoIsThisFor({ data }: WhoIsThisForProps) {
  const { audience } = data;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            This Is For You If…
          </h2>
          <p className="text-gray-muted leading-relaxed">
            And if you&apos;re willing to follow a system for 14 days — not just watch videos and hope.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {audience.map((item, index) => (
            <article
              key={item.label}
              className="rounded-2xl border border-black/5 bg-gray-light p-6 hover:border-purple/30 transition-colors"
            >
              <span className="text-3xl mb-3 block" aria-hidden>
                {ICONS[index % ICONS.length]}
              </span>
              <h3 className="font-bold text-lg mb-1">{item.label}</h3>
              <p className="text-gray-muted text-sm">{item.hook}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
