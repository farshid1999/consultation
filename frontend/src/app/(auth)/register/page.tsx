"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import { RegisterForm } from "@/components/Auth";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-deep-3 via-deep to-deep-2">
      <GlassCard className="w-full max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold/30 bg-deep-2 flex items-center justify-center">
            <Image
              src="/logo.webp"
              alt="سفیران آرامش"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <p className="text-xs tracking-[0.3em] text-gold/70 uppercase">
            Serenity Ambassadors
          </p>
        </div>

        <h1 className="text-xl font-semibold text-cream text-right mb-6">
          ثبت‌نام
        </h1>
        <RegisterForm onGoToLogin={() => router.push("/login")} />
      </GlassCard>
    </main>
  );
}
