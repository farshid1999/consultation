import { z } from "zod";
import { addressSchema } from "./address";

export const clubSchema = z.object({
  name: z.string().min(1, "نام باشگاه الزامی است"),
  address: addressSchema,
});

export type ClubFormValues = z.infer<typeof clubSchema>;
