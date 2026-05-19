import {
  GET_AUTHORS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
} from "@/graphql/queries";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { isWordPressConfigured } from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpAuthorsQuery, WpCategoriesQuery, WpPagesQuery, WpPostsQuery } from "@/types/wp";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = getAllServices();
  let categoryLines: string[] = [];
  let authorLines: string[] = [];
  let pageLines: string[] = [];
  let postLines: string[] = [];

  if (isWordPressConfigured()) {
    const [categoriesResult, authorsResult, pagesResult, postsResult] = await Promise.allSettled([
      wpFetch<WpCategoriesQuery>({
        query: GET_CATEGORIES_QUERY,
        variables: { first: 20 },
        tags: ["wp:categories"],
        revalidate: 30,
      }),
      wpFetch<WpAuthorsQuery>({
        query: GET_AUTHORS_QUERY,
        variables: { first: 20 },
        tags: ["wp:authors"],
        revalidate: 30,
      }),
      wpFetch<WpPagesQuery>({
        query: GET_PAGES_QUERY,
        variables: { first: 50 },
        tags: ["wp:pages"],
        revalidate: 30,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: { first: 50 },
        tags: ["wp:posts"],
        revalidate: 30,
      }),
    ]);

    const categoriesResponse =
      categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
    const authorsResponse = authorsResult.status === "fulfilled" ? authorsResult.value : null;
    const pagesResponse = pagesResult.status === "fulfilled" ? pagesResult.value : null;
    const postsResponse = postsResult.status === "fulfilled" ? postsResult.value : null;

    categoryLines = (categoriesResponse?.categories?.nodes ?? [])
      .filter((category) => category.slug)
      .map((category) => `- Category: ${buildSiteUrl(`/blog/categoria/${category.slug}`)}`);

    authorLines = (authorsResponse?.users?.nodes ?? [])
      .filter((author) => author.slug)
      .map((author) => `- Author: ${buildSiteUrl(`/blog/autor/${author.slug}`)}`);

    pageLines = (pagesResponse?.pages?.nodes ?? [])
      .filter((page) => page.slug && page.slug !== "home" && page.slug !== "blog")
      .map((page) => `- Page: ${buildSiteUrl(`/${page.slug}`)}`);

    postLines = (postsResponse?.posts?.nodes ?? [])
      .filter((post) => post.slug)
      .map((post) => `- Post: ${buildSiteUrl(`/blog/${post.slug}`)}`);
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
    `- Services: ${buildSiteUrl("/servicos")}`,
    ...services.map((service) => `- Service: ${buildSiteUrl(`/servicos/${service.slug}`)}`),
    ...pageLines,
    ...postLines,
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
