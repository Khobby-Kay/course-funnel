import type { CoursePageData } from "@/lib/courses/types";

type CourseModulesProps = { data: CoursePageData };

export default function CourseModules({ data }: CourseModulesProps) {
  const { modules, course } = data;
  return (
    <section id="modules" className="py-20 lg:py-28 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2">The Mechanism</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            The 5-Module Roadmap to Your First Client
          </h2>
          <p className="text-gray-muted leading-relaxed">
            Each module has one job: move you closer to money. No filler. No theory for theory&apos;s sake.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module) => (
            <article
              key={module.number}
              className="rounded-2xl p-6 bg-gray-light border border-black/5 hover:border-purple/30 hover:shadow-lg transition-all group"
            >
              <span className="inline-flex w-10 h-10 rounded-xl bg-purple/10 text-purple font-bold items-center justify-center mb-4">
                {module.number}
              </span>
              <span className="text-xs font-bold text-purple uppercase tracking-wider">
                Module {module.number}
              </span>
              <h3 className="text-xl font-bold mt-2 mb-2 group-hover:text-purple transition-colors">
                {module.title}
              </h3>
              <p className="text-gray-muted text-sm leading-relaxed mb-4">{module.description}</p>
              <p className="text-xs font-semibold text-purple bg-purple/10 rounded-lg px-3 py-2">
                Outcome: {module.outcome}
              </p>
            </article>
          ))}

          <article className="rounded-2xl p-6 bg-purple text-white flex flex-col justify-center sm:col-span-2 lg:col-span-1">
            <p className="text-gold font-bold text-sm uppercase tracking-wider mb-2">The Rule</p>
            <p className="text-lg font-semibold leading-relaxed">
              Don&apos;t binge. Execute one module, apply it, then move on. Speed comes from clarity, not
              rushing.
            </p>
          </article>
        </div>

        <div className="rounded-2xl bg-black text-white p-6 sm:p-8 grid sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <p className="text-white/60 text-sm">Duration</p>
            <p className="font-bold text-lg">{course.duration}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Level</p>
            <p className="font-bold text-lg">Zero → Job-Ready</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Access</p>
            <p className="font-bold text-lg">Lifetime + Updates</p>
          </div>
        </div>
      </div>
    </section>
  );
}
