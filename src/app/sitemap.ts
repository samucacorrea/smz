import type { MetadataRoute } from "next";
import {
  GET_AUTHORS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_PAGES_QUERY,
  GET_POSTS_QUERY,
  GET_TAGS_QUERY,
} from "@/graphql/queries";
import { mockContent } from "@/lib/mock-data";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteOrigin = getSiteOrigin();

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
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: buildSiteUrl("/busca"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  if (isWordPressConfigured()) {
    try {
      const [postsResponse, categoriesResponse, tagsResponse, authorsResponse, pagesResponse] =
        await Promise.all([
          wpFetch<WpPostsQuery>({
            query: GET_POSTS_QUERY,
            variables: { first: 100 },
            tags: ["wp:posts"],
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
          wpFetch<WpAuthorsQuery>({
            query: GET_AUTHORS_QUERY,
            variables: { first: 100 },
            tags: ["wp:authors"],
            revalidate: 300,
          }),
          wpFetch<WpPagesQuery>({
            query: GET_PAGES_QUERY,
            variables: { first: 100 },
            tags: ["wp:pages"],
            revalidate: 300,
          }),
        ]);

      const postRoutes: MetadataRoute.Sitemap = (postsResponse.posts?.nodes ?? [])
        .filter((post) => Boolean(post.slug))
        .map((post) => ({
          url: buildSiteUrl(`/blog/${post.slug}`),
          lastModified: new Date(post.modified ?? post.date ?? now.toISOString()),
          changeFrequency: "monthly",
          priority: 0.8,
        }));

      const categoryRoutes: MetadataRoute.Sitemap = (categoriesResponse.categories?.nodes ?? [])
        .filter((category) => Boolean(category.slug))
        .map((category) => ({
          url: buildSiteUrl(`/blog/categoria/${category.slug}`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        }));

      const tagRoutes: MetadataRoute.Sitemap = (tagsResponse.tags?.nodes ?? [])
        .filter((tag) => Boolean(tag.slug))
        .map((tag) => ({
          url: buildSiteUrl(`/blog/tag/${tag.slug}`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        }));

      const authorRoutes: MetadataRoute.Sitemap = (authorsResponse.users?.nodes ?? [])
        .filter((author) => Boolean(author.slug))
        .map((author) => ({
          url: buildSiteUrl(`/blog/autor/${author.slug}`),
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        }));

      const pageRoutes: MetadataRoute.Sitemap = (pagesResponse.pages?.nodes ?? [])
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
    } catch {
      // Fall back to mock sitemap in local/dev scenarios.
    }
  }

  const postRoutes: MetadataRoute.Sitemap = mockContent.posts.map((post) => ({
    url: post.seo.canonical,
    lastModified: new Date(post.modified),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = mockContent.categories.map((category) => ({
    url: category.seo.canonical,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const tagRoutes: MetadataRoute.Sitemap = mockContent.tags.map((tag) => ({
    url: tag.seo.canonical,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const authorRoutes: MetadataRoute.Sitemap = mockContent.authors.map((author) => ({
    url: author.seo.canonical,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...postRoutes,
    ...categoryRoutes,
    ...tagRoutes,
    ...authorRoutes,
  ];
}
