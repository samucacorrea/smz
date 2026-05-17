import type { Metadata } from "next";
import type { SeoData } from "@/types/content";

type BuildMetadataOptions = {
  type?: "website" | "article" | "profile";
};

export function buildPageMetadata(
  seo: SeoData,
  options: BuildMetadataOptions = {},
): Metadata {
  const { type = "website" } = options;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      type,
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: seo.ogImage ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}
