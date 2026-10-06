import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import StaffAvatar from "./StaffAvatar";
import { fullName } from "@/utils/staffUtils";
import type { PublicStaff } from "@/types/publicStaff";

export default function StaffCard({ staff }: { staff: PublicStaff }) {
  return (
    <Link
      href={`/publicStaff/${staff.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-deep-2/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <StaffAvatar
          staff={staff}
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
          <h3 className="text-lg font-extrabold text-cream">{fullName(staff)}</h3>
          <p className="text-sm text-gold">{staff.position}</p>

          {staff.lines.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {staff.lines.slice(0, 2).map((l) => (
                <span key={l.id} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[10px] text-cream/80 backdrop-blur">
                  {l.title}
                </span>
              ))}
              {staff.lines.length > 2 && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-cream/60">
                  +{staff.lines.length - 2}
                </span>
              )}
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 pt-1 text-xs text-cream/50 transition-colors group-hover:text-gold">
            مشاهده‌ی پروفایل
            <FiArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}