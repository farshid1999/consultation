import { z } from "zod";

// ── Media ─────────────────────────────────────────────────────────────────────

export const mediaInputSchema = z.object({
  text: z.string().optional(),
  file: z.instanceof(File).nullable().optional(),
});

export const assignmentMediaSchema = z.object({
  media: mediaInputSchema,
});

// ── Assignment ────────────────────────────────────────────────────────────────

export const assignmentCreateSchema = z.object({
  line: z.string({ required_error: "لاین الزامی است" }),
  title: z.string().min(1, "عنوان الزامی است").max(255),
  description: z.string().optional(),
  parent: z.number().nullable().optional(),
  member_ids: z.array(z.string()).min(1, "حداقل یک عضو انتخاب کنید"),
  media_items: z.array(assignmentMediaSchema).optional(),
});

export const assignmentUpdateSchema = z.object({
  line: z.string().optional(),
  title: z.string().min(1, "عنوان الزامی است").max(255).optional(),
  description: z.string().optional(),
  parent: z.number().nullable().optional(),
  member_ids: z.array(z.string()).optional(),
  media_items: z.array(assignmentMediaSchema).optional(),
});

export type AssignmentCreateFormValues = z.infer<typeof assignmentCreateSchema>;
export type AssignmentUpdateFormValues = z.infer<typeof assignmentUpdateSchema>;

// ── Submission ────────────────────────────────────────────────────────────────

export const assignmentSubmissionSchema = z.object({
  media_items: z.array(mediaInputSchema).optional(),
});

export type AssignmentSubmissionFormValues = z.infer<typeof assignmentSubmissionSchema>;