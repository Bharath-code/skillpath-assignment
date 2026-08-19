export interface Course {
  courseName: string;
  courseCode: string;
  description: string;
  mainCategory: string;
  shortCourse: string;
  courseType: string;
  pricePaise: number;
  priceUsdCents: number;
  mangoId: string;
  refundable: boolean;
}

export type CountryCode = 'IN' | 'US';

export interface CountryResponse {
  country_code: CountryCode;
}

export interface SkillpathCoursesProps {
  /** Primary theme accent color for Framer control */
  accentColor?: string;
  /** Toggle visibility of refundable badge */
  showRefundableBadge?: boolean;
  /** Max width constraint or custom CSS class */
  className?: string;
}
