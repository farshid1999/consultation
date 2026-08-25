"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiUsers, FiGrid, FiLogOut } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useAuth";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: FiGrid },
  { href: "/admin/users", label: "کاربران", icon: FiUsers },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.replace("/login"),
    });
  };

  return (
    <aside className="w-60 shrink-0 border-l border-cream/10 bg-cream/[0.03] flex flex-col">
      <div className="px-6 py-6 border-b border-cream/10">
        <p className="text-gold font-semibold text-sm">پنل مدیریت</p>
        <p className="text-cream/40 text-xs mt-0.5">سفیران اوج آرامش</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
              pathname === href
                ? "bg-gold/10 text-gold font-medium"
                : "text-cream/50 hover:text-cream hover:bg-cream/5"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-cream/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/50 hover:text-red-400 hover:bg-red-400/5 transition-colors w-full"
        >
          <FiLogOut size={16} />
          خروج
        </button>
      </div>
    </aside>
  );
}