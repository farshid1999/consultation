import type { UserRole } from "@/types/role";

export default function RoleBadges({ roles }: { roles: UserRole[] }) {
  if (roles.length === 0) {
    return <span className="text-xs text-cream/30">بدون نقش</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((userRole) => (
        <span
          key={userRole.id}
          className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[0.7rem] text-gold"
        >
          {userRole.role.name}
        </span>
      ))}
    </div>
  );
}
