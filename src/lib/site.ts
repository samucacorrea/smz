import type { SeoData } from "@/types/content";

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

export function getSiteSeo(): SeoData {
  return {
    title: "SMZ",
    description:
      "Agencia de marketing focada em resultado, operacao, SEO, performance e crescimento.",
    canonical: buildSiteUrl("/"),
  };
}

export function getHomeSeo(): SeoData {
  return {
    title: "Agência de Marketing Digital para PME | SMZ Agency",
    description:
      "Tráfego pago, SEO e estratégia para PMEs com gestão direta do sócio. Sem júnior, sem fidelidade, sem promessa vazia. Solicite um diagnóstico gratuito.",
    canonical: buildSiteUrl("/"),
  };
}

export function getBlogSeo(): SeoData {
  return {
    title: "Blog SMZ",
    description:
      "Artigos da SMZ sobre operacao, SEO, trafego pago, CRO, CRM, IA e crescimento.",
    canonical: buildSiteUrl("/blog"),
  };
}

export function getServicesSeo(): SeoData {
  return {
    title: "Serviços SMZ",
    description:
      "Páginas de serviços da SMZ para tráfego pago, SEO, redes sociais, sites, automação e consultoria estratégica.",
    canonical: buildSiteUrl("/servicos"),
  };
}
