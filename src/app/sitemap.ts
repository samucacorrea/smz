import type { MetadataRoute } from "next";
import {
  GET_AUTHORS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
  GET_TAGS_QUERY,
} from "@/graphql/queries";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl, getSiteOrigin } from "@/lib/site";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteOrigin = getSiteOrigin();
  const services = getAllServices();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: buildSiteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildSiteUrl("/blog"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: buildSiteUrl("/busca"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: buildSiteUrl("/servicos"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...services.map((service) => ({
      url: buildSiteUrl(`/servicos/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  if (!isWordPressConfigured()) {
    return staticRoutes;
  }

  const [postsResult, categoriesResult, tagsResult, authorsResult, pagesResult] =
    await Promise.allSettled([
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: { first: 100 },
        tags: ["wp:posts"],
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
      wpFetch<WpAuthorsQuery>({
        query: GET_AUTHORS_QUERY,
        variables: { first: 100 },
        tags: ["wp:authors"],
        revalidate: 30,
      }),
      wpFetch<WpPagesQuery>({
        query: GET_PAGES_QUERY,
        variables: { first: 100 },
        tags: ["wp:pages"],
        revalidate: 30,
      }),
    ]);

  const postsResponse = postsResult.status === "fulfilled" ? postsResult.value : null;
  const categoriesResponse = categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const tagsResponse = tagsResult.status === "fulfilled" ? tagsResult.value : null;
  const authorsResponse = authorsResult.status === "fulfilled" ? authorsResult.value : null;
  const pagesResponse = pagesResult.status === "fulfilled" ? pagesResult.value : null;

  const postRoutes: MetadataRoute.Sitemap = (postsResponse?.posts?.nodes ?? [])
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: buildSiteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.modified ?? post.date ?? now.toISOString()),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = (categoriesResponse?.categories?.nodes ?? [])
    .filter((category) => Boolean(category.slug))
    .map((category) => ({
      url: buildSiteUrl(`/blog/categoria/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const tagRoutes: MetadataRoute.Sitemap = (tagsResponse?.tags?.nodes ?? [])
    .filter((tag) => Boolean(tag.slug))
    .map((tag) => ({
      url: buildSiteUrl(`/blog/tag/${tag.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const authorRoutes: MetadataRoute.Sitemap = (authorsResponse?.users?.nodes ?? [])
    .filter((author) => Boolean(author.slug))
    .map((author) => ({
      url: buildSiteUrl(`/blog/autor/${author.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const pageRoutes: MetadataRoute.Sitemap = (pagesResponse?.pages?.nodes ?? [])
    .filter((page) => Boolean(page.slug) && page.slug !== "home" && page.slug !== "blog")
    .map((page) => ({
      url: `${siteOrigin}/${page.slug}`,
      lastModified: new Date(page.modified ?? now.toISOString()),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...postRoutes,
    ...categoryRoutes,
    ...tagRoutes,
    ...authorRoutes,
  ];
}
