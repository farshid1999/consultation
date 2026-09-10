// hooks/useSettings.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { toast } from "sonner";

export const QUERY_KEYS = {
  backgroundMusic: ["background-music"],
};

export function useBackgroundMusic() {
  return useQuery({
    queryKey: QUERY_KEYS.backgroundMusic,
    queryFn: () => settingsService.getBackgroundMusic(),
    staleTime: 1000 * 60 * 10, // کش طولانی‌تر چون تغییرات کم است
  });
}

export function useUpdateBackgroundMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => settingsService.updateBackgroundMusic(payload),
    onSuccess: () => {
      toast.success("موزیک پس‌زمینه با موفقیت بروزرسانی شد.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.backgroundMusic });
    },
    onError: (err: any) => {
      toast.error(err.message || "خطا در بروزرسانی موزیک");
    },
  });
}