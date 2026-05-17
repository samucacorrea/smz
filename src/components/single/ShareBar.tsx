import type { ReactNode } from "react";
import { CopyLinkButton } from "@/components/single/CopyLinkButton";

type ShareItem = {
  platform: "linkedin" | "x" | "whatsapp" | "copy";
  label: string;
  icon: ReactNode;
};

type ShareBarProps = {
  items: ShareItem[];
  title: string;
  url: string;
};

export function ShareBar({ items, title, url }: ShareBarProps) {
  return (
    <div className="share">
      <p className="share-title">Compartilhar</p>
      <div className="share-row">
        {items.map((item) => {
          if (item.platform === "copy") {
            return (
              <CopyLinkButton
                key={item.label}
                icon={item.icon}
                label={item.label}
                url={url}
              />
            );
          }

          const href = getShareHref(item.platform, url, title);

          return (
            <a
              key={item.label}
              href={href}
              aria-label={item.label}
              title={item.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.icon}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function getShareHref(platform: "linkedin" | "x" | "whatsapp", url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  }
}
