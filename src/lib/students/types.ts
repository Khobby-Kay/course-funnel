export type StudentEnrollment = {
  reference: string;
  email: string;
  name: string;
  phone: string;
  region: string;
  countryCode: string;
  courseSlug: string;
  provider: string;
  enrolledAt: number;
  confirmationEmailSentAt?: number;
};
