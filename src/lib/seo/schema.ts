import { getSiteSeo } from "@/lib/site";
import type { Author, Category, Post, SeoData, Tag } from "@/types/content";

type BreadcrumbItem = {
  name: string;
  url?: string;
};

type SiteNavigationItem = {
  name: string;
  url: string;
};

type CollectionPageInput = {
  seo: SeoData;
  name: string;
  description: string;
};

type WebPageSchemaInput = {
  seo: SeoData;
  name: string;
  description: string;
  type?: string | string[];
};

type ItemListInput = {
  id: string;
  name: string;
  items: Array<{
    name: string;
    url: string;
  }>;
};

type ServiceSchemaInput = {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  url: string;
  image?: string;
};

type FaqSchemaInput = Array<{
  question: string;
  answer: string;
}>;

const siteSeo = getSiteSeo();

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteSeo.canonical}#organization`,
    name: "SMZ",
    url: siteSeo.canonical,
    logo: `${siteSeo.canonical}assets/logos/logo-dark.png`,
    description: siteSeo.description,
    sameAs: ["https://instagram.com/smz.agency"],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteSeo.canonical}#website`,
    url: siteSeo.canonical,
    name: "SMZ",
    alternateName: "SMZ Agency",
    description: siteSeo.description,
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${siteSeo.canonical}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteSeo.canonical}busca?q={search_term_string}`,
      },
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

export function buildSiteNavigationSchema(items: SiteNavigationItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteSeo.canonical}#primary-navigation`,
    name: "Navegação principal",
    itemListElement: items.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildWebPageSchema({
  seo,
  name,
  description,
  type = "WebPage",
}: WebPageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${seo.canonical}#webpage`,
    url: seo.canonical,
    name,
    description,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": `${siteSeo.canonical}#website`,
    },
    about: {
      "@id": `${siteSeo.canonical}#organization`,
    },
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
    inLanguage: "pt-BR",
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
    image: author.avatarUrl,
    jobTitle: author.role,
    url: author.seo.canonical,
    knowsAbout: author.expertise.length ? author.expertise : undefined,
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
  const image = post.featuredImage || post.seo.ogImage;

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
    image: image ? [image] : undefined,
    articleSection: primaryTerm.name,
    keywords: post.tagSlugs.join(", "),
  };
}

export function buildServiceSchema({
  id,
  name,
  description,
  serviceType,
  url,
  image,
}: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": id,
    name,
    description,
    serviceType,
    url,
    image,
    provider: {
      "@id": `${siteSeo.canonical}#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  };
}

export function buildItemListSchema({ id, name, items }: ItemListInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": id,
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildFaqPageSchema(items: FaqSchemaInput, canonicalUrl?: string) {
  const pageUrl = canonicalUrl || siteSeo.canonical;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": `${siteSeo.canonical}#website`,
    },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
