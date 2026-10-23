"use client";

import { useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import {
  FiSearch,
  FiEye,
  FiMessageSquare,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import {
  useStaffAllAssignments,
  useDeleteAssignment,
} from "@/hooks/useAssignment";
import Modal from "@/components/ui/modals/Modal";

export default function StaffAllAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 400);

  const { data, isLoading } = useStaffAllAssignments({
    search: debouncedSearch,
    page,
  });

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string | number;
    title: string;
  } | null>(null);

  const {
    mutate: deleteAssignment,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteAssignment();

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    resetDelete();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAssignment(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        if (data?.results.length === 1 && page > 1) setPage((p) => p - 1);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-cream">تکالیف</h1>
        <p className="text-cream/40 text-sm mt-1">
          {data?.pagination?.count ?? 0} تکلیف ثبت‌شده توسط شما
        </p>
        <p className="text-cream/30 text-xs mt-1">
          برای ساخت تکلیف جدید، وارد بخش مورد نظر شوید.
        </p>
      </div>

      <div className="relative max-w-sm">
        <FiSearch
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30"
          size={15}
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="جستجو در عنوان، توضیحات یا بخش..."
          className="w-full rounded-xl border border-cream/10 bg-cream/5 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
      </div>

      <div className="rounded-2xl border border-cream/10 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-cream/10 bg-cream/[0.03]">
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                عنوان
              </th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                بخش
              </th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                توضیحات
              </th>
              <th className="px-5 py-3.5 text-center text-cream/50 font-medium">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-cream/30 text-sm"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            ) : data?.results?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-cream/30 text-sm"
                >
                  تکلیفی یافت نشد
                </td>
              </tr>
            ) : (
              data?.results?.map((assignment) => {
                const base = `/staff/line/${assignment.line_id}/assignments/${assignment.id}`;
                return (
                  <tr
                    key={assignment.id}
                    className="border-b border-cream/5 hover:bg-cream/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 text-cream font-medium">
                      {assignment.title}
                    </td>
                    <td className="px-5 py-4 text-cream/60">
                      {assignment.line}
                    </td>
                    <td className="px-5 py-4 text-cream/50">
                      <div className="max-w-xs truncate">
                        {assignment.description || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={base}
                          className="p-2 rounded-lg text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                          title="جزئیات تکلیف"
                        >
                          <FiEye size={16} />
                        </Link>

                        <Link
                          href={`${base}/submissions`}
                          className="p-2 rounded-lg text-cream/40 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                          title="مشاهده پاسخ‌های ارسال شده"
                        >
                          <FiMessageSquare size={16} />
                        </Link>

                        <Link
                          href={`${base}/edit`}
                          className="p-2 rounded-lg text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                          title="ویرایش تکلیف"
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              id: assignment.id,
                              title: assignment.title,
                            })
                          }
                          className="p-2 rounded-lg text-cream/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="حذف تکلیف"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between text-sm text-cream/60">
          <span>
            صفحه {data.pagination.page} از {data.pagination.pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={!data.pagination.has_previous}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-cream/10 disabled:opacity-30 hover:bg-cream/5 transition-colors"
            >
              قبلی
            </button>
            <button
              disabled={!data.pagination.has_next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-cream/10 disabled:opacity-30 hover:bg-cream/5 transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      {/* مودال تأیید حذف */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={closeDeleteModal}
        title="حذف تکلیف"
      >
        <p className="text-sm text-cream/70 leading-relaxed">
          آیا از حذف تکلیف «{deleteTarget?.title}» مطمئن هستید؟ تمام پاسخ‌های
          ارسال‌شده‌ی اعضا برای این تکلیف هم حذف می‌شود و این کار قابل بازگشت
          نیست.
        </p>

        {deleteError && (
          <p className="mt-3 text-xs text-red-400">
            {(deleteError as any)?.detail ?? "حذف انجام نشد."}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-500/90 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "در حال حذف..." : "بله، حذف شود"}
          </button>
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl border border-cream/20 text-cream/60 text-sm hover:text-cream hover:border-cream/40 transition-colors"
          >
            انصراف
          </button>
        </div>
      </Modal>
    </div>
  );
}
