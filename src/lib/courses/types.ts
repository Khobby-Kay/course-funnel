import type { CourseModule } from "@/lib/course-content";

export type CourseStatus = "published" | "draft" | "archived";

export type CourseMedia = {
  instructorPhoto?: string;
  previewVideoUrl?: string;
  previewVideoPoster?: string;
  screenshots?: string[];
};

export type CourseMeta = {
  title: string;
  headline: string;
  subheadline: string;
  price: number;
  oldPrice: number;
  totalValue: number;
  currency: string;
  lessons: string;
  duration: string;
  rating: number;
  students: string;
  discount: string;
  roiStatement: string;
  guaranteeDays: number;
};

export type CourseCatalogCard = {
  tagline: string;
  description: string;
  emoji: string;
  highlights: string[];
};

export type CourseMarketing = {
  course: CourseMeta;
  navLinks: { label: string; href: string }[];
  heroOutcomes: string[];
  painAgitateSolution: {
    icon: string;
    title: string;
    description: string;
    accent: string;
  }[];
  transformation: { before: string[]; after: string[] };
  howItWorks: { step: number; title: string; description: string }[];
  valueStack: readonly { name: string; value: number }[];
  modules: {
    number: number;
    title: string;
    description: string;
    icon: string;
    outcome: string;
  }[];
  testimonials: {
    name: string;
    location: string;
    text: string;
    avatar: string;
    result: string;
  }[];
  faqItems: { question: string; answer: string }[];
  audience: { label: string; hook: string }[];
  guarantee: { headline: string; body: string };
  ctas: {
    primary: string;
    secondary: string;
    sticky: string;
    checkout: string;
    final: string;
  };
  instructor: { name: string; title: string; quote: string };
};

export type CourseLms = {
  modules: CourseModule[];
  bonusResources: { id: string; title: string; icon: string }[];
};

export type CourseDefinition = {
  id: string;
  slug: string;
  badge: string;
  brandName: string;
  status: CourseStatus;
  catalog: CourseCatalogCard;
  marketing: CourseMarketing;
  lms: CourseLms;
  media?: CourseMedia;
};

export type CoursePageData = CourseMarketing & {
  slug: string;
  badge: string;
  brandName: string;
  landingPath: string;
  checkoutPath: string;
  checkoutIncluded: readonly string[];
  media?: CourseMedia;
};
