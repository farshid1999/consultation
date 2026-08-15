import Link from "next/link";
import { FiEdit2, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import RoleBadges from "./RoleBadges";
import { toPersianDigits } from "@/lib/jalaali";
import { fromApiDateString } from "@/lib/date";
import type { InformationRead, StaffDetail } from "@/types";

function formatJalaliShort(iso: string | null): string {
  const date = fromApiDateString(iso);
  if (!date) return "—";
  return toPersianDigits(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
}

function InformationNode({ info, depth = 0 }: { info: InformationRead; depth?: number }) {
  return (
    <div className={depth > 0 ? "mr-4 border-r-2 border-gold/20 pr-4" : ""}>
      <div className="rounded-xl border border-cream/10 bg-deep-2/40 p-4">
        <p className="text-sm font-bold text-cream">{info.title}</p>
        {info.text && <p className="mt-1 text-xs text-cream/55">{info.text}</p>}
        {info.file && (
          <a
            href={info.file}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-gold hover:underline"
          >
            مشاهده فایل پیوست
          </a>
        )}
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

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-cream/35">{label}</p>
      <p className="mt-0.5 text-sm text-cream/85">{value || "—"}</p>
    </div>
  );
}

export default function StaffDetailView({ staff }: { staff: StaffDetail }) {
  const { user } = staff;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.username} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/[0.06] text-xl text-cream/40">
              {user.first_name?.[0] ?? user.username[0]}
            </span>
          )}
          <div>
            <h1 className="text-lg font-bold text-cream">
              {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
            </h1>
            <p className="text-sm text-cream/45">{staff.position}</p>
            <div className="mt-1.5">
              <RoleBadges roles={staff.roles} />
            </div>
          </div>
        </div>

        <Link
          href={`/staff/${staff.id}/edit`}
          className="flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
        >
          <FiEdit2 aria-hidden="true" />
          ویرایش
        </Link>
      </div>

      <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5">
        <h2 className="mb-4 text-sm font-bold text-cream">اطلاعات استخدامی</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="کد پرسنلی" value={toPersianDigits(staff.employee_code)} />
          <Field label="سمت" value={staff.position} />
          <Field label="تاریخ استخدام" value={formatJalaliShort(staff.hire_date)} />
        </div>
      </section>

      <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5">
        <h2 className="mb-4 text-sm font-bold text-cream">اطلاعات تماس</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <FiPhone className="text-gold" aria-hidden="true" />
            <Field label="موبایل" value={toPersianDigits(user.phone_number)} />
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-gold" aria-hidden="true" />
            <Field label="ایمیل" value={user.email} />
          </div>
          <Field label="تلفن ثابت" value={user.land_line ? toPersianDigits(user.land_line) : null} />
        </div>
      </section>

      <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5">
        <h2 className="mb-4 text-sm font-bold text-cream">اطلاعات شخصی</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="تاریخ تولد" value={formatJalaliShort(user.birth_date)} />
          <Field label="مدرک تحصیلی" value={user.degree} />
          <Field label="شغل" value={user.job} />
          <Field label="رشته‌ی ورزشی" value={user.sport_discipline} />
          <Field label="کد معرف" value={user.referral_code} />
          <Field label="دانشجو" value={user.is_student ? "بله" : "خیر"} />
        </div>
        {user.professional_background && (
          <div className="mt-4">
            <p className="text-xs text-cream/35">سوابق حرفه‌ای</p>
            <p className="mt-1 text-sm leading-relaxed text-cream/70">{user.professional_background}</p>
          </div>
        )}
        {user.bio && (
          <div className="mt-4">
            <p className="text-xs text-cream/35">بیوگرافی</p>
            <p className="mt-1 text-sm leading-relaxed text-cream/70">{user.bio}</p>
          </div>
        )}
      </section>

      {user.address && (
        <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-cream">
            <FiMapPin className="text-gold" aria-hidden="true" />
            آدرس
          </h2>
          <p className="text-sm text-cream/70">
            {user.address.country}، {user.address.province}، {user.address.city} — {user.address.street}
          </p>
          {user.address.description && <p className="mt-1 text-xs text-cream/45">{user.address.description}</p>}
        </section>
      )}

      {user.club && (
        <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5">
          <h2 className="mb-4 text-sm font-bold text-cream">باشگاه</h2>
          <p className="text-sm text-cream/85">{user.club.name}</p>
          <p className="mt-1 text-xs text-cream/45">
            {user.club.address.country}، {user.club.address.province}، {user.club.address.city}
          </p>
        </section>
      )}

      {user.informations.length > 0 && (
        <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5">
          <h2 className="mb-4 text-sm font-bold text-cream">اطلاعات تکمیلی</h2>
          <div className="flex flex-col gap-3">
            {user.informations.map((info) => (
              <InformationNode key={info.id} info={info} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
