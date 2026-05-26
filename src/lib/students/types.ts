export type StudentEnrollment = {
  reference: string;
  email: string;
  name: string;
  phone: string;
  courseSlug: string;
  provider: string;
  enrolledAt: number;
  confirmationEmailSentAt?: number;
};
