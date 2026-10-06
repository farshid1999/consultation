"use client";

import { useParams, useRouter } from "next/navigation";
import { FiArrowRight, FiAward, FiBriefcase, FiLayers } from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";
import StaffAvatar from "@/components/staff/StaffAvatar";
import InformationTree from "@/components/staff/InformationTree";
import { usePublicStaffDetail } from "@/hooks/usePublicStaff";
import { fullName } from "@/utils/staffUtils";

const card = "rounded-3xl border border-white/10 bg-deep-2/40 backdrop-blur-md shadow-xl shadow-black/20";

export default function ExpertDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: staff, isLoading, isError } = usePublicStaffDetail(params.id ?? null);

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-deep">
        <NeuralBackground />
        <span className="relative h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </main>
    );
  }

  if (isError || !staff) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-3 bg-deep text-cream">
        <NeuralBackground />
        <p className="relative text-sm text-cream/50">کارشناس یافت نشد.</p>
        <button onClick={() => router.push("/experts")} className="relative text-sm text-gold hover:underline">
          بازگشت به لیست کارشناسان
        </button>
      </main>
    );
  }

  return (
    <main dir="rtl" className="relative min-h-screen overflow-x-hidden bg-deep pb-24 text-cream">
      <NeuralBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <button
          onClick={() => router.push("/experts")}
          className="group mb-8 flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-gold"
        >
          <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          همه‌ی کارشناسان
        </button>

        {/* هدر پروفایل */}
        <section className={`${card} relative overflow-hidden p-6 md:p-10`}>
          <div
            className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #C9A24D, transparent 70%)" }}
          />
          <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-right">
            <StaffAvatar
              staff={staff}
              className="h-40 w-40 shrink-0 rounded-3xl border border-gold/30 shadow-2xl shadow-gold/10 md:h-48 md:w-48"
            />

            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-extrabold md:text-4xl">{fullName(staff)}</h1>

              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <Badge icon={<FiBriefcase size={14} />}>{staff.position}</Badge>
                {staff.degree && <Badge icon={<FiAward size={14} />}>{staff.degree}</Badge>}
              </div>

              {staff.lines.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <FiLayers className="text-gold/60" size={15} />
                  {staff.lines.map((l) => (
                    <span key={l.id} className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold">
                      {l.title}
                    </span>
                  ))}
                </div>
              )}

              <div className="h-[3px] w-14 rounded-full bg-gradient-to-l from-gold to-gold/10 md:mr-0" />
            </div>
          </div>
        </section>

        {/* بیو */}
        {staff.bio && (
          <section className={`${card} mt-8 p-6 md:p-8`}>
            <h2 className="mb-4 text-sm font-bold text-gold">درباره‌ی {staff.first_name}</h2>
            <p className="whitespace-pre-wrap text-[15px] leading-9 text-cream/80">{staff.bio}</p>
          </section>
        )}

        {/* اطلاعات تکمیلی */}
        {staff.informations.length > 0 && (
          <section className="mt-8 space-y-5">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-extrabold">سوابق و اطلاعات تکمیلی</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
            </div>
            <InformationTree items={staff.informations} />
          </section>
        )}
      </div>
    </main>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-cream/80">
      <span className="text-gold">{icon}</span>
      {children}
    </span>
  );
}