import type { IconType } from "react-icons";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  layout: "stacked" | "inline" | "framed" | "overlap";
}

export interface ProcessStep {
  id: string;
  order: string;
  title: string;
  description: string;
  icon: IconType;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: IconType;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  sport: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}


/**
 * Matches DRF's default PageNumberPagination response envelope, which is
 * what `self.get_paginated_response(...)` in StaffListAPIView returns.
 */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * A normalized shape for errors thrown out of the service layer, built
 * from whatever DRF sends back (field-level validation errors, a single
 * "detail" message, or a network failure with no response at all).
 */
export interface ApiError {
  status: number | null;
  message: string;
  /** Field name -> list of error strings, as DRF's serializer errors look. */
  fieldErrors: Record<string, string[]>;
}

export interface ListQueryParams {
  page?: number;
  search?: string;
  ordering?: string;
}
