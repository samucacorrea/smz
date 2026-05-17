import {
  GET_AUTHORS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
  GET_TAGS_QUERY,
} from "@/graphql/queries";
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

export async function GET() {
  let pageLines: string[] = [];
  let authorLines: string[] = [];
  let categoryLines: string[] = [];
  let tagLines: string[] = [];
  let postLines: string[] = [];

  if (isWordPressConfigured()) {
    try {
      const [pagesResponse, authorsResponse, categoriesResponse, tagsResponse, postsResponse] =
        await Promise.all([
          wpFetch<WpPagesQuery>({
            query: GET_PAGES_QUERY,
            variables: { first: 100 },
            tags: ["wp:pages"],
            revalidate: 300,
          }),
          wpFetch<WpAuthorsQuery>({
            query: GET_AUTHORS_QUERY,
            variables: { first: 100 },
            tags: ["wp:authors"],
            revalidate: 300,
          }),
          wpFetch<WpCategoriesQuery>({
            query: GET_CATEGORIES_QUERY,
            variables: { first: 100 },
            tags: ["wp:categories"],
            revalidate: 300,
          }),
          wpFetch<WpTagsQuery>({
            query: GET_TAGS_QUERY,
            variables: { first: 100 },
            tags: ["wp:tags"],
            revalidate: 300,
          }),
          wpFetch<WpPostsQuery>({
            query: GET_POSTS_QUERY,
            variables: { first: 100 },
            tags: ["wp:posts"],
            revalidate: 300,
          }),
        ]);

      pageLines = (pagesResponse.pages?.nodes ?? [])
        .filter((page) => page.slug && page.slug !== "home" && page.slug !== "blog")
        .map((page) => `- ${page.title ?? page.slug} | ${buildSiteUrl(`/${page.slug}`)}`);

      authorLines = (authorsResponse.users?.nodes ?? [])
        .filter((author) => author.slug && author.name)
        .map(
          (author) =>
            `- ${author.name} | Equipe editorial | ${buildSiteUrl(`/blog/autor/${author.slug}`)}`,
        );

      categoryLines = (categoriesResponse.categories?.nodes ?? [])
        .filter((category) => category.slug && category.name)
        .map(
          (category) =>
            `- ${category.name} | ${category.description ?? ""} | ${buildSiteUrl(`/blog/categoria/${category.slug}`)}`,
        );

      tagLines = (tagsResponse.tags?.nodes ?? [])
        .filter((tag) => tag.slug && tag.name)
        .map(
          (tag) =>
            `- ${tag.name} | ${tag.description ?? ""} | ${buildSiteUrl(`/blog/tag/${tag.slug}`)}`,
        );

      postLines = (postsResponse.posts?.nodes ?? [])
        .filter((post) => post.slug && post.title && post.date)
        .map(
          (post) =>
            `- ${post.title} | ${post.date} | ${buildSiteUrl(`/blog/${post.slug}`)}`,
        );
    } catch {
      pageLines = [];
      authorLines = [];
      categoryLines = [];
      tagLines = [];
      postLines = [];
    }
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
