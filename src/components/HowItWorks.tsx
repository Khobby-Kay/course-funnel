import type { CoursePageData } from "@/lib/courses/types";

type HowItWorksProps = { data: CoursePageData };

export default function HowItWorks({ data }: HowItWorksProps) {
  const { howItWorks } = data;
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            3 Steps. No Confusion.
          </h2>
          <p className="text-gray-muted leading-relaxed">
            You don&apos;t need to figure anything out. Just enroll, follow the roadmap, and execute.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-8 list-none">
          {howItWorks.map((item, index) => (
            <li key={item.step} className="relative">
              {index < howItWorks.length - 1 && (
                <span
                  className="hidden md:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-purple/20"
                  aria-hidden
                />
              )}
              <article className="text-center p-6 rounded-2xl bg-gray-light border border-black/5 h-full">
                <span className="inline-flex w-14 h-14 rounded-2xl bg-purple text-white text-xl font-bold items-center justify-center mb-5">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-muted text-sm leading-relaxed">{item.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}