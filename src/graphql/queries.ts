export const MEDIA_FIELDS = /* GraphQL */ `
  featuredImage {
    node {
      id
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

export const AUTHOR_FIELDS = /* GraphQL */ `
  author {
    node {
      id
      slug
      name
      description
      avatar {
        url
      }
    }
  }
`;

export const TAXONOMY_FIELDS = /* GraphQL */ `
  categories {
    nodes {
      id
      slug
      name
      description
    }
  }
  tags {
    nodes {
      id
      slug
      name
      description
    }
  }
`;

export const POST_BASE_FIELDS = /* GraphQL */ `
  id
  slug
  title
  excerpt
  content
  date
  modified
  ${AUTHOR_FIELDS}
  ${TAXONOMY_FIELDS}
  ${MEDIA_FIELDS}
`;

export const PAGE_BASE_FIELDS = /* GraphQL */ `
  id
  slug
  title
  content
  modified
`;

export const CATEGORY_BASE_FIELDS = /* GraphQL */ `
  id
  slug
  name
  description
  count
`;

export const TAG_BASE_FIELDS = /* GraphQL */ `
  id
  slug
  name
  description
  count
`;

export const AUTHOR_BASE_FIELDS = /* GraphQL */ `
  id
  slug
  name
  description
  avatar {
    url
  }
`;

export const GET_POSTS_QUERY = /* GraphQL */ `
  query GetPosts($first: Int = 12, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        ${POST_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_POSTS_QUERY = /* GraphQL */ `
  query GetSearchPosts($search: String!, $first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { search: $search }) {
      nodes {
        ${POST_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_POST_BY_SLUG_QUERY = /* GraphQL */ `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ${POST_BASE_FIELDS}
    }
  }
`;

export const GET_PAGES_QUERY = /* GraphQL */ `
  query GetPages($first: Int = 20, $after: String) {
    pages(first: $first, after: $after) {
      nodes {
        ${PAGE_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG_QUERY = /* GraphQL */ `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      ${PAGE_BASE_FIELDS}
    }
  }
`;

export const GET_CATEGORIES_QUERY = /* GraphQL */ `
  query GetCategories($first: Int = 50, $after: String) {
    categories(first: $first, after: $after) {
      nodes {
        ${CATEGORY_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_CATEGORY_BY_SLUG_QUERY = /* GraphQL */ `
  query GetCategoryBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      ${CATEGORY_BASE_FIELDS}
    }
  }
`;

export const GET_POSTS_BY_CATEGORY_SLUG_QUERY = /* GraphQL */ `
  query GetPostsByCategorySlug($slug: String!, $first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: $slug }) {
      nodes {
        ${POST_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_TAGS_QUERY = /* GraphQL */ `
  query GetTags($first: Int = 50, $after: String) {
    tags(first: $first, after: $after) {
      nodes {
        ${TAG_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_TAG_BY_SLUG_QUERY = /* GraphQL */ `
  query GetTagBySlug($slug: ID!) {
    tag(id: $slug, idType: SLUG) {
      ${TAG_BASE_FIELDS}
    }
  }
`;

export const GET_POSTS_BY_TAG_SLUG_QUERY = /* GraphQL */ `
  query GetPostsByTagSlug($slug: String!, $first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { tag: $slug }) {
      nodes {
        ${POST_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_AUTHORS_QUERY = /* GraphQL */ `
  query GetAuthors($first: Int = 50, $after: String) {
    users(first: $first, after: $after) {
      nodes {
        ${AUTHOR_BASE_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_AUTHOR_BY_SLUG_QUERY = /* GraphQL */ `
  query GetAuthorBySlug($slug: ID!) {
    user(id: $slug, idType: SLUG) {
      ${AUTHOR_BASE_FIELDS}
    }
  }
`;
