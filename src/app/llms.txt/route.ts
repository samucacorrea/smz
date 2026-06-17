import {
  GET_AUTHORS_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
} from "@/graphql/queries";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { isWordPressConfigured } from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpAuthorsQuery, WpPagesQuery, WpPostsQuery } from "@/types/wp";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const DISCOVERY_REVALIDATE_SECONDS = 10;
const PRIMARY_AUTHOR_SLUG = "samuel-correa";

export async function GET() {
  const services = getAllServices();
  let authorLines: string[] = [];
  let pageLines: string[] = [];
  let postLines: string[] = [];

  if (isWordPressConfigured()) {
    const [authorsResult, pagesResult, postsResult] = await Promise.allSettled([
      wpFetch<WpAuthorsQuery>({
        query: GET_AUTHORS_QUERY,
        variables: { first: 20 },
        tags: ["wp:authors"],
        revalidate: DISCOVERY_REVALIDATE_SECONDS,
      }),
      wpFetch<WpPagesQuery>({
        query: GET_PAGES_QUERY,
        variables: { first: 50 },
        tags: ["wp:pages"],
        revalidate: DISCOVERY_REVALIDATE_SECONDS,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: { first: 50 },
        tags: ["wp:posts"],
        revalidate: DISCOVERY_REVALIDATE_SECONDS,
      }),
    ]);

    const authorsResponse = authorsResult.status === "fulfilled" ? authorsResult.value : null;
    const pagesResponse = pagesResult.status === "fulfilled" ? pagesResult.value : null;
    const postsResponse = postsResult.status === "fulfilled" ? postsResult.value : null;

    authorLines = (authorsResponse?.users?.nodes ?? [])
      .filter((author) => author.slug === PRIMARY_AUTHOR_SLUG)
      .map((author) => `- Author: ${buildSiteUrl(`/blog/autor/${author.slug}`)}`);

    if (authorLines.length === 0) {
      authorLines = [`- Author: ${buildSiteUrl(`/blog/autor/${PRIMARY_AUTHOR_SLUG}`)}`];
    }

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
