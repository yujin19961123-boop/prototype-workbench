import { useState } from "react";

import * as P from "@/components/ui/pagination";

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  const go = (event: React.MouseEvent, value: number) => {
    event.preventDefault();
    setPage(Math.max(1, Math.min(8, value)));
  };
  return (
    <div className="w-full space-y-6">
      <P.Pagination>
        <P.PaginationContent>
          <P.PaginationItem>
            <P.PaginationPrevious
              href="#previous"
              className="size-8 px-0 [&>span]:hidden"
              aria-disabled={page === 1}
              onClick={(event) => go(event, page - 1)}
            />
          </P.PaginationItem>
          {[1, 2].map((value) => (
            <P.PaginationItem key={value}>
              <P.PaginationLink
                href={`#page-${value}`}
                isActive={page === value}
                onClick={(event) => go(event, value)}
              >
                {value}
              </P.PaginationLink>
            </P.PaginationItem>
          ))}
          <P.PaginationItem>
            <P.PaginationEllipsis />
          </P.PaginationItem>
          <P.PaginationItem>
            <P.PaginationLink
              href="#page-8"
              isActive={page === 8}
              onClick={(event) => go(event, 8)}
            >
              8
            </P.PaginationLink>
          </P.PaginationItem>
          <P.PaginationItem>
            <P.PaginationNext
              href="#next"
              className="size-8 px-0 [&>span]:hidden"
              aria-disabled={page === 8}
              onClick={(event) => go(event, page + 1)}
            />
          </P.PaginationItem>
        </P.PaginationContent>
      </P.Pagination>
      <p role="status" className="text-center text-xs text-muted-foreground">
        当前第 {page} 页，共 8 页
      </p>
    </div>
  );
}
