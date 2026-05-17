import type { SeoData } from "@/types/content";
import {
  GET_POSTS_BY_TAG_SLUG_QUERY,
  GET_TAG_BY_SLUG_QUERY,
  GET_TAGS_QUERY,
} from "@/graphql/queries";
import { getPostsByTagSlug, getTagBySlug, mockContent } from "@/lib/mock-data";
import { wpFetch } from "@/lib/wp-client";
import type {
  WpPost,
  WpPostsQuery,
  WpTag,
  WpTagBySlugQuery,
  WpTagsQuery,
} from "@/types/wp";

type TagArchivePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  authorName: string;
  categoryName: string;
  tagSlugs: string[];
};

type TagCloudItem = {
  slug: string;
  name: string;
  articleCount: number;
};

export type BlogTagData = {
  tag: {
    slug: string;
    name: string;
    description: string;
    articleCount: number;
    categorySlug?: string;
    seo: SeoData;
  };
  posts: TagArchivePost[];
  relatedTags: TagCloudItem[];
  authorCount: number;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadingTime(content?: string | null) {
  const plainText = stripHtml(content ?? "");
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));

  return `${minutes} min`;
}

function mapTagSeo(tag: WpTag): SeoData {
  return {
    title: tag.seo?.title || `#${tag.name ?? "Tag"} · Blog SMZ`,
    description: tag.seo?.metaDesc || tag.description?.trim() || "",
    canonical: tag.seo?.canonical || `https://ag.smz/blog/tag/${tag.slug ?? ""}`,
    ogImage: tag.seo?.opengraphImage?.sourceUrl ?? undefined,
  };
}

function mapWpPost(post: WpPost): TagArchivePost | null {
  if (!post.slug || !post.title || !post.date) {
    return null;
  }

  return {
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    date: post.date,
    readingTime: estimateReadingTime(post.content),
    authorName: post.author?.node?.name?.trim() || "SMZ",
    categoryName: post.categories?.nodes?.[0]?.name?.trim() || "Blog",
    tagSlugs: (post.tags?.nodes ?? []).flatMap((tag) => (tag?.slug ? [tag.slug] : [])),
  };
}

function mapMockTagData(slug: string): BlogTagData | null {
  const tag = getTagBySlug(slug);

  if (!tag) {
    return null;
  }

  const posts = getPostsByTagSlug(tag.slug);

  return {
    tag,
    posts: posts.map((post) => {
      const author = mockContent.authors.find((item) => item.slug === post.authorSlug);
      const category = mockContent.categories.find((item) =>
        post.categorySlugs.includes(item.slug),
      );

      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        readingTime: post.readingTime,
        authorName: author?.name ?? "SMZ",
        categoryName: category?.name ?? "Blog",
        tagSlugs: post.tagSlugs,
      };
    }),
    relatedTags: mockContent.tags
      .filter((item) => item.slug !== tag.slug)
      .slice(0, 6)
      .map((item) => ({
        slug: item.slug,
        name: item.name,
        articleCount: item.articleCount,
      })),
    authorCount: new Set(posts.map((post) => post.authorSlug)).size,
  };
}

export async function getBlogTagStaticParams() {
  if (!process.env.WORDPRESS_GRAPHQL_ENDPOINT) {
    return mockContent.tags.map((tag) => ({ slug: tag.slug }));
  }

  try {
    const response = await wpFetch<WpTagsQuery>({
      query: GET_TAGS_QUERY,
      variables: {
        first: 50,
      },
      tags: ["wp:tags"],
      revalidate: 300,
    });

    const slugs = (response.tags?.nodes ?? []).flatMap((tag) =>
      tag.slug ? [{ slug: tag.slug }] : [],
    );

    return slugs.length ? slugs : mockContent.tags.map((tag) => ({ slug: tag.slug }));
  } catch {
    return mockContent.tags.map((tag) => ({ slug: tag.slug }));
  }
}

export async function getBlogTagData(slug: string): Promise<BlogTagData | null> {
  if (!process.env.WORDPRESS_GRAPHQL_ENDPOINT) {
    return mapMockTagData(slug);
  }

  try {
    const [tagResponse, postsResponse, tagsResponse] = await Promise.all([
      wpFetch<WpTagBySlugQuery>({
        query: GET_TAG_BY_SLUG_QUERY,
        variables: {
          slug,
        },
        tags: [`wp:tag:${slug}`],
        revalidate: 300,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_BY_TAG_SLUG_QUERY,
        variables: {
          slug,
          first: 24,
        },
        tags: [`wp:tag:${slug}`, "wp:posts"],
        revalidate: 300,
      }),
      wpFetch<WpTagsQuery>({
        query: GET_TAGS_QUERY,
        variables: {
          first: 50,
        },
        tags: ["wp:tags"],
        revalidate: 300,
      }),
    ]);

    const tag = tagResponse.tag;

    if (!tag?.slug || !tag.name) {
      return mapMockTagData(slug);
    }

    const posts = (postsResponse.posts?.nodes ?? [])
      .map(mapWpPost)
      .filter((post): post is TagArchivePost => Boolean(post));

    if (!posts.length) {
      return mapMockTagData(slug);
    }

    return {
      tag: {
        slug: tag.slug,
        name: tag.name,
        description: tag.description?.trim() || "",
        articleCount: tag.count ?? posts.length,
        categorySlug:
          mockContent.tags.find((item) => item.slug === tag.slug)?.categorySlug ?? undefined,
        seo: mapTagSeo(tag),
      },
      posts,
      relatedTags: (tagsResponse.tags?.nodes ?? [])
        .filter((item): item is WpTag => Boolean(item?.slug && item?.name && item.slug !== slug))
        .slice(0, 6)
        .map((item) => ({
          slug: item.slug!,
          name: item.name!,
          articleCount:
            item.count ??
            mockContent.tags.find((mockTag) => mockTag.slug === item.slug)?.articleCount ??
            0,
        })),
      authorCount: new Set(
        (postsResponse.posts?.nodes ?? []).map((post) => post.author?.node?.slug ?? post.id),
      ).size,
    };
  } catch {
    return mapMockTagData(slug);
  }
}
