"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export default function Pagination({
  page,
  total,
  onPage,
  pageSize = 10,
}: {
  page: number;
  total: number;
  onPage: (page: number) => void;
  pageSize?: number;
}) {
  const { t } = useLanguage();
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      let start = Math.max(2, page - delta);
      let end = Math.min(totalPages - 1, page + delta);

      if (start > 2) {
        range.push("...");
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < totalPages - 1) {
        range.push("...");
      }

      range.push(totalPages);
    }

    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(1)}
          disabled={!hasPrev}
          className="btn bg-white/70 text-ink disabled:cursor-not-allowed disabled:opacity-30"
          title={t("pagination.first")}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPage(page - 1)}
          disabled={!hasPrev}
          className="btn bg-white/70 text-ink disabled:cursor-not-allowed disabled:opacity-30"
          title={t("pagination.previous")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {visiblePages.map((pageNum, idx) => {
            if (pageNum === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-ink/40">
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPage(pageNum as number)}
                className={`btn min-w-[40px] ${
                  pageNum === page ? "bg-ink text-white" : "bg-white/70 text-ink hover:bg-white"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPage(page + 1)}
          disabled={!hasNext}
          className="btn bg-white/70 text-ink disabled:cursor-not-allowed disabled:opacity-30"
          title={t("pagination.next")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPage(totalPages)}
          disabled={!hasNext}
          className="btn bg-white/70 text-ink disabled:cursor-not-allowed disabled:opacity-30"
          title={t("pagination.last")}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-ink/60">
        {t("common.page")} {page} {t("common.of")} {totalPages} · {total} {t("pagination.total")}
      </p>
    </div>
  );
}
