import {
  AUDIENCE,
  CHECKOUT_INCLUDED,
  CTAS,
  COURSE,
  FAQ_ITEMS,
  GUARANTEE,
  HERO_OUTCOMES,
  HOW_IT_WORKS,
  INSTRUCTOR,
  MODULES,
  NAV_LINKS,
  PAIN_AGITATE_SOLUTION,
  TESTIMONIALS,
  TRANSFORMATION,
  VALUE_STACK,
} from "@/lib/constants";
import { BONUS_RESOURCES, COURSE_MODULES } from "@/lib/course-content";
import type { CourseDefinition } from "./types";

export const digitalMarketingCourse: CourseDefinition = {
  id: "digital-marketing-mastery",
  slug: "digital-marketing-mastery",
  badge: "DM",
  brandName: "Digital Marketing",
  status: "published",
  catalog: {
    tagline: "Start earning online in 14 days",
    description:
      "The step-by-step system 1,000+ Africans used to land clients, sell services, and build income — without a degree or expensive tools.",
    emoji: "📈",
    highlights: [
      "25+ lessons · 5 modules",
      "Client scripts & templates included",
      "30-day money-back guarantee",
    ],
  },
  marketing: {
    course: COURSE,
    navLinks: NAV_LINKS,
    heroOutcomes: HERO_OUTCOMES,
    painAgitateSolution: PAIN_AGITATE_SOLUTION,
    transformation: TRANSFORMATION,
    howItWorks: HOW_IT_WORKS,
    valueStack: VALUE_STACK,
    modules: MODULES,
    testimonials: TESTIMONIALS,
    faqItems: FAQ_ITEMS,
    audience: AUDIENCE,
    guarantee: GUARANTEE,
    ctas: CTAS,
    instructor: INSTRUCTOR,
  },
  lms: {
    modules: COURSE_MODULES,
    bonusResources: BONUS_RESOURCES,
  },
};

export const digitalMarketingCheckoutIncluded = CHECKOUT_INCLUDED;
