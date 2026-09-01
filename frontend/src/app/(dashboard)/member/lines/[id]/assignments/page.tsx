"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMemberAssignments } from "@/hooks/useAssignment";
import Link from "next/link";
import { FiSearch, FiFileText, FiChevronLeft } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { formatJalaliDateTime } from "@/lib/jalaali";

export default function MemberAssignmentListPage() {
  const params = useParams();
  const router = useRouter();
  const lineId = params.lineId as string;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 400);

  const { data, isLoading } = useMemberAssignments(lineId, {
    search: debouncedSearch,
    page,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-cream">تکالیف من</h1>
            <p className="text-cream/40 text-sm mt-1">
              {data?.pagination?.count ?? 0} تکلیف در این لاین
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30" size={15} />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="جستجو در عنوان تکالیف..."
          className="w-full rounded-xl border border-cream/10 bg-cream/5 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
      </div>

      {/* List */}
      <div className="rounded-2xl border border-cream/10 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-cream/30 text-sm">در حال بارگذاری...</div>
        ) : data?.results?.length === 0 ? (
          <div className="text-center py-12 text-cream/30 text-sm">تکلیفی برای شما تعریف نشده است.</div>
        ) : (
          <div className="divide-y divide-cream/5">
            {data?.results?.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/member/lines/${lineId}/assignments/${assignment.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-cream/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
                    <FiFileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-cream font-medium text-sm">{assignment.title}</h3>
                    <p className="text-cream/40 text-xs mt-1">
                      {formatJalaliDateTime(new Date(assignment.created_at))}
                    </p>
                  </div>
                </div>
                <FiChevronLeft className="text-cream/20 group-hover:text-gold transition-colors" size={16} />
              </Link>
            ))}
          </div>
        )}
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
    </div>
  );
}