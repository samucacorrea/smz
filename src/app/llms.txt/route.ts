import { mockContent } from "@/lib/mock-data";

export function GET() {
  const lines = [
    "# SMZ",
    "",
    "> Agencia de marketing focada em resultado, operacao e crescimento.",
    "",
    "Site: https://ag.smz/",
    "Blog: https://ag.smz/blog",
    "Search: https://ag.smz/busca",
    "",
    "Key sections:",
    `- Home: ${mockContent.home.seo.canonical}`,
    `- Blog: ${mockContent.seo.blog.canonical}`,
    ...mockContent.categories.map((category) => `- Category: ${category.seo.canonical}`),
    ...mockContent.authors.map((author) => `- Author: ${author.seo.canonical}`),
    "",
    "Primary topics:",
    "- IA aplicada ao marketing",
    "- SEO e autoridade topica",
    "- Trafego pago e ROAS",
    "- CRO e conversao",
    "- CRM e automacao",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
