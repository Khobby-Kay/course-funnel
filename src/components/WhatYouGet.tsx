import CheckMark from "@/components/ui/CheckMark";
import type { CoursePageData } from "@/lib/courses/types";

type Props = { data: CoursePageData };

export default function WhatYouGet({ data }: Props) {
  const items = data.whatYouGet;
  if (!items?.length) return null;

  return (
    <section className="py-16 lg:py-20 bg-white border-y border-black/5 scroll-mt-24" id="included">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2 text-center">
          What you get
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          Everything unlocked the moment you enroll
        </h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-light border border-black/5"
            >
              <CheckMark className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-center text-gray-muted text-sm mt-6">
          One payment · Lifetime access · No monthly fees
        </p>
      </div>
    </section>
  );
}
