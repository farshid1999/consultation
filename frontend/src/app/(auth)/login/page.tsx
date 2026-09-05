import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import { LoginForm } from "@/components/Auth";

export const metadata = {
  title: "ورود | سفیران آرامش",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-deep-3 via-deep to-deep-2">
      <GlassCard className="w-full max-w-md p-8">
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
          <p className="text-xs tracking-[0.3em] text-gold/70 uppercase">Serenity Ambassadors</p>
        </div>

        {/* <h1 className="text-xl font-semibold text-cream text-right mb-6">ورود به حساب</h1> */}
        <LoginForm />
      </GlassCard>
    </main>
  );
}