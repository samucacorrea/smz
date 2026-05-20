export type SeoData = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type AuthorSocialLink = {
  label: string;
  href: string;
};

export type Author = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  role: string;
  shortBio: string;
  longBio: string[];
  expertise: string[];
  stats: Array<{
    label: string;
    value: string;
    footnote: string;
  }>;
  quote?: {
    text: string;
    attribution: string;
  };
  socials: AuthorSocialLink[];
  seo: SeoData;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  seo: SeoData;
};

export type Tag = {
  id: string;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  categorySlug?: string;
  seo: SeoData;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  readingTime: string;
  authorSlug: string;
  categorySlugs: string[];
  tagSlugs: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredArtKey?: string;
  seo: SeoData;
  faq?: FaqItem[];
  relatedPostSlugs: string[];
};

export type HomeSection = {
  id: string;
  type:
    | "hero"
    | "services"
    | "results"
    | "testimonials"
    | "faq"
    | "cta"
    | "blog";
  title?: string;
  description?: string;
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonUrl: string;
  heroImage?: string;
  sections: HomeSection[];
  services: string[];
  testimonials: string[];
  faq: FaqItem[];
  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaButtonText: string;
  finalCtaButtonUrl: string;
  seo: SeoData;
};

export type SearchResultType = "post" | "case" | "servico" | "categoria";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  href: string;
  snippet: string;
  breadcrumb: string[];
  meta: string[];
};
