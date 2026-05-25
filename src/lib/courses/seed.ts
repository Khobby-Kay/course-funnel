import { aiCreatorCourse } from "./ai-creator";
import { digitalMarketingCourse } from "./digital-marketing";
import { socialMediaProCourse } from "./social-media-pro";
import type { CourseDefinition } from "./types";

export const SEED_COURSES: CourseDefinition[] = [
  digitalMarketingCourse,
  socialMediaProCourse,
  aiCreatorCourse,
];
