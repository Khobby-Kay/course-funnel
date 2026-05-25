"use client";

import { useState } from "react";
import type { CoursePageData } from "@/lib/courses/types";

type FAQProps = { data: CoursePageData };

export default function FAQ({ data }: FAQProps) {
  const { faqItems } = data;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-gray-light scroll-mt-24">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2">
            Before You Buy
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            Questions? Good. Here Are the Answers.
          </h2>
          <p className="text-gray-muted text-center mb-0">
            Smart buyers ask smart questions. We respect that.
          </p>
        </div>

        <ul className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <li key={item.question} className="rounded-2xl bg-white border border-black/5 overflow-hidden">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full text-left flex items-center justify-between p-5 font-semibold hover:bg-gray-light/50 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    {item.question}
                    <span className="text-purple text-xl ml-4 shrink-0" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-5 text-gray-muted leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}