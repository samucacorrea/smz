import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  className?: string;
  showDot?: boolean;
};

export function Chip({ children, className, showDot = false }: ChipProps) {
  return (
    <span className={["chip", className].filter(Boolean).join(" ")}>
      {showDot ? <span className="dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
