// hooks/useContent.ts

import { useMutation } from "@tanstack/react-query";
import { contentService } from "@/services/contentService";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export function useCreateContent() {
  return useMutation({
    mutationFn: (payload: any) => contentService.create(payload),
    onSuccess: () => {
      toast.success("محتوا با موفقیت ایجاد شد.");
    },
    onError: (err: any) => {
      const apiError = err as ApiError;
      toast.error(apiError.message || "خطا در ایجاد محتوا");
    },
  });
}