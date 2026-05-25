import type { CoursePageData } from "@/lib/courses/types";

type ProblemSolutionProps = { data: CoursePageData };

export default function ProblemSolution({ data }: ProblemSolutionProps) {
  const { painAgitateSolution } = data;
  return (
    <section className="py-20 lg:py-28 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Most People Stay Stuck — And How You Won&apos;t
          </h2>
          <p className="text-gray-muted leading-relaxed">
            It&apos;s not a motivation problem. It&apos;s a system problem. Here&apos;s what changes when
            you have the right playbook.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {painAgitateSolution.map((card) => (
            <article
              key={card.title}
              className={`rounded-2xl p-8 bg-white border ${card.accent} shadow-sm hover:shadow-md transition-shadow`}
            >
              <span className="text-3xl mb-4 block" aria-hidden>
                {card.icon}
              </span>
              <h3 className="text-xl font-bold text-black mb-3">{card.title}</h3>
              <p className="text-gray-muted leading-relaxed">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}