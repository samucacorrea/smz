"use client";

import type { ReactNode } from "react";

type CopyLinkButtonProps = {
  icon: ReactNode;
  label: string;
  url: string;
};

export function CopyLinkButton({ icon, label, url }: CopyLinkButtonProps) {
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={handleCopyLink}>
      {icon}
    </button>
  );
}
