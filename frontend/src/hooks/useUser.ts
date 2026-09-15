import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { UserDetail } from "@/types/Users";

export const useMyProfile = () => {
  return useQuery<UserDetail>({
    queryKey: ["user", "me"],
    queryFn: userService.getMyProfile,
    staleTime: 1000 * 60 * 5, // داده‌ها به مدت ۵ دقیقه تازه در نظر گرفته می‌شوند
  });
};