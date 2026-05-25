import type { CourseDefinition } from "./types";

/** Seed definition — canonical copy lives in data/courses/ai-creator-course.json */
export const aiCreatorCourse: CourseDefinition = {
  id: "ai-creator-course",
  slug: "ai-creator-course",
  badge: "AI",
  brandName: "AI Creator",
  status: "published",
  catalog: {
    tagline: "Social media, ads, short films & more — no subscriptions",
    description:
      "Master AI filmmaking in 2 days. Go viral, grow your audience, and scale with Hollywood-level VFX, profitable ads, and content systems.",
    emoji: "🎬",
    highlights: ["6 phases · 2-day intensive", "Viral editing + templates", "No experience needed"],
  },
  marketing: {
    course: {
      title: "The AI Creator Course",
      headline: "Master AI Filmmaking In 2 Days",
      subheadline:
        "Social Media Content, Profitable Ads, Short Films, and more! No subscriptions required.",
      price: 98,
      oldPrice: 298,
      totalValue: 494,
      currency: "USD",
      lessons: "30+",
      duration: "2 Days",
      rating: 4.9,
      students: "160,000+",
      discount: "68% OFF — LIMITED TIME",
      roiStatement: "One viral video can pay for this course 10× over",
      guaranteeDays: 30,
    },
    navLinks: [
      { label: "Curriculum", href: "#modules" },
      { label: "What's Included", href: "#offer" },
      { label: "Results", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
    heroOutcomes: [
      "Create Hollywood-level VFX without a studio budget",
      "Go viral on TikTok, Reels & YouTube Shorts",
      "Launch profitable AI ads",
      "Lifetime access",
    ],
    painAgitateSolution: [],
    transformation: { before: [], after: [] },
    howItWorks: [],
    valueStack: [{ name: "The AI Creator Course", value: 298 }],
    modules: [],
    testimonials: [],
    faqItems: [],
    audience: [],
    guarantee: { headline: "30-Day Guarantee", body: "Full refund if not satisfied." },
    ctas: {
      primary: "Yes — Give Me Instant Access",
      secondary: "See What's Inside",
      sticky: "Get Access — $98",
      checkout: "Complete My Enrollment",
      final: "Enroll Now",
    },
    instructor: {
      name: "Anthony Gallo",
      title: "Co-Founder, ContentCreator.com",
      quote: "Creators who leverage AI will replace the ones who don't.",
    },
  },
  lms: { modules: [], bonusResources: [] },
};
