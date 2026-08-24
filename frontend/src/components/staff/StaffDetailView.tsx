import Link from "next/link";
import { FiEdit2, FiMail, FiMapPin, FiPhone, FiFileText, FiBriefcase, FiUser } from "react-icons/fi";
import RoleBadges from "./RoleBadges";
import { toPersianDigits } from "@/lib/jalaali";
import { fromApiDateString } from "@/lib/date";
import type { InformationRead, StaffDetail } from "@/types";

function formatJalaliShort(iso: string | null): string {
  const date = fromApiDateString(iso);
  if (!date) return "—";
  return toPersianDigits(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
}

// نمایش بازگشتی اطلاعات تکمیلی با استایل روشن
function InformationNode({ info, depth = 0 }: { info: InformationRead; depth?: number }) {
  return (
    <div className={depth > 0 ? "mr-6 border-r-2 border-[#c9a24d]/20 pr-4 mt-4" : ""}>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#c9a24d]/40 transition-colors duration-300">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">{info.title}</p>
            {info.text && <p className="mt-2 text-xs text-slate-500 leading-relaxed">{info.text}</p>}
          </div>
          {info.file && (
            <a
              href={info.file}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#c9a24d]/10 px-3 py-1.5 text-xs font-medium text-[#c9a24d] hover:bg-[#c9a24d]/20 transition-colors"
            >
              <FiFileText size={14} />
              دانلود فایل
            </a>
          )}
        </div>
      </div>
      {info.children?.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {info.children.map((child) => (
            <InformationNode key={child.id} info={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// کامپوننت ساده برای نمایش فیلدها
function Field({ label, value, icon }: { label: string; value: string | null | undefined; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        {icon}
        {label}
      </div>
      <p className="text-sm text-slate-700 font-medium break-words">{value || "—"}</p>
    </div>
  );
}

export default function StaffDetailView({ staff }: { staff: StaffDetail }) {
  const { user } = staff;

  return (
    <div className="flex flex-col gap-8">

      {/* هدر پروفایل */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9a24d] to-[#e0c070]"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              // eslint-disable-next-lines @next/next/no-img-element
              <img src={user.avatar} alt={user.username} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-3xl font-bold text-slate-400 ring-4 ring-slate-50">
                {user.first_name?.[0] ?? user.username[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">
                {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <FiBriefcase size={14} />
                <span>{staff.position}</span>
              </div>
              <div className="mt-3">
                <RoleBadges roles={staff.roles} />
              </div>
            </div>
          </div>

          <Link
            href={`/staff/${staff.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-800/20 transition-all hover:bg-[#c9a24d] hover:shadow-[#c9a24d]/30"
          >
            <FiEdit2 aria-hidden="true" />
            ویرایش اطلاعات
          </Link>
        </div>
      </div>

      {/* گرید اصلی اطلاعات */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* اطلاعات استخدامی */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FiBriefcase size={18}/></span>
            اطلاعات استخدامی
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="کد پرسنلی" value={toPersianDigits(staff.employee_code)} />
            <Field label="سمت سازمانی" value={staff.position} />
            <Field label="تاریخ شروع همکاری" value={formatJalaliShort(staff.hire_date)} />
          </div>
        </section>

        {/* اطلاعات تماس */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600"><FiPhone size={18}/></span>
            راه‌های ارتباطی
          </h2>
          <div className="flex flex-col gap-2">
            <Field label="شماره موبایل" value={toPersianDigits(user.phone_number)} icon={<FiPhone size={14} className="text-slate-400"/>} />
            <Field label="آدرس ایمیل" value={user.email} icon={<FiMail size={14} className="text-slate-400"/>} />
            <Field label="تلفن ثابت" value={user.land_line ? toPersianDigits(user.land_line) : null} icon={<FiPhone size={14} className="text-slate-400"/>} />
          </div>
        </section>

        {/* اطلاعات شخصی */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><FiUser size={18}/></span>
            مشخصات فردی و سوابق
          </h2>
          <div className="grid gap-6 sm:grid-cols-3 mb-8">
            <Field label="تاریخ تولد" value={formatJalaliShort(user.birth_date)} />
            <Field label="مدرک تحصیلی" value={user.degree} />
            <Field label="شغل تخصصی" value={user.job} />
            <Field label="رشته ورزشی" value={user.sport_discipline} />
            <Field label="کد معرف" value={user.referral_code} />
            <Field label="وضعیت تحصیل" value={user.is_student ? "دانشجو" : "آزاد"} />
          </div>

          {(user.professional_background || user.bio) && (
            <div className="grid gap-6 sm:grid-cols-2 bg-slate-50 p-5 rounded-xl border border-slate-100">
              {user.professional_background && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">سوابق حرفه‌ای</p>
                  <p className="text-sm leading-relaxed text-slate-700">{user.professional_background}</p>
                </div>
              )}
              {user.bio && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">بیوگرافی</p>
                  <p className="text-sm leading-relaxed text-slate-700">{user.bio}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* آدرس */}
        {user.address && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
              <FiMapPin className="text-[#c9a24d]" aria-hidden="true" />
              آدرس محل سکونت
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {user.address.country}، {user.address.province}، {user.address.city}
                <br />
                <span className="text-slate-500 font-normal">{user.address.street}</span>
              </p>
              {user.address.description && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 italic">{user.address.description}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* باشگاه */}
        {user.club && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
              اطلاعات باشگاه مرتبط
            </h2>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
                {user.club.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{user.club.name}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {user.club.address.city}، {user.club.address.province}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* اطلاعات تکمیلی (درختی) */}
      {user.informations.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            مستندات و اطلاعات تکمیلی
          </h2>
          <div className="flex flex-col gap-4">
            {user.informations.map((info) => (
              <InformationNode key={info.id} info={info} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}