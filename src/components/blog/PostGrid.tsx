import type { ReactNode } from "react";

type PostGridProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function PostGrid({ children, className, id }: PostGridProps) {
  return (
    <div id={id} className={["listing-grid", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
