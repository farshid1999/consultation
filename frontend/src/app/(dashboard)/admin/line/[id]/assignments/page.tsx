"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useStaffAssignments,
  useDeleteAssignment,
} from "@/hooks/useAssignment";
import Modal from "@/components/ui/modals/Modal";
import Link from "next/link";
import {
  FiArrowRight,
  FiSearch,
  FiEye,
  FiMessageSquare,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useDebounce } from "use-debounce";

export default function StaffAssignmentsPage() {
  const params = useParams();
  const router = useRouter();

  const lineId = params.id as string;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 400);

  const { data, isLoading } = useStaffAssignments(lineId, {
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
        // اگر آخرین آیتم صفحه حذف شد، یک صفحه برگرد عقب
        if (data?.results.length === 1 && page > 1) setPage((p) => p - 1);
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
          >
            <FiArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cream">تکالیف این بخش</h1>
            <p className="text-cream/50 text-sm mt-1">
              {data?.pagination?.count ?? 0} تکلیف تعریف شده
            </p>
          </div>
        </div>

        <Link
          href={`/admin/line/${lineId}/assignments/create`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-deep text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <FiPlus size={15} />
          تکلیف جدید
        </Link>
      </div>

      {/* Search */}
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
          placeholder="جستجو در عنوان تکالیف..."
          className="w-full rounded-xl border border-cream/10 bg-cream/5 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
      </div>

      {/* جدول تکالیف */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                عنوان
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
                  colSpan={3}
                  className="text-center py-12 text-cream/30 text-sm"
                >
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold inline-block"></span>
                </td>
              </tr>
            ) : data?.results?.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-12 text-cream/30 text-sm"
                >
                  تکلیفی برای این بخش تعریف نشده است
                </td>
              </tr>
            ) : (
              data?.results?.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-5 py-4 text-cream font-medium">
                    {assignment.title}
                  </td>
                  <td className="px-5 py-4 text-cream/50 max-w-xs truncate">
                    {assignment.description || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* دکمه مشاهده جزئیات تکلیف */}
                      <Link
                        href={`/admin/line/${lineId}/assignments/${assignment.id}`}
                        className="p-2 rounded-lg text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                        title="جزئیات تکلیف"
                      >
                        <FiEye size={16} />
                      </Link>

                      {/* ✅ دکمه مشاهده پاسخ‌های اعضا */}
                      <Link
                        href={`/admin/line/${lineId}/assignments/${assignment.id}/submissions`}
                        className="p-2 rounded-lg text-cream/40 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                        title="مشاهده پاسخ‌های ارسال شده"
                      >
                        <FiMessageSquare size={16} />
                      </Link>

                      {/* ویرایش */}
                      <Link
                        href={`/admin/line/${lineId}/assignments/${assignment.id}/edit`}
                        className="p-2 rounded-lg text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                        title="ویرایش تکلیف"
                      >
                        <FiEdit2 size={16} />
                      </Link>

                      {/* حذف */}
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
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-cream/60">
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
