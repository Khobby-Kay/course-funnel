import type { CoursePageData } from "@/lib/courses/types";

type Props = { data: CoursePageData };

export default function OfferSystems({ data }: Props) {
  const systems = data.offerSystems;
  if (!systems?.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-black text-white scroll-mt-24" id="playbooks">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-gold font-bold uppercase tracking-wider text-sm mb-2">
            Implementation systems
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Playbooks &amp; SOPs — not theory videos
          </h2>
          <p className="text-white/60 leading-relaxed">
            Each system is a set of copy-paste templates and checklists you use the same week you
            learn them. That is how you get paid faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {systems.map((system) => (
            <article
              key={system.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8"
            >
              <h3 className="text-xl font-bold text-gold mb-1">{system.name}</h3>
              <p className="text-white/50 text-sm mb-6">{system.tagline}</p>
              <ul className="space-y-4">
                {system.playbooks.map((playbook) => (
                  <li key={playbook.title} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
                    <p className="font-semibold text-white mb-1">{playbook.title}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{playbook.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
