"use client";

import {useState} from "react";
import {FiSearch, FiX, FiCheck} from "react-icons/fi";
import {useStaffList} from "@/hooks/useStaff"; // هوک لیست کارمندان
import type {StaffListItem} from "@/types";
import type {StaffLine} from "@/types";
import {cn} from "@/lib/utils";

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    lineId: string | number;
    currentStaff: StaffLine[]; // لیست کارمندان فعلی لاین برای فیلتر کردن
    onConfirm: (selectedStaffIds: (string | number)[]) => void;
    isPending: boolean;
}

export default function AddStaffModal({
                                          isOpen,
                                          onClose,
                                          currentStaff,
                                          onConfirm,
                                          isPending,
                                      }: AddStaffModalProps) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    // دریافت لیست کل کارمندان سیستم
    const {data: staffData} = useStaffList({search: search || undefined});
    const allStaff = staffData?.results || [];

    // فیلتر کردن کارمندانی که همین الان عضو این لاین هستند
    const currentStaffIds = new Set(currentStaff.map((s) => s.staff)); // فرض بر اینکه staff ID است یا باید از user.id استفاده شود

    // نکته: در سریالایزر شما staff StringRelatedField بود، اما برای چک کردن تکراری بودن
    // بهتر است از ID استفاده کنیم. اگر در تایپ StaffLine فیلد id_staff یا مشابه ندارید،
    // باید از بک‌اند ID استاف را هم بگیرید. فعلاً فرض می‌کنیم می‌توانیم چک کنیم.
    // اگر StaffLine فقط نام برمی‌گرداند، باید در بک‌اند تغییر دهید تا ID هم بفرستد.
    // برای اطمینان، اینجا فرض می‌کنیم currentStaff آیتم‌هایی با id دارند که همان StaffLine ID است.
    // اما برای چک کردن تکراری بودن، ما نیاز به Staff ID داریم.

    // اصلاح: بیایید فرض کنیم در تایپ StaffLine یک فیلد staff_id هم داریم یا از همان id مدل StaffLine استفاده نمی‌شود.
    // بهترین راه: استفاده از user.id اگر یونیک است.
    const currentStaffUserIds = new Set(currentStaff.map((s) => s.user.id));

    const availableStaff = allStaff.filter(
        (staff) => !currentStaffUserIds.has(staff.user.id)
    );

    const toggleStaff = (staffId: string | number) => {
        setSelectedIds((prev) =>
            prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
        );
    };

    const handleConfirm = () => {
        if (selectedIds.length > 0) {
            onConfirm(selectedIds);
            setSelectedIds([]);
            setSearch("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-lg rounded-3xl border border-cream/10 bg-deep-2 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* هدر مودال */}
                <div className="flex items-center justify-between border-b border-cream/10 p-5 bg-deep">
                    <h3 className="text-lg font-bold text-cream">افزودن کارمند به لاین</h3>
                    <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors">
                        <FiX size={20}/>
                    </button>
                </div>

                {/* جستجو */}
                <div className="p-4 border-b border-cream/10">
                    <div className="relative">
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30"/>
                        <input
                            type="text"
                            placeholder="جست‌وجوی نام، کد پرسنلی یا سمت..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-cream/15 bg-deep/60 py-2.5 pr-10 pl-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
                        />
                    </div>
                </div>

                {/* لیست کارمندان */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {availableStaff.length === 0 ? (
                        <div className="py-8 text-center text-sm text-cream/40">
                            کارمندی برای افزودن یافت نشد.
                        </div>
                    ) : (
                        availableStaff.map((staff) => {
                            const isSelected = selectedIds.includes(staff.id);
                            return (
                                <div
                                    key={staff.id}
                                    onClick={() => toggleStaff(staff.id)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all border",
                                        isSelected
                                            ? "bg-gold/10 border-gold/40"
                                            : "border-transparent hover:bg-cream/[0.04]"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150",
                                        isSelected ? "bg-gold border-gold" : "border-cream/25"
                                    )}>
                                        {isSelected && <FiCheck className="text-xs text-deep"/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-cream">
                                            {staff.user.first_name} {staff.user.last_name}
                                        </p>
                                        <p className="text-xs text-cream/40">{staff.position} |
                                            کد: {staff.employee_code}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* فوتر و دکمه تایید */}
                <div className="border-t border-cream/10 p-4 bg-deep flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors"
                    >
                        انصراف
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isPending || selectedIds.length === 0}
                        className="rounded-xl bg-gradient-to-b from-gold-soft to-gold px-6 py-2 text-sm font-bold text-deep shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "در حال افزودن..." : `افزودن (${selectedIds.length})`}
                    </button>
                </div>

            </div>
        </div>
    );
}