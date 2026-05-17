export function isWordPressConfigured() {
  return Boolean(process.env.WORDPRESS_GRAPHQL_ENDPOINT?.trim());
}

export function getWordPressConfigurationError(context: string) {
  return new Error(`WordPress is not configured for ${context}.`);
}

export function handleWordPressError(context: string, error: unknown) {
  console.error(`[WordPress] ${context}`, error);
}
