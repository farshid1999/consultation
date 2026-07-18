import type { BookingFormValues } from "@/schemas/booking";

/**
 * In a real implementation this would call the backend API.
 * Kept as a resolved-promise mock so the form's React Query flow
 * (loading / success / error states) is fully wired and demonstrable.
 */
export async function submitBookingRequest(values: BookingFormValues): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true };
}
