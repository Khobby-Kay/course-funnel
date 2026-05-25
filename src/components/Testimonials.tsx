"use client";

import { useState } from "react";
import type { CoursePageData } from "@/lib/courses/types";

type TestimonialsProps = { data: CoursePageData };

export default function Testimonials({ data }: TestimonialsProps) {
  const { testimonials } = data;
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2">Proof</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Real Students. Real Results.
          </h2>
          <p className="text-gray-muted leading-relaxed">
            Not vanity metrics — actual income and clients from people who started where you are.
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>

        <div className="md:hidden" role="region" aria-label="Student testimonials">
          <TestimonialCard {...testimonials[active]} />
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  active === index ? "bg-purple" : "bg-black/20"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  text,
  name,
  location,
  avatar,
  result,
}: {
  text: string;
  name: string;
  location: string;
  avatar: string;
  result: string;
}) {
  return (
    <article className="rounded-2xl p-6 bg-gray-light border border-black/5 flex flex-col h-full">
      <span className="inline-block self-start px-3 py-1 rounded-full bg-gold/20 text-black text-xs font-bold mb-4">
        {result}
      </span>
      <div className="text-gold text-lg mb-3" aria-hidden>
        ★★★★★
      </div>
      <p className="text-gray-muted leading-relaxed flex-1 mb-6">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-purple text-white flex items-center justify-center font-bold">
          {avatar}
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-muted">{location}</p>
        </div>
      </div>
    </article>
  );
}