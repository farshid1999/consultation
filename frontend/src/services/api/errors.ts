import { AxiosError } from "axios";
import type { ApiError } from "@/types/common";

/**
 * DRF validation errors typically look like:
 *   { "phone_number": ["این فیلد الزامی است."], "user": { "email": [...] } }
 * or a flat top-level message:
 *   { "detail": "Not found." }
 *
 * This flattens either shape into `fieldErrors` with dot-notation keys
 * (e.g. "user.email") so a form can map them straight onto react-hook-form
 * via `setError("user.email", ...)`.
 */
function flattenFieldErrors(data: unknown, prefix = ""): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (!data || typeof data !== "object") return result;

  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (key === "detail") return;
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      result[path] = value as string[];
    } else if (value && typeof value === "object") {
      Object.assign(result, flattenFieldErrors(value, path));
    } else if (typeof value === "string") {
      result[path] = [value];
    }
  });

  return result;
}

export function extractApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const detailMessage =
      (data?.detail as string | undefined) ??
      (data?.message as string | undefined) ??
      error.message;

    return {
      status: error.response?.status ?? null,
      message: detailMessage || "خطایی در ارتباط با سرور رخ داد.",
      fieldErrors: flattenFieldErrors(data),
    };
  }

  return {
    status: null,
    message: "خطای غیرمنتظره‌ای رخ داد.",
    fieldErrors: {},
  };
}
