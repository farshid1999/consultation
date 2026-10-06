import {z} from "zod";
import {isValidNationalId} from "@/schemas/auth";
import {informationSchema} from "@/schemas/information";

// ── Shared ────────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
    country: z.string().min(1, "کشور الزامی است"),
    province: z.string().min(1, "استان الزامی است"),
    city: z.string().min(1, "شهر الزامی است"),
    street: z.string().min(1, "آدرس الزامی است"),
    postal_code: z.string().optional(),
    description: z.string().nullable().optional(),
});

export const clubSchema = z.object({
    name: z.string().min(1, "نام باشگاه الزامی است"),
    address: addressSchema,
});


// ── Create User ───────────────────────────────────────────────────────────────

const avatarField = z
    .custom<File>((v) => typeof File !== "undefined" && v instanceof File, {
        message: "فایل تصویر معتبر نیست",
    })
    .nullable()
    .optional();


export const createUserSchema = z.object({
    username: z
        .string()
        .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
        .max(50, "نام کاربری نباید بیشتر از ۵۰ کاراکتر باشد"),
    national_id: z
        .string()
        .min(1, "کد ملی الزامی است")
        .refine(isValidNationalId, "کد ملی معتبر وارد کنید"),
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    first_name: z.string().min(1, "نام الزامی است"),
    last_name: z.string().min(1, "نام خانوادگی الزامی است"),
    email: z.string().email("ایمیل معتبر وارد کنید"),
    phone_number: z
        .string()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
    land_line: z.string().optional(),
    is_student: z.boolean().optional(),
    degree: z.string().max(100).optional(),
    job: z.string().max(100).optional(),
    sport_discipline: z.string().max(100).optional(),
    coach_name: z.string().max(150).optional(),
    activity_history: z.string().optional(),
    professional_background: z.string().optional(),
    referral_code: z.string().optional(),
    bio: z.string().optional(),

    birth_date: z.date().nullable().optional(),
    avatar: avatarField,
    address: addressSchema.optional(),
    club: clubSchema.optional(),
    informations: z.array(informationSchema).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ── Update User ───────────────────────────────────────────────────────────────
export const updateUserSchema = createUserSchema
    .omit({password: true})
    .partial()
    .extend({
        // کاربران قدیمی کد ملی ندارند، پس خالی هم مجاز است
        national_id: z
            .union([z.literal(""), z.string().refine(isValidNationalId, "کد ملی معتبر وارد کنید")])
            .optional(),
        username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد").max(50).optional(),
        password: z
            .union([z.literal(""), z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")])
            .optional(),
    });

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
