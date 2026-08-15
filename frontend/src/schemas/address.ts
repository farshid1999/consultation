import { z } from "zod";

export const addressSchema = z.object({
  country: z.string().min(1, "کشور الزامی است"),
  province: z.string().min(1, "استان الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  street: z.string().min(1, "آدرس خیابان الزامی است"),
  postal_code: z.string().min(1, "کد پستی الزامی است"),
  description: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
