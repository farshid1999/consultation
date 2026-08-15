import GlassCard from "@/components/ui/GlassCard";
import { LoginForm } from "@/components/Auth";

export const metadata = {
  title: "ورود | سفیران آرامش",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="text-xl font-semibold text-cream text-right mb-6">ورود به حساب</h1>
        <LoginForm />
      </GlassCard>
    </main>
  );
}