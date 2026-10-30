"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiUsers } from "react-icons/fi";

import GlassCard from "@/components/ui/GlassCard";
import { useUser } from "@/hooks/useUsers";
import type { UserDetail } from "@/types/user";

interface UserDetailModalProps {
  userId: number;
  onClose: () => void;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-cream/5 last:border-0">
      <span className="text-cream/40 text-sm shrink-0">{label}</span>
      <span className="text-cream text-sm text-left break-words min-w-0">
        {value ?? "—"}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-1">
      <h3 className="text-sm font-semibold text-gold mb-1">
        {title}
      </h3>
      {children}
    </section>
  );
}

function InvitedUsersSection({
  users,
}: {
  users: UserDetail["invited_users"];
}) {
  return (
    <Section title={`دعوت‌شدگان (${users.length})`}>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {users.map((invited, index) => {
            const fullName =
              `${invited.first_name ?? ""} ${invited.last_name ?? ""}`.trim();

            return (
              <div
                key={`${invited.username}-${index}`}
                className="group rounded-xl border border-dashed border-gold/20 bg-gold/[0.025] p-3 transition-all duration-200 hover:border-gold/50 hover:bg-gold/[0.06]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-sm font-semibold">
                    {invited.first_name?.[0] ??
                      invited.username?.[0]?.toUpperCase() ??
                      "?"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-cream text-sm font-medium truncate">
                        {fullName || invited.username}
                      </p>

                      <span className="text-[10px] text-cream/30 shrink-0">
                        #{index + 1}
                      </span>
                    </div>

                    <p className="text-cream/40 text-xs truncate mt-0.5">
                      @{invited.username}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-cream/5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-cream/35 text-[11px]">
                      شماره موبایل
                    </span>
                    <span className="text-cream/70 text-xs" dir="ltr">
                      {invited.phone_number || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-cream/35 text-[11px]">
                      کد ملی
                    </span>
                    <span className="text-cream/70 text-xs" dir="ltr">
                      {invited.national_id || "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-cream/10 py-6 flex flex-col items-center gap-2">
          <FiUsers className="text-cream/20" size={22} />
          <p className="text-cream/30 text-xs">
            هنوز کاربری توسط این شخص دعوت نشده است.
          </p>
        </div>
      )}
    </Section>
  );
}

export default function UserDetailModal({
  userId,
  onClose,
}: UserDetailModalProps) {
  const { data: user, isLoading } = useUser(userId);
  const u = user as UserDetail | undefined;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-deep/70 backdrop-blur-sm"
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <GlassCard className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 pointer-events-auto">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-cream/40 transition-colors hover:text-cream"
            aria-label="بستن"
          >
            <FiX size={20} />
          </button>

          <h2 className="text-lg font-semibold text-cream mb-6">
            جزئیات کاربر
          </h2>

          {isLoading || !u ? (
            <p className="text-center py-10 text-cream/40 text-sm">
              در حال بارگذاری...
            </p>
          ) : (
            <div className="space-y-6">
              {/* اطلاعات اصلی کاربر */}
              <div className="flex items-center gap-3">
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                    {u.first_name?.[0] ??
                      u.username?.[0]?.toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-cream font-semibold truncate">
                    {u.first_name || u.last_name
                      ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
                      : u.username}
                  </p>

                  <p className="text-cream/40 text-xs">
                    @{u.username}
                  </p>
                </div>
              </div>

              {/* اطلاعات حساب */}
              <Section title="اطلاعات حساب">
                <Row label="کد ملی" value={u.national_id} />
                <Row label="نام کاربری" value={u.username} />
                <Row label="ایمیل" value={u.email} />
              </Section>

              {/* اطلاعات شخصی */}
              <Section title="اطلاعات شخصی">
                <Row label="شماره موبایل" value={u.phone_number} />
                <Row label="تلفن ثابت" value={u.land_line} />
                <Row label="شغل" value={u.job} />
                <Row label="مدرک تحصیلی" value={u.degree} />
                <Row label="رشته ورزشی" value={u.sport_discipline} />
                <Row label="نام مربی" value={u.coach_name} />
                <Row label="سابقه فعالیت" value={u.activity_history} />
                <Row label="دانشجو" value={u.is_student ? "بله" : "خیر"} />
                <Row label="کد معرف" value={u.referral_code} />
              </Section>

              {/* کاربران دعوت‌شده */}
              <InvitedUsersSection
                users={u.invited_users ?? []}
              />

              {/* اطلاعات باشگاه */}
              {u.club && (
                <Section title="اطلاعات باشگاه">
                  <Row label="نام باشگاه" value={u.club.name} />
                  <Row
                    label="آدرس باشگاه"
                    value={
                      u.club.address
                        ? [
                            u.club.address.country,
                            u.club.address.province,
                            u.club.address.city,
                            u.club.address.street,
                          ]
                            .filter(Boolean)
                            .join("، ")
                        : undefined
                    }
                  />
                </Section>
              )}

              {/* آدرس کاربر */}
              {u.address && (
                <Section title="آدرس">
                  <Row
                    label="آدرس"
                    value={[
                      u.address.country,
                      u.address.province,
                      u.address.city,
                      u.address.street,
                    ]
                      .filter(Boolean)
                      .join("، ")}
                  />
                  <Row
                    label="کد پستی"
                    value={u.address.postal_code}
                  />
                </Section>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
