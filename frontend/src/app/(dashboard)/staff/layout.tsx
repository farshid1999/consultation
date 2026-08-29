"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenService } from "@/lib/auth/tokenService";
import AdminSidebar from "@/components/Admin/adminSidebar";
import "@/styles/light.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!tokenService.isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}