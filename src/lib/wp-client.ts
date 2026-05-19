import type { GraphQLVariables, WpGraphQLError, WpGraphQLResponse } from "@/types/wp";

type WpClientOptions<TVariables extends GraphQLVariables> = {
  query: string;
  variables?: TVariables;
  revalidate?: number;
  tags?: string[];
  cache?: RequestCache;
};

export class WpGraphQLRequestError extends Error {
  status: number;
  errors: WpGraphQLError[];

  constructor(message: string, status: number, errors: WpGraphQLError[] = []) {
    super(message);
    this.name = "WpGraphQLRequestError";
    this.status = status;
    this.errors = errors;
  }
}

function getGraphQLEndpoint() {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

  if (!endpoint) {
    throw new WpGraphQLRequestError(
      "WORDPRESS_GRAPHQL_ENDPOINT is not configured.",
      500,
    );
  }

  return endpoint;
}

export async function wpFetch<TData, TVariables extends GraphQLVariables = GraphQLVariables>({
  query,
  variables,
  revalidate = 30,
  tags = [],
  cache = "force-cache",
}: WpClientOptions<TVariables>): Promise<TData> {
  const endpoint = getGraphQLEndpoint();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
    next: {
      revalidate,
      tags,
    },
  });

  let payload: WpGraphQLResponse<TData>;

  try {
    payload = (await response.json()) as WpGraphQLResponse<TData>;
  } catch {
    throw new WpGraphQLRequestError(
      "WordPress GraphQL returned an invalid JSON response.",
      response.status,
    );
  }

  if (!response.ok) {
    throw new WpGraphQLRequestError(
      `WordPress GraphQL request failed with status ${response.status}.`,
      response.status,
      payload.errors ?? [],
    );
  }

  if (payload.errors?.length) {
    throw new WpGraphQLRequestError(
      payload.errors.map((error) => error.message).join("; "),
      response.status,
      payload.errors,
    );
  }

  if (!payload.data) {
    throw new WpGraphQLRequestError(
      "WordPress GraphQL response did not include data.",
      response.status,
    );
  }

  return payload.data;
}
