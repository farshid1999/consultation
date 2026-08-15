import { z } from "zod";
import { addressSchema } from "./address";
import { clubSchema } from "./club";
import { informationSchema } from "./information";

const PHONE_REGEX = /^09\d{9}$/;

const avatarSchema = z
  .custom<File>((val) => val instanceof File, { message: "فایل نامعتبر است" })
  .nullable()
  .optional();

/**
 * Fields shared between create and update — kept in one place so the two
 * schemas below can't silently drift apart from each other.
 */
const baseUserFields = {
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.union([z.literal(""), z.string().email("ایمیل معتبر نیست")]).optional(),
  land_line: z.string().optional(),
  is_student: z.boolean().optional(),
  degree: z.string().optional(),
  job: z.string().optional(),
  sport_discipline: z.string().optional(),
  professional_background: z.string().optional(),
  referral_code: z.string().optional(),
  address: addressSchema.optional(),
  club: clubSchema.optional(),
  avatar: avatarSchema,
  bio: z.string().optional(),
  birth_date: z.date().nullable().optional(),
  informations: z.array(informationSchema).optional(),
};

/** Mirrors UserCreateSerializer — username/password/phone_number required. */
export const userCreateSchema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ حرف باشد"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
  phone_number: z.string().regex(PHONE_REGEX, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
  ...baseUserFields,
});

/**
 * Mirrors UserUpdateSerializer — every field optional (partial update),
 * including username/phone_number/password; password only validated for
 * length when the user actually types a new one.
 */
export const userUpdateSchema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ حرف باشد").optional(),
  password: z.union([z.literal(""), z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")]).optional(),
  phone_number: z
    .string()
    .regex(PHONE_REGEX, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)")
    .optional(),
  ...baseUserFields,
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
