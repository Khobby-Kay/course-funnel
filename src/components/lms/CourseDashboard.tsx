"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ProtectedVideoPlayer from "@/components/lms/ProtectedVideoPlayer";
import type { CourseModule, Lesson } from "@/lib/course-content";
import type { CourseDefinition } from "@/lib/courses/types";
import { whatsappHref } from "@/lib/site-config";

type Progress = {
  completed: string[];
  lastLessonId: string | null;
};

function progressKey(reference: string) {
  return `course_progress_${reference}`;
}

function loadProgress(reference: string): Progress {
  if (typeof window === "undefined") {
    return { completed: [], lastLessonId: null };
  }
  try {
    const raw = localStorage.getItem(progressKey(reference));
    if (!raw) return { completed: [], lastLessonId: null };
    const parsed = JSON.parse(raw) as Progress;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      lastLessonId: parsed.lastLessonId ?? null,
    };
  } catch {
    return { completed: [], lastLessonId: null };
  }
}

function saveProgress(reference: string, progress: Progress) {
  localStorage.setItem(progressKey(reference), JSON.stringify(progress));
}

function getInitialProgress(ref: string): Progress {
  if (typeof window === "undefined") return { completed: [], lastLessonId: null };
  return loadProgress(ref);
}

function getAllLessons(modules: CourseModule[]): Lesson[] {
  return modules.flatMap((m) => m.lessons);
}

function getNextLesson(modules: CourseModule[], currentId: string): Lesson | null {
  const all = getAllLessons(modules);
  const index = all.findIndex((l) => l.id === currentId);
  return index >= 0 && index < all.length - 1 ? all[index + 1] : null;
}

function findActiveLesson(modules: CourseModule[], lessonId: string) {
  for (const mod of modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, module: mod };
  }
  return null;
}

function getInitialLessonId(ref: string, modules: CourseModule[]): string {
  const all = getAllLessons(modules);
  if (typeof window === "undefined") return all[0]?.id ?? "";
  const stored = loadProgress(ref);
  if (stored.lastLessonId && all.some((l) => l.id === stored.lastLessonId)) {
    return stored.lastLessonId;
  }
  return all[0]?.id ?? "";
}

type CourseDashboardProps = {
  course: CourseDefinition;
  reference: string;
};

export default function CourseDashboard({ course, reference }: CourseDashboardProps) {
  const modules = course.lms.modules;
  const bonusResources = course.lms.bonusResources;
  const courseMeta = course.marketing.course;
  const allLessons = getAllLessons(modules);
  const totalLessons = allLessons.length;

  const [progress, setProgress] = useState<Progress>(() => getInitialProgress(reference));
  const [activeLessonId, setActiveLessonId] = useState<string>(() =>
    getInitialLessonId(reference, modules)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = findActiveLesson(modules, activeLessonId);

  const completedCount = progress.completed.length;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const updateProgress = useCallback(
    (next: Progress) => {
      setProgress(next);
      saveProgress(reference, next);
    },
    [reference]
  );

  const selectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setSidebarOpen(false);
    updateProgress({ ...progress, lastLessonId: lessonId });
  };

  const toggleComplete = () => {
    if (!active) return;
    const id = active.lesson.id;
    const completed = progress.completed.includes(id)
      ? progress.completed.filter((x) => x !== id)
      : [...progress.completed, id];
    updateProgress({ completed, lastLessonId: id });
  };

  const goNext = () => {
    const next = getNextLesson(modules, activeLessonId);
    if (next) selectLesson(next.id);
  };

  const isComplete = active ? progress.completed.includes(active.lesson.id) : false;

  if (!active) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/60">
        Loading your course…
      </div>
    );
  }

  const { lesson, module } = active;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10"
            aria-label="Toggle course menu"
          >
            ☰
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gold font-semibold uppercase tracking-wide">{courseMeta.title}</p>
            <h1 className="text-sm sm:text-base font-bold truncate">Student Dashboard</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm text-white/60">
            <span>
              {completedCount}/{totalLessons} lessons
            </span>
            <span className="text-gold font-semibold">{percent}%</span>
          </div>
          <Link
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Support
          </Link>
        </div>
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-purple to-gold transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-[57px] z-20 w-80 h-[calc(100vh-57px)] overflow-y-auto border-r border-white/10 bg-[#0A0A0A] transition-transform duration-200`}
        >
          <nav className="p-4 space-y-6">
            {modules.map((mod) => (
              <ModuleNav
                key={mod.id}
                module={mod}
                activeLessonId={activeLessonId}
                completed={progress.completed}
                onSelect={selectLesson}
              />
            ))}

            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 px-2">
                Bonus Resources
              </h2>
              <ul className="space-y-1">
                {bonusResources.map((bonus) => (
                  <li
                    key={bonus.id}
                    className="px-3 py-2 rounded-lg text-sm text-white/70 bg-white/5 border border-white/5"
                  >
                    <span className="mr-2" aria-hidden>
                      {bonus.icon}
                    </span>
                    {bonus.title}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/40 mt-2 px-2">
                Download links are in your enrollment email. Need help? Use Support above.
              </p>
            </section>
          </nav>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-10 bg-black/60 lg:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <article className="max-w-3xl">
            <p className="text-gold text-sm font-semibold mb-1">
              Module {module.number} · {module.icon} {module.title}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-white/50 text-sm mb-6">
              Lesson {lesson.number} · {lesson.duration} · {lesson.summary}
            </p>

            <ProtectedVideoPlayer
              courseSlug={course.slug}
              lessonId={lesson.id}
              title={lesson.title}
            />

            <section className="mb-8">
              <ul className="space-y-4 text-white/80 leading-relaxed list-none p-0">
                {lesson.content.map((paragraph, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-gold shrink-0 mt-1">●</span>
                    <span>{paragraph}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-gold/30 bg-gold/5 p-5 mb-8">
              <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-2">
                Action Step
              </h3>
              <p className="text-white/90">{lesson.actionStep}</p>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={toggleComplete}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-colors ${
                  isComplete
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "bg-gold text-black hover:bg-gold-hover"
                }`}
              >
                {isComplete ? "✓ Completed" : "Mark as Complete"}
              </button>
              {getNextLesson(modules, lesson.id) && (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </article>
        </main>
      </div>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        Enrolled · Ref {reference.slice(0, 12)}… · Lifetime access
      </footer>
    </div>
  );
}

function ModuleNav({
  module,
  activeLessonId,
  completed,
  onSelect,
}: {
  module: CourseModule;
  activeLessonId: string;
  completed: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 px-2">
        Module {module.number}
      </h2>
      <p className="text-sm font-semibold px-2 mb-2">
        {module.icon} {module.title}
      </p>
      <ul className="space-y-0.5">
        {module.lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          const isDone = completed.includes(lesson.id);
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onSelect(lesson.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-purple/30 text-white border border-purple/50"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="mr-2 text-xs text-white/40">{lesson.number}.</span>
                {lesson.videoPath && (
                  <span className="mr-1 text-xs" title="Video lesson" aria-hidden>
                    ▶
                  </span>
                )}
                {isDone && <span className="text-green-400 mr-1">✓</span>}
                {lesson.title}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
