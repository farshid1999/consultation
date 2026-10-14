"use client";

import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { tokenService } from "@/lib/auth/tokenService";
import { useUserRole } from "@/hooks/useUsers"; // مسیر واقعی هوک خودتان
import AdminSidebar from "@/components/Admin/adminSidebar";
import "@/styles/light.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = tokenService.isAuthenticated();

  const { data: role, isLoading, isError } = useUserRole();

  // لاگین نبودن، یا خطای دریافت نقش (مثلاً توکن نامعتبر): به صفحه‌ی ورود
  useEffect(() => {
    if (!isAuthenticated || isError) {
      router.replace("/login");
    }
  }, [isAuthenticated, isError, router]);

  // تا وقتی نقش مشخص نشده چیزی از پنل نشان نده
  if (!isAuthenticated || isLoading || isError || !role) {
    return <div className="min-h-screen" />;
  }

  const hasAccess =
    role.roles.includes("admin") || role.is_super;

  if (!hasAccess) {
    notFound(); // صفحه‌ی 404
  }
// صصص
  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto p-4 pt-20 md:p-8">
        {children}
      </main>
    </div>
  );
}