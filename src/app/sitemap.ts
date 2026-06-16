import type { MetadataRoute } from "next";
import {
  GET_AUTHORS_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
} from "@/graphql/queries";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl, getSiteOrigin } from "@/lib/site";
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

  const [postsResult, authorsResult, pagesResult] = await Promise.allSettled([
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: { first: 100 },
        tags: ["wp:posts"],
        revalidate: DISCOVERY_REVALIDATE_SECONDS,
      }),
      wpFetch<WpAuthorsQuery>({
        query: GET_AUTHORS_QUERY,
        variables: { first: 100 },
        tags: ["wp:authors"],
        revalidate: DISCOVERY_REVALIDATE_SECONDS,
      }),
      wpFetch<WpPagesQuery>({
        query: GET_PAGES_QUERY,
        variables: { first: 100 },
        tags: ["wp:pages"],
        revalidate: DISCOVERY_REVALIDATE_SECONDS,
      }),
    ]);

  const postsResponse = postsResult.status === "fulfilled" ? postsResult.value : null;
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

  const authorRoutes: MetadataRoute.Sitemap = (authorsResponse?.users?.nodes ?? [])
    .filter((author) => Boolean(author.slug) && author.slug === PRIMARY_AUTHOR_SLUG)
    .map((author) => ({
      url: buildSiteUrl(`/blog/autor/${author.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  const fallbackAuthorRoute: MetadataRoute.Sitemap =
    authorRoutes.length > 0
      ? []
      : [
          {
            url: buildSiteUrl(`/blog/autor/${PRIMARY_AUTHOR_SLUG}`),
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.75,
          },
        ];

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
    ...authorRoutes,
    ...fallbackAuthorRoute,
  ];
}
