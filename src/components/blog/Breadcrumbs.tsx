import Link from "next/link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  return (
    <nav
      className={["breadcrumb", className].filter(Boolean).join(" ")}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className={isLast ? "current" : undefined}>{item.label}</span>
            )}
            {!isLast ? <span className="sep">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
