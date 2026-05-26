import type { CourseCatalogCard, CourseDefinition, CourseMeta } from "./types";

export type CourseFormInput = {
  title: string;
  slug: string;
  badge: string;
  brandName: string;
  status: CourseDefinition["status"];
  catalog: CourseCatalogCard;
  course: Pick<
    CourseMeta,
    | "headline"
    | "subheadline"
    | "price"
    | "oldPrice"
    | "totalValue"
    | "currency"
    | "lessons"
    | "duration"
    | "rating"
    | "students"
    | "discount"
    | "roiStatement"
    | "guaranteeDays"
  >;
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function buildCourseFromForm(input: CourseFormInput, existing?: CourseDefinition): CourseDefinition {
  const slug = slugify(input.slug || input.title);
  const id = existing?.id ?? slug;
  const base = existing ?? createBlankCourse(slug, input.title);

  return {
    ...base,
    id,
    slug,
    badge: input.badge.slice(0, 3).toUpperCase() || slug.slice(0, 2).toUpperCase(),
    brandName: input.brandName || input.title,
    status: input.status,
    media: existing?.media,
    catalog: {
      emoji: input.catalog.emoji || "",
      tagline: input.catalog.tagline,
      description: input.catalog.description,
      highlights: input.catalog.highlights.filter(Boolean),
    },
    marketing: {
      ...base.marketing,
      course: {
        ...base.marketing.course,
        title: input.title,
        ...input.course,
      },
      ctas: {
        ...base.marketing.ctas,
        sticky: `Get Access — ${input.course.currency} ${input.course.price}`,
      },
    },
  };
}

function createBlankCourse(slug: string, title: string): CourseDefinition {
  return {
    id: slug,
    slug,
    badge: slug.slice(0, 2).toUpperCase(),
    brandName: title,
    status: "draft",
    catalog: {
      emoji: "📚",
      tagline: "New program",
      description: "Course description goes here.",
      highlights: ["Lifetime access", "Templates included", "30-day guarantee"],
    },
    marketing: {
      course: {
        title,
        headline: title,
        subheadline: "Describe the transformation your students get.",
        price: 399,
        oldPrice: 799,
        totalValue: 2000,
        currency: "GHS",
        lessons: "10+",
        duration: "14 Days",
        rating: 4.8,
        students: "100+",
        discount: "LAUNCH OFFER",
        roiStatement: "One client pays for this course many times over",
        guaranteeDays: 30,
      },
      navLinks: [
        { label: "Curriculum", href: "#modules" },
        { label: "What's Included", href: "#offer" },
        { label: "Results", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
      heroOutcomes: [
        "Clear step-by-step roadmap",
        "Templates you can copy and use",
        "Lifetime access — learn at your pace",
      ],
      painAgitateSolution: [
        {
          icon: "😤",
          title: "The Problem",
          description: "Describe the pain your audience feels today.",
          accent: "border-red-200 bg-red-50/80",
        },
        {
          icon: "⏳",
          title: "The Cost of Waiting",
          description: "What happens if they don't act now.",
          accent: "border-orange-200 bg-orange-50/80",
        },
        {
          icon: "🎯",
          title: "The Solution",
          description: "How your program solves it.",
          accent: "border-purple/20 bg-purple/5",
        },
      ],
      transformation: {
        before: ["Stuck without a clear path", "No templates or system", "No income from this skill"],
        after: ["Clear offer to sell", "Ready-to-use templates", "Path to first paying clients"],
      },
      howItWorks: [
        { step: 1, title: "Enroll & Get Access", description: "Pay once. Unlock everything instantly." },
        { step: 2, title: "Follow the Roadmap", description: "Complete modules in order with action steps." },
        { step: 3, title: "Launch & Get Paid", description: "Apply the system and land your first results." },
      ],
      valueStack: [{ name: `${title} (full program)`, value: 1200 }],
      modules: [
        {
          number: 1,
          title: "Module 1 — Getting Started",
          description: "Foundation and first wins.",
          icon: "🎯",
          outcome: "Your first milestone",
        },
      ],
      testimonials: [
        {
          name: "Student",
          location: "Ghana",
          text: "Add a real testimonial after your first cohort.",
          avatar: "S",
          result: "First client in 30 days",
        },
      ],
      faqItems: [
        {
          question: "How long do I have access?",
          answer: "Lifetime. One payment, all future updates included.",
        },
        {
          question: "Is there a guarantee?",
          answer: "Yes — 30-day money-back guarantee if you apply the system and aren't satisfied.",
        },
      ],
      audience: [
        { label: "Beginners", hook: "Start from zero with a clear roadmap" },
        { label: "Side Hustlers", hook: "Earn alongside your current job" },
      ],
      guarantee: {
        headline: "Try It Risk-Free for 30 Days",
        body: "Go through the course and apply the system. If it's not worth every cedi, email us for a full refund.",
      },
      ctas: {
        primary: "Yes — Give Me Instant Access",
        secondary: "See What's Inside",
        sticky: "Get Access — GHS 399",
        checkout: "Complete My Enrollment",
        final: "Enroll Now",
      },
      instructor: {
        name: "Your Name",
        title: "Course Instructor",
        quote: "Add your instructor quote here.",
      },
    },
    lms: {
      modules: [
        {
          id: `${slug}-m1`,
          number: 1,
          title: "Getting Started",
          icon: "🎯",
          outcome: "First milestone complete",
          lessons: [
            {
              id: `${slug}-m1-l1`,
              number: 1,
              title: "Welcome & Overview",
              duration: "5 min",
              summary: "What you'll achieve in this program.",
              content: ["Welcome to the course.", "How to get the most from each lesson."],
              actionStep: "Write your #1 goal for the next 14 days.",
            },
          ],
        },
      ],
      bonusResources: [{ id: "templates", title: "Resource Templates", icon: "📄" }],
    },
  };
}

export function courseToFormInput(course: CourseDefinition): CourseFormInput {
  return {
    title: course.marketing.course.title,
    slug: course.slug,
    badge: course.badge,
    brandName: course.brandName,
    status: course.status,
    catalog: course.catalog,
    course: {
      headline: course.marketing.course.headline,
      subheadline: course.marketing.course.subheadline,
      price: course.marketing.course.price,
      oldPrice: course.marketing.course.oldPrice,
      totalValue: course.marketing.course.totalValue,
      currency: course.marketing.course.currency,
      lessons: course.marketing.course.lessons,
      duration: course.marketing.course.duration,
      rating: course.marketing.course.rating,
      students: course.marketing.course.students,
      discount: course.marketing.course.discount,
      roiStatement: course.marketing.course.roiStatement,
      guaranteeDays: course.marketing.course.guaranteeDays,
    },
  };
}
