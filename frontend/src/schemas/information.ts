import { z } from "zod";

export interface InformationFormValues {
  title: string;
  text?: string;
  file?: File | null;
  children?: InformationFormValues[];
}

/**
 * Self-referencing schema — every node accepts a `children` array of more
 * nodes of the same shape, at any depth, mirroring how
 * InformationCreateSerializer.create() recursively re-validates and
 * creates each child through the same serializer. `z.lazy` is required
 * here because a schema can't reference itself directly during
 * definition.
 */
export const informationSchema: z.ZodType<InformationFormValues> = z.lazy(() =>
  z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    text: z.string().optional(),
    file: z
      .custom<File>((val) => val instanceof File, { message: "فایل نامعتبر است" })
      .nullable()
      .optional(),
    children: z.array(informationSchema).optional(),
  })
);
