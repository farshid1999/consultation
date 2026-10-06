import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { sliderService } from "@/services/sliderService";
import { extractApiError } from "@/services/api/errors";
import type {
  PublicSlider,
  Slider,
  SliderCreateInput,
  SliderUpdateInput,
  SliderImage,
  SliderImageCreateInput,
  SliderImageUpdateInput,
} from "@/types";

export const SLIDER_KEYS = {
  all: ["sliders"] as const,
  publicByKey: (key: string) => ["sliders", "public", key] as const,
  adminList: ["sliders", "admin", "list"] as const,
  adminDetail: (id: number | string) =>
    ["sliders", "admin", "detail", String(id)] as const,
};

function showApiError(err: unknown) {
  const { message, fieldErrors } = extractApiError(err);
  const firstFieldError = Object.values(fieldErrors)[0]?.[0];
  toast.error(firstFieldError ?? message);
}

// ── عمومی ─────────────────────────────────────────────────────────────
export function usePublicSlider(key: string) {
  return useQuery<PublicSlider | null>({
    queryKey: SLIDER_KEYS.publicByKey(key),
    queryFn: () => sliderService.getPublic(key),
    staleTime: 1000 * 60 * 5,
    retry: false, // ۴۰۴ همین‌جا null می‌شود؛ تلاش مجدد لازم نیست
  });
}

// ── مدیریتی: خواندن ───────────────────────────────────────────────────
export function useAdminSliders() {
  return useQuery<Slider[]>({
    queryKey: SLIDER_KEYS.adminList,
    queryFn: () => sliderService.list(),
  });
}

export function useAdminSlider(id: number | string) {
  return useQuery<Slider>({
    queryKey: SLIDER_KEYS.adminDetail(id),
    queryFn: () => sliderService.detail(id),
    enabled: !!id,
  });
}

// ── مدیریتی: نوشتن ────────────────────────────────────────────────────
/** بعد از هر تغییر، همه‌ی کش‌های اسلایدر (ادمین و عمومی) تازه می‌شوند. */
function useInvalidateSliders() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: SLIDER_KEYS.all });
}

export function useCreateSlider() {
  const invalidate = useInvalidateSliders();
  return useMutation<Slider, unknown, SliderCreateInput>({
    mutationFn: (data) => sliderService.create(data),
    onSuccess: () => {
      toast.success("اسلایدر با موفقیت ساخته شد.");
      invalidate();
    },
    onError: (err) => {
      showApiError(err);
    },
  });
}

export function useUpdateSlider(id: number | string) {
  const invalidate = useInvalidateSliders();
  return useMutation<Slider, unknown, SliderUpdateInput>({
    mutationFn: (data) => sliderService.update(id, data),
    onSuccess: () => {
      toast.success("اسلایدر بروزرسانی شد.");
      invalidate();
    },
    onError: (err) => {
      toast.error(extractApiError(err).message);
    },
  });
}

export function useDeleteSlider() {
  const invalidate = useInvalidateSliders();
  return useMutation<void, unknown, number | string>({
    mutationFn: (id) => sliderService.remove(id),
    onSuccess: () => {
      toast.success("اسلایدر حذف شد.");
      invalidate();
    },
    onError: (err) => {
      toast.error(extractApiError(err).message);
    },
  });
}

// ── تصاویر ────────────────────────────────────────────────────────────
export function useCreateSliderImage(sliderId: number | string) {
  const invalidate = useInvalidateSliders();
  return useMutation<SliderImage, unknown, SliderImageCreateInput>({
    mutationFn: (data) => sliderService.createImage(sliderId, data),
    onSuccess: () => {
      toast.success("تصویر اضافه شد.");
      invalidate();
    },
    onError: (err) => {
      toast.error(extractApiError(err).message);
    },
  });
}

export function useUpdateSliderImage() {
  const invalidate = useInvalidateSliders();
  return useMutation<
    SliderImage,
    unknown,
    { id: number | string; data: SliderImageUpdateInput }
  >({
    mutationFn: ({ id, data }) => sliderService.updateImage(id, data),
    onSuccess: () => {
      invalidate();
    },
    onError: (err) => {
      toast.error(extractApiError(err).message);
    },
  });
}

export function useDeleteSliderImage() {
  const invalidate = useInvalidateSliders();
  return useMutation<void, unknown, number | string>({
    mutationFn: (id) => sliderService.deleteImage(id),
    onSuccess: () => {
      toast.success("تصویر حذف شد.");
      invalidate();
    },
    onError: (err) => {
      toast.error(extractApiError(err).message);
    },
  });
}