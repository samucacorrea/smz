import { mockContent } from "@/lib/mock-data";

export function GET() {
  const lines = [
    "# SMZ Full Index",
    "",
    "> Inventario completo em texto para agentes e sistemas de recuperacao.",
    "",
    "Site:",
    `- ${mockContent.home.seo.canonical}`,
    "",
    "Blog root:",
    `- ${mockContent.seo.blog.canonical}`,
    "",
    "Authors:",
    ...mockContent.authors.map(
      (author) => `- ${author.name} | ${author.role} | ${author.seo.canonical}`,
    ),
    "",
    "Categories:",
    ...mockContent.categories.map(
      (category) => `- ${category.name} | ${category.description} | ${category.seo.canonical}`,
    ),
    "",
    "Tags:",
    ...mockContent.tags.map(
      (tag) => `- ${tag.name} | ${tag.description} | ${tag.seo.canonical}`,
    ),
    "",
    "Posts:",
    ...mockContent.posts.map(
      (post) =>
        `- ${post.title} | ${post.date} | ${post.readingTime} | ${post.seo.canonical}`,
    ),
    "",
    "Search endpoint:",
    "- https://ag.smz/busca?q={termo}",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
