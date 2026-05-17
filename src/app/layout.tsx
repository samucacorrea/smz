import type { Metadata } from "next";
import { mockContent } from "@/lib/mock-data";
import "@/styles/globals.css";

const siteSeo = mockContent.seo.site;
const siteUrl = new URL(siteSeo.canonical);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteSeo.title,
    template: `%s · ${siteSeo.title}`,
  },
  description: siteSeo.description,
  icons: {
    icon: [
      { url: "/assets/logos/logo-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/assets/logos/logo-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/assets/logos/logo-dark.png" },
    ],
    apple: "/assets/logos/logo-light.png",
    shortcut: "/assets/logos/logo-dark.png",
  },
};

const themeBootstrapScript = `
  (function() {
    const root = document.documentElement;
    const key = "smz-theme";
    const saved = window.localStorage.getItem(key);
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
    } else {
      root.setAttribute("data-theme", "dark");
    }
  })();
`;

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
