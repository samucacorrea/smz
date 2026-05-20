export type GraphQLVariables = Record<string, unknown>;

export type WpGraphQLError = {
  message: string;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export type WpGraphQLResponse<TData> = {
  data?: TData;
  errors?: WpGraphQLError[];
};

export type WpSeo = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphImage?: {
    sourceUrl?: string | null;
  } | null;
};

export type WpAuthor = {
  id: string;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  avatar?: {
    url?: string | null;
  } | null;
};

export type WpCategory = {
  id: string;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  count?: number | null;
  seo?: WpSeo | null;
};

export type WpTag = {
  id: string;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  count?: number | null;
  seo?: WpSeo | null;
};

export type WpMediaItem = {
  id: string;
  sourceUrl?: string | null;
  altText?: string | null;
  mediaDetails?: {
    width?: number | null;
    height?: number | null;
  } | null;
};

export type WpPost = {
  id: string;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  date?: string | null;
  modified?: string | null;
  seo?: WpSeo | null;
  author?: {
    node?: WpAuthor | null;
  } | null;
  categories?: WpConnection<WpCategory> | null;
  tags?: WpConnection<WpTag> | null;
  featuredImage?: {
    node?: WpMediaItem | null;
  } | null;
};

export type WpPage = {
  id: string;
  slug?: string | null;
  title?: string | null;
  content?: string | null;
  modified?: string | null;
  seo?: WpSeo | null;
};

export type WpPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

export type WpConnection<TNode> = {
  nodes?: TNode[] | null;
  pageInfo?: WpPageInfo | null;
};

export type WpPostsQuery = {
  posts?: WpConnection<WpPost> | null;
};

export type WpPostBySlugQuery = {
  post?: WpPost | null;
};

export type WpPagesQuery = {
  pages?: WpConnection<WpPage> | null;
};

export type WpPageBySlugQuery = {
  page?: WpPage | null;
};

export type WpCategoriesQuery = {
  categories?: WpConnection<WpCategory> | null;
};

export type WpCategoryBySlugQuery = {
  category?: WpCategory | null;
};

export type WpTagsQuery = {
  tags?: WpConnection<WpTag> | null;
};

export type WpTagBySlugQuery = {
  tag?: WpTag | null;
};

export type WpAuthorsQuery = {
  users?: WpConnection<WpAuthor> | null;
};

export type WpAuthorBySlugQuery = {
  user?: WpAuthor | null;
};

export type WpSeoMetadataQuery = {
  post?: Pick<WpPost, "seo"> | null;
  page?: Pick<WpPage, "seo"> | null;
  category?: Pick<WpCategory, "seo"> | null;
  tag?: Pick<WpTag, "seo"> | null;
};
