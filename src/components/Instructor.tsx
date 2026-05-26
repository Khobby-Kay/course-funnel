import MediaImage from "@/components/MediaImage";
import type { CoursePageData } from "@/lib/courses/types";
import { assets } from "@/lib/site-config";

const STATS = [
  { value: "10+", label: "Years in the Game" },
  { value: "5,000+", label: "Students Trained" },
  { value: "GHS 2M+", label: "Client Revenue Generated" },
];

type InstructorProps = { data: CoursePageData };

export default function Instructor({ data }: InstructorProps) {
  const { instructor } = data;
  const photo = data.media?.instructorPhoto || assets.instructorPhoto;
  return (
    <section className="py-20 lg:py-28 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-3xl aspect-[4/5] max-w-md mx-auto overflow-hidden shadow-2xl relative bg-gradient-to-br from-purple to-black">
              <MediaImage
                src={photo}
                alt={instructor.name}
                fill
                className="object-cover"
                placeholder={
                  <div className="text-center text-white p-8 w-full h-full flex flex-col items-center justify-center">
                    <div className="w-32 h-32 mb-4 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-gold">
                      {instructor.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <p className="text-white/60 text-sm">Upload instructor photo in admin</p>
                  </div>
                }
              />
            </div>
            <div className="absolute -bottom-4 -right-4 lg:right-8 bg-gold text-black px-6 py-3 rounded-xl font-bold shadow-lg text-sm">
              Built for Africans
            </div>
          </div>

          <div>
            <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2">
              Who Built This System
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">{instructor.name}</h2>
            <p className="text-purple-light font-semibold mb-6">{instructor.title}</p>

            <blockquote className="border-l-4 border-gold pl-5 mb-6 italic text-black font-medium leading-relaxed">
              &ldquo;{instructor.quote}&rdquo;
            </blockquote>

            <p className="text-gray-muted leading-relaxed mb-8">
              Former marketing lead at top African startups. Featured at Digital Africa Summit.
              Not a guru — a practitioner who packaged what works into a system anyone can follow.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-white border border-black/5"
                >
                  <p className="text-xl sm:text-2xl font-bold text-purple">{stat.value}</p>
                  <p className="text-xs text-gray-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
