import type { Author, Category, Post, SeoData, Tag } from "@/types/content";
import { GET_POST_BY_SLUG_QUERY, GET_POSTS_QUERY } from "@/graphql/queries";
import { buildSiteUrl } from "@/lib/site";
import {
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpPost, WpPostBySlugQuery, WpPostsQuery } from "@/types/wp";

type SingleHeading = {
  href: string;
  label: string;
};

type SingleTag = {
  href: string;
  label: string;
};

type SingleAuthor = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  href: string;
};

type SingleCategory = {
  slug: string;
  name: string;
  href: string;
};

type SingleRelatedPost = {
  href: string;
  category: string;
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
  author: string;
  featuredArtKey?: string;
  slug: string;
};

export type BlogSingleData = {
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  readingTime: string;
  featuredArtKey?: string;
  seo: SeoData;
  author: SingleAuthor;
  primaryCategory: SingleCategory;
  tags: SingleTag[];
  relatedPosts: SingleRelatedPost[];
  headings: SingleHeading[];
  contentHtml: string;
  schemaPost: Post;
  schemaAuthor: Author;
  schemaCategory: Category | Tag;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value: string) {
  return stripHtml(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadingTime(content?: string | null) {
  const plainText = stripHtml(content ?? "");
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));

  return `${minutes} min`;
}

function getInitials(name?: string | null) {
  const parts = (name ?? "SMZ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "SMZ";
}

function deriveArtKey(post: WpPost, categorySlug?: string | null) {
  const slug = post.slug ?? "";

  if (slug.includes("ia") || categorySlug === "ia") return "ia-network";
  if (slug.includes("roi") || slug.includes("roas") || categorySlug === "cases") {
    return "roi-bars";
  }
  if (slug.includes("seo") || categorySlug === "seo") return "seo-bars";
  if (slug.includes("cro") || slug.includes("checkout") || categorySlug === "cro") {
    return "checkout";
  }
  if (slug.includes("crm") || slug.includes("hubspot")) return "crm";
  if (slug.includes("automacao") || slug.includes("n8n")) return "n8n";
  if (slug.includes("planejamento") || categorySlug === "estrategia") return "quarters";
  if (slug.includes("google-ads") || slug.includes("meta-ads")) return "trend-line";

  return undefined;
}

function decorateHeadings(html?: string | null) {
  if (!html) {
    return {
      contentHtml: "",
      headings: [] as SingleHeading[],
    };
  }

  const headings: SingleHeading[] = [];

  const contentHtml = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs, inner) => {
    const label = stripHtml(inner);
    const id = slugify(label);

    headings.push({
      href: `#${id}`,
      label,
    });

    if (/id\s*=/.test(attrs)) {
      return `<h2${attrs}>${inner}</h2>`;
    }

    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });

  return { contentHtml, headings };
}

