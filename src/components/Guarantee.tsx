import type { CoursePageData } from "@/lib/courses/types";

type GuaranteeProps = { data: CoursePageData };

export default function Guarantee({ data }: GuaranteeProps) {
  const { guarantee } = data;
  return (
    <section className="py-16 bg-purple/5 border-y border-purple/10">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block text-4xl mb-4" aria-hidden>
          🛡️
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">{guarantee.headline}</h2>
        <p className="text-gray-muted leading-relaxed">{guarantee.body}</p>
      </article>
    </section>
  );
}