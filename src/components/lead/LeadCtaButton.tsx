"use client";

import type { ReactNode } from "react";
import { useLeadCapture } from "@/components/lead/LeadCaptureProvider";

type LeadCtaButtonProps = {
  children: ReactNode;
  className: string;
  source: string;
  ariaLabel?: string;
};

export function LeadCtaButton({
  ariaLabel,
  children,
  className,
  source,
}: LeadCtaButtonProps) {
  const { openLeadModal } = useLeadCapture();

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => openLeadModal(source)}
    >
      {children}
    </button>
  );
}
