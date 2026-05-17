import { mockContent } from "@/lib/mock-data";
import type { Author, Category, Post, SeoData, Tag } from "@/types/content";

type BreadcrumbItem = {
  name: string;
  url?: string;
};

type CollectionPageInput = {
  seo: SeoData;
  name: string;
  description: string;
};

const siteSeo = mockContent.seo.site;

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteSeo.canonical}#organization`,
    name: "SMZ",
    url: siteSeo.canonical,
    logo: `${siteSeo.canonical}assets/logos/logo-dark.png`,
    description: siteSeo.description,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteSeo.canonical}#website`,
    url: siteSeo.canonical,
    name: "SMZ",
    description: siteSeo.description,
    publisher: {
      "@id": `${siteSeo.canonical}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteSeo.canonical}busca?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildCollectionPageSchema({
  seo,
  name,
  description,
}: CollectionPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${seo.canonical}#collection`,
    url: seo.canonical,
    name,
    description,
    isPartOf: {
      "@id": `${siteSeo.canonical}#website`,
    },
    publisher: {
      "@id": `${siteSeo.canonical}#organization`,
    },
  };
}

export function buildPersonSchema(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${author.seo.canonical}#person`,
    name: author.name,
    description: author.shortBio,
    jobTitle: author.role,
    url: author.seo.canonical,
    sameAs: author.socials.map((social) => social.href),
    worksFor: {
      "@id": `${siteSeo.canonical}#organization`,
    },
  };
}

export function buildArticleSchema(
  post: Post,
  author: Author,
  primaryTerm: Category | Tag,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${post.seo.canonical}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: post.seo.canonical,
    author: {
      "@id": `${author.seo.canonical}#person`,
    },
    publisher: {
      "@id": `${siteSeo.canonical}#organization`,
    },
    image: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    articleSection: primaryTerm.name,
    keywords: post.tagSlugs.join(", "),
  };
}
