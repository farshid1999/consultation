"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {tokenService} from "@/lib/auth/tokenService";
import "@/styles/light.css"
import StaffSidebar from "@/components/Admin/StaffSidebar";

export default function KineLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        if (!tokenService.isAuthenticated()) {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex" dir="rtl">
            <StaffSidebar/>
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}