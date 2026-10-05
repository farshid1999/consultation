import { fullName, initials, mediaUrl } from "@/utils/staffUtils";
import type { PublicStaff } from "@/types/publicStaff";

export default function StaffAvatar({
  staff,
  className = "",
}: {
  staff: Pick<PublicStaff, "first_name" | "last_name" | "avatar">;
  className?: string;
}) {
  const src = mediaUrl(staff.avatar);
  return src ? (
    <img src={src} alt={fullName(staff)} className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5 font-extrabold text-gold ${className}`}>
      <span className="text-4xl">{initials(staff)}</span>
    </div>
  );
}