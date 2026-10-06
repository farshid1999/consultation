import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { tokenService } from "@/lib/auth/tokenService";
import type { UserDetail } from "@/types";

const QUERY_KEY = ["current-user"];

export function useCurrentUser() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(tokenService.isAuthenticated());
  }, []);

  return useQuery<UserDetail>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<UserDetail>("accounts/users/me/");
      return data;
    },
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}