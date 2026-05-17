import {
  GET_AUTHORS_QUERY,
  GET_CATEGORIES_QUERY,
} from "@/graphql/queries";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { isWordPressConfigured } from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpAuthorsQuery, WpCategoriesQuery } from "@/types/wp";

export async function GET() {
  let categoryLines: string[] = [];
  let authorLines: string[] = [];

  if (isWordPressConfigured()) {
    try {
      const [categoriesResponse, authorsResponse] = await Promise.all([
        wpFetch<WpCategoriesQuery>({
          query: GET_CATEGORIES_QUERY,
          variables: { first: 20 },
          tags: ["wp:categories"],
          revalidate: 300,
        }),
        wpFetch<WpAuthorsQuery>({
          query: GET_AUTHORS_QUERY,
          variables: { first: 20 },
          tags: ["wp:authors"],
          revalidate: 300,
        }),
      ]);

      categoryLines = (categoriesResponse.categories?.nodes ?? [])
        .filter((category) => category.slug)
        .map((category) => `- Category: ${buildSiteUrl(`/blog/categoria/${category.slug}`)}`);

      authorLines = (authorsResponse.users?.nodes ?? [])
        .filter((author) => author.slug)
        .map((author) => `- Author: ${buildSiteUrl(`/blog/autor/${author.slug}`)}`);
    } catch {
      categoryLines = [];
      authorLines = [];
    }
  }

  const lines = [
    "# SMZ",
    "",
    "> Agencia de marketing focada em resultado, operacao e crescimento.",
    "",
    `Site: ${buildSiteUrl("/")}`,
    `Blog: ${buildSiteUrl("/blog")}`,
    `Search: ${buildSiteUrl("/busca")}`,
    "",
    "Key sections:",
    `- Home: ${getHomeSeo().canonical}`,
    `- Blog: ${getBlogSeo().canonical}`,
    ...categoryLines,
    ...authorLines,
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
