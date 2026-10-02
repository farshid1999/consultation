"use client";

import { useEffect, useState } from "react";
import { users } from "@/services/user";

type UserRole = "admin" | "staff" | "member";

export function useUserPath() {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const roleData = await users.getUserRole();

        if (roleData.is_super || roleData.roles.includes("admin")) {
          setRole("admin");
        } else if (roleData.is_staff) {
          setRole("staff");
        } else {
          setRole("member");
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    getRole();
  }, []);

  return {
    role,
    basePath: role ? `/${role}` : null,
  };
}