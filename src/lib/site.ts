export function getSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    return new URL(siteUrl).origin;
  }

  return "https://smz.agency";
}

export function buildSiteUrl(path = "/") {
  const origin = getSiteOrigin();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, origin).toString();
}
