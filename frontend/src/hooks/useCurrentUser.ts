// hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { UserDetail } from "@/types";

// کلید کش ثابت
const QUERY_KEY = ["current-user"];

export function useCurrentUser() {
  return useQuery<UserDetail>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // تلاش برای گرفتن اطلاعات از اندپوینت me
      // اگر اندپوینت me ندارید، این بخش خطا می‌دهد مگر اینکه آن را در بک‌اند بسازید
      const { data } = await apiClient.get<UserDetail>("accounts/users/me/");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 دقیقه کش
    retry: 1,
  });
}