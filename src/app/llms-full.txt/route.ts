import {
  GET_AUTHORS_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
} from "@/graphql/queries";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { isWordPressConfigured } from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type {
  WpAuthorsQuery,
  WpPagesQuery,
  WpPostsQuery,
} from "@/types/wp";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const DISCOVERY_REVALIDATE_SECONDS = 10;
const PRIMARY_AUTHOR_SLUG = "samuel-correa";

export async function GET() {
  const services = getAllServices();
  let pageLines: string[] = [];
  let authorLines: string[] = [];
  let postLines: string[] = [];

  if (isWordPressConfigured()) {
    const [pagesResult, authorsResult, postsResult] = await Promise.allSettled([
        wpFetch<WpPagesQuery>({
          query: GET_PAGES_QUERY,
          variables: { first: 100 },
          tags: ["wp:pages"],
          revalidate: DISCOVERY_REVALIDATE_SECONDS,
        }),
        wpFetch<WpAuthorsQuery>({
          query: GET_AUTHORS_QUERY,
          variables: { first: 100 },
          tags: ["wp:authors"],
          revalidate: DISCOVERY_REVALIDATE_SECONDS,
        }),
        wpFetch<WpPostsQuery>({
          query: GET_POSTS_QUERY,
          variables: { first: 100 },
          tags: ["wp:posts"],
          revalidate: DISCOVERY_REVALIDATE_SECONDS,
        }),
      ]);

    const pagesResponse = pagesResult.status === "fulfilled" ? pagesResult.value : null;
    const authorsResponse = authorsResult.status === "fulfilled" ? authorsResult.value : null;
    const postsResponse = postsResult.status === "fulfilled" ? postsResult.value : null;

    pageLines = (pagesResponse?.pages?.nodes ?? [])
      .filter((page) => page.slug && page.slug !== "home" && page.slug !== "blog")
      .map((page) => `- ${page.title ?? page.slug} | ${buildSiteUrl(`/${page.slug}`)}`);

    authorLines = (authorsResponse?.users?.nodes ?? [])
      .filter((author) => author.slug === PRIMARY_AUTHOR_SLUG && author.name)
      .map(
        (author) =>
          `- ${author.name} | Equipe editorial | ${buildSiteUrl(`/blog/autor/${author.slug}`)}`,
      );

    if (authorLines.length === 0) {
      authorLines = [
        `- Samuel Correa | Equipe editorial | ${buildSiteUrl(`/blog/autor/${PRIMARY_AUTHOR_SLUG}`)}`,
      ];
    }

    postLines = (postsResponse?.posts?.nodes ?? [])
      .filter((post) => post.slug && post.title && post.date)
      .map((post) => `- ${post.title} | ${post.date} | ${buildSiteUrl(`/blog/${post.slug}`)}`);
  }

  const lines = [
    "# SMZ Full Index",
    "",
    "> Inventario completo em texto para agentes e sistemas de recuperacao.",
    "",
    "Site:",
    `- ${getHomeSeo().canonical}`,
    "",
    "Blog root:",
    `- ${getBlogSeo().canonical}`,
    "",
    "Services:",
    `- Index | ${buildSiteUrl("/servicos")}`,
    ...services.map(
      (service) =>
        `- ${service.navLabel} | ${service.serviceType} | ${buildSiteUrl(`/servicos/${service.slug}`)}`,
    ),
    "",
    "Pages:",
    ...pageLines,
    "",
    "Authors:",
    ...authorLines,
    "",
    "Posts:",
    ...postLines,
    "",
    "Search endpoint:",
    `- ${buildSiteUrl("/busca")}?q={termo}`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
