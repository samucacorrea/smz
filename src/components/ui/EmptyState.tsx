import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  glyph?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function EmptyState({
  actions,
  className,
  description,
  glyph,
  title,
}: EmptyStateProps) {
  return (
    <div className={["search-empty", className].filter(Boolean).join(" ")}>
      {glyph ? <div className="empty-glyph">{glyph}</div> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {actions ? <div className="suggest-row">{actions}</div> : null}
    </div>
  );
}
