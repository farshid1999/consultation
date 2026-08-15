"use client";

import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import { RegisterForm } from "@/components/Auth";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8">
        <h1 className="text-xl font-semibold text-cream text-right mb-6">ثبت‌نام</h1>
        <RegisterForm onGoToLogin={() => router.push("/login")} />
      </GlassCard>
    </main>
  );
}