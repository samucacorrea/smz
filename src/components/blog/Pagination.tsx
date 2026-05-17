import Link from "next/link";

type PaginationPage = {
  href?: string;
  label: string;
  isCurrent?: boolean;
  isEllipsis?: boolean;
};

type PaginationProps = {
  summary?: string;
  previousHref?: string;
  nextHref?: string;
  pages: PaginationPage[];
};

export function Pagination({
  nextHref,
  pages,
  previousHref,
  summary,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Paginação">
      <span className="small">{summary}</span>
      <div className="pages">
        <PaginationArrow href={previousHref} direction="previous" />
        {pages.map((page) => {
          if (page.isEllipsis) {
            return (
              <span key={page.label} className="page ellipsis">
                {page.label}
              </span>
            );
          }

          return (
            <Link
              key={page.label}
              href={page.href ?? "#"}
              className={["page", page.isCurrent ? "current" : ""].filter(Boolean).join(" ")}
              aria-current={page.isCurrent ? "page" : undefined}
            >
              {page.label}
            </Link>
          );
        })}
        <PaginationArrow href={nextHref} direction="next" />
      </div>
    </nav>
  );
}

type PaginationArrowProps = {
  href?: string;
  direction: "previous" | "next";
};

function PaginationArrow({ direction, href }: PaginationArrowProps) {
  const disabled = !href;

  return (
    <Link
      href={href ?? "#"}
      className="page"
      aria-label={direction === "previous" ? "Anterior" : "Próxima"}
      style={disabled ? { opacity: 0.35, pointerEvents: "none" } : undefined}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "previous" ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </Link>
  );
}