function mapWpPostToSingleData(post: WpPost, relatedNodes: WpPost[]): BlogSingleData | null {
  if (!post.id || !post.slug || !post.title || !post.date || !post.modified) {
    return null;
  }

  const primaryCategory = post.categories?.nodes?.[0];
  const authorNode = post.author?.node;

  if (!primaryCategory?.slug || !primaryCategory.name || !authorNode?.slug || !authorNode.name) {
    return null;
  }

  const decorated = decorateHeadings(post.content);
  const featuredArtKey = deriveArtKey(post, primaryCategory.slug);
  const seo: SeoData = {
    title: post.seo?.title || stripHtml(post.title),
    description: post.seo?.metaDesc || stripHtml(post.excerpt ?? post.content ?? ""),
    canonical: post.seo?.canonical || buildSiteUrl(`/blog/${post.slug}`),
    ogImage: post.seo?.opengraphImage?.sourceUrl ?? undefined,
  };

  const author: SingleAuthor = {
    slug: authorNode.slug,
    name: authorNode.name,
    initials: getInitials(authorNode.name),
    role: "Equipe editorial",
    bio: authorNode.description?.trim() || "Autor da equipe editorial da SMZ.",
    href: `/blog/autor/${authorNode.slug}`,
  };

  const schemaAuthor: Author = {
    id: authorNode.id,
    slug: author.slug,
    name: author.name,
    initials: author.initials,
    role: author.role,
    shortBio: author.bio,
    longBio: [],
    expertise: [],
    stats: [],
    socials: [],
    seo: {
      title: `${author.name} · SMZ`,
      description: author.bio,
      canonical: buildSiteUrl(`/blog/autor/${author.slug}`),
    },
  };

  const schemaCategory: Category = {
    id: primaryCategory.id,
    slug: primaryCategory.slug,
    name: primaryCategory.name,
    description: primaryCategory.description?.trim() || "",
    articleCount: 0,
    seo: {
      title: primaryCategory.seo?.title || `${primaryCategory.name} · Blog SMZ`,
      description:
        primaryCategory.seo?.metaDesc || primaryCategory.description?.trim() || "",
      canonical: primaryCategory.seo?.canonical || buildSiteUrl(`/blog/categoria/${primaryCategory.slug}`),
      ogImage: primaryCategory.seo?.opengraphImage?.sourceUrl ?? undefined,
    },
  };

  const schemaPost: Post = {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    content: stripHtml(post.content ?? ""),
    date: post.date,
    modified: post.modified,
    readingTime: estimateReadingTime(post.content),
    authorSlug: author.slug,
    categorySlugs: [primaryCategory.slug],
    tagSlugs: (post.tags?.nodes ?? []).flatMap((tag) => (tag?.slug ? [tag.slug] : [])),
    featuredArtKey,
    seo,
    relatedPostSlugs: relatedNodes.flatMap((item) => (item.slug ? [item.slug] : [])),
  };

  return {
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    date: post.date,
    modified: post.modified,
    readingTime: estimateReadingTime(post.content),
    featuredArtKey,
    seo,
    author,
    primaryCategory: {
      slug: primaryCategory.slug,
      name: primaryCategory.name,
      href: `/blog/categoria/${primaryCategory.slug}`,
    },
    tags: (post.tags?.nodes ?? []).map((tag) => ({
      href: `/blog/tag/${tag?.slug ?? ""}`,
      label: tag?.name?.trim() || tag?.slug || "Tag",
    })),
    relatedPosts: relatedNodes
      .filter((item) => item.slug && item.title && item.date)
      .map((item) => {
        const itemCategory = item.categories?.nodes?.[0];
        const itemAuthor = item.author?.node?.name?.trim() || "SMZ";

        return {
          href: `/blog/${item.slug}`,
          category: itemCategory?.name?.trim() || "Blog",
          date: item.date!,
          readingTime: estimateReadingTime(item.content),
          title: stripHtml(item.title!),
          excerpt: stripHtml(item.excerpt ?? item.content ?? ""),
          author: itemAuthor,
          featuredArtKey: deriveArtKey(item, itemCategory?.slug),
          slug: item.slug!,
        };
      }),
    headings: decorated.headings,
    contentHtml: decorated.contentHtml || "<p>Conteudo indisponivel.</p>",
    schemaPost,
    schemaAuthor,
    schemaCategory,
  };
}

export async function getBlogSingleStaticParams() {
  if (!isWordPressConfigured()) {
    return [];
  }

  try {
    const response = await wpFetch<WpPostsQuery>({
      query: GET_POSTS_QUERY,
      variables: {
        first: 50,
      },
      tags: ["wp:posts"],
      revalidate: 300,
    });

    const slugs = (response.posts?.nodes ?? [])
      .flatMap((post) => (post.slug ? [{ slug: post.slug }] : []));

    return slugs;
  } catch (error) {
    handleWordPressError("single static params", error);
    return [];
  }
}

export async function getBlogSingleData(slug: string): Promise<BlogSingleData | null> {
  if (!isWordPressConfigured()) {
    throw getWordPressConfigurationError(`post ${slug}`);
  }

  try {
    const [postResponse, relatedResponse] = await Promise.all([
      wpFetch<WpPostBySlugQuery>({
        query: GET_POST_BY_SLUG_QUERY,
        variables: {
          slug,
        },
        tags: [`wp:post:${slug}`],
        revalidate: 300,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: {
          first: 6,
        },
        tags: ["wp:posts"],
        revalidate: 300,
      }),
    ]);

    const post = postResponse.post;

    if (!post) {
      return null;
    }

    const relatedNodes = (relatedResponse.posts?.nodes ?? []).filter(
      (item) => item.slug && item.slug !== slug,
    );

    const mapped = mapWpPostToSingleData(post, relatedNodes);
    if (!mapped) {
      throw new Error(`WordPress returned an invalid post payload for "${slug}".`);
    }
    return mapped;
  } catch (error) {
    handleWordPressError(`single data (${slug})`, error);
    throw error;
  }
}
