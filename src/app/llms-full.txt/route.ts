import {
  GET_AUTHORS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
  GET_TAGS_QUERY,
} from "@/graphql/queries";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { isWordPressConfigured } from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type {
  WpAuthorsQuery,
  WpCategoriesQuery,
  WpPagesQuery,
  WpPostsQuery,
  WpTagsQuery,
} from "@/types/wp";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = getAllServices();
  let pageLines: string[] = [];
  let authorLines: string[] = [];
  let categoryLines: string[] = [];
  let tagLines: string[] = [];
  let postLines: string[] = [];

  if (isWordPressConfigured()) {
    const [pagesResult, authorsResult, categoriesResult, tagsResult, postsResult] =
      await Promise.allSettled([
        wpFetch<WpPagesQuery>({
          query: GET_PAGES_QUERY,
          variables: { first: 100 },
          tags: ["wp:pages"],
          revalidate: 30,
        }),
        wpFetch<WpAuthorsQuery>({
          query: GET_AUTHORS_QUERY,
          variables: { first: 100 },
          tags: ["wp:authors"],
          revalidate: 30,
        }),
        wpFetch<WpCategoriesQuery>({
          query: GET_CATEGORIES_QUERY,
          variables: { first: 100 },
          tags: ["wp:categories"],
          revalidate: 30,
        }),
        wpFetch<WpTagsQuery>({
          query: GET_TAGS_QUERY,
          variables: { first: 100 },
          tags: ["wp:tags"],
          revalidate: 30,
        }),
        wpFetch<WpPostsQuery>({
          query: GET_POSTS_QUERY,
          variables: { first: 100 },
          tags: ["wp:posts"],
          revalidate: 30,
        }),
      ]);

    const pagesResponse = pagesResult.status === "fulfilled" ? pagesResult.value : null;
    const authorsResponse = authorsResult.status === "fulfilled" ? authorsResult.value : null;
    const categoriesResponse =
      categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
    const tagsResponse = tagsResult.status === "fulfilled" ? tagsResult.value : null;
    const postsResponse = postsResult.status === "fulfilled" ? postsResult.value : null;

    pageLines = (pagesResponse?.pages?.nodes ?? [])
      .filter((page) => page.slug && page.slug !== "home" && page.slug !== "blog")
      .map((page) => `- ${page.title ?? page.slug} | ${buildSiteUrl(`/${page.slug}`)}`);

    authorLines = (authorsResponse?.users?.nodes ?? [])
      .filter((author) => author.slug && author.name)
      .map(
        (author) =>
          `- ${author.name} | Equipe editorial | ${buildSiteUrl(`/blog/autor/${author.slug}`)}`,
      );

    categoryLines = (categoriesResponse?.categories?.nodes ?? [])
      .filter((category) => category.slug && category.name)
      .map(
        (category) =>
          `- ${category.name} | ${category.description ?? ""} | ${buildSiteUrl(`/blog/categoria/${category.slug}`)}`,
      );

    tagLines = (tagsResponse?.tags?.nodes ?? [])
      .filter((tag) => tag.slug && tag.name)
      .map(
        (tag) =>
          `- ${tag.name} | ${tag.description ?? ""} | ${buildSiteUrl(`/blog/tag/${tag.slug}`)}`,
      );

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
    "Categories:",
    ...categoryLines,
    "",
    "Tags:",
    ...tagLines,
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
