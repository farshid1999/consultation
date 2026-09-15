"use client";

import { useMyProfile } from "@/hooks/useUser";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiFileText } from "react-icons/fi";
import { toPersianDigits } from "@/lib/jalaali"; // اگر کتابخانه تاریخ شمسی دارید

export default function MyProfile() {
  const { data: user, isLoading, isError } = useMyProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        خطا در دریافت اطلاعات پروفایل. لطفاً دوباره تلاش کنید.
      </div>
    );
  }

  // کامپوننت کمکی برای نمایش ردیف‌های اطلاعات
  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mt-1 rounded-lg bg-gold/10 p-2 text-gold">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-cream/50 mb-1">{label}</p>
        <p className="text-sm font-medium text-cream">{value || "ثبت نشده"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* هدر پروفایل */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-gold/20" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold/10 text-3xl font-bold text-gold ring-4 ring-gold/20">
                {user.first_name?.[0] || user.username?.[0] || "U"}
              </div>
            )}
          </div>
          
          <div className="text-center md:text-right flex-1">
            <h1 className="text-2xl font-bold text-cream">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-cream/50 text-sm mt-1">@{user.username}</p>
            {user.bio && <p className="text-cream/70 text-sm mt-3 max-w-2xl leading-relaxed">{user.bio}</p>}
          </div>
        </div>
      </div>

      {/* گرید اطلاعات اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoRow icon={FiPhone} label="شماره موبایل" value={user.phone_number} />
        <InfoRow icon={FiMail} label="ایمیل" value={user.email} />
        <InfoRow icon={FiBriefcase} label="شغل / حرفه" value={user.job} />
        <InfoRow icon={FiCalendar} label="تاریخ تولد" value={user.birth_date ? toPersianDigits(user.birth_date) : undefined} />
        <InfoRow icon={FiUser} label="رشته ورزشی" value={user.sport_discipline} />
        <InfoRow icon={FiFileText} label="کد معرف" value={user.referral_code} />
      </div>

      {/* بخش آدرس و باشگاه (در صورت وجود) */}
      {(user.address || user.club) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.address && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-4 text-gold">
                <FiMapPin size={18} />
                <h3 className="font-semibold text-sm">آدرس</h3>
              </div>
              <p className="text-cream/80 text-sm leading-7">
                {user.address.province}، {user.address.city}، {user.address.street}
                <br />
                <span className="text-cream/50 text-xs mt-1 block">کد پستی: {user.address.postal_code || "ندارد"}</span>
              </p>
            </div>
          )}

          {user.club && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-4 text-gold">
                <FiBriefcase size={18} />
                <h3 className="font-semibold text-sm">باشگاه / مجموعه</h3>
              </div>
              <p className="text-cream font-medium">{user.club.name}</p>
              {user.club.address && (
                <p className="text-cream/50 text-xs mt-2">
                  {user.club.address.city} - {user.club.address.street}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* بخش اطلاعات تکمیلی (Informations) */}
      {user.informations && user.informations.length > 0 && (
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-lg font-bold text-cream mb-4 flex items-center gap-2">
            <FiFileText className="text-gold" />
            اطلاعات تکمیلی
          </h3>
          <div className="space-y-3">
            {user.informations.map((info) => (
              <div key={info.id} className="p-4 rounded-xl border border-white/5 bg-deep/30">
                <h4 className="text-gold font-medium text-sm mb-2">{info.title}</h4>
                <p className="text-cream/70 text-sm whitespace-pre-wrap">{info.text}</p>
                {info.file && (
                  <a href={info.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-gold/80 hover:text-gold mt-2 transition-colors">
                    مشاهده فایل پیوست
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}