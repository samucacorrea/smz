import type { MetadataRoute } from "next";
import { mockContent } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: mockContent.home.seo.canonical,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: mockContent.seo.blog.canonical,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://ag.smz/busca",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

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
