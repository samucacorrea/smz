import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { buildSiteUrl, getSiteOrigin } from "@/lib/site";

type ServiceKpi = {
  label: string;
  value: string;
  footnote: string;
};

type ServiceBullet = {
  label: string;
  title: string;
  description: string;
};

type ServiceSubservice = {
  idx: string;
  title: string;
  description: string;
  tags: string[];
};

type ServiceProcessStep = {
  num: string;
  title: string;
  description: string;
};

type ServiceFaq = {
  question: string;
  answerHtml: string;
};

type ServiceProofMetric = {
  value: string;
  label: string;
};

type ServiceFinalCard = {
  title: string;
  subtitle: string;
};

export type ServicePageData = {
  slug: string;
  navLabel: string;
  pageTitle: string;
  serviceType: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  heroEyebrow: string;
  heroTitleHtml: string;
  heroPromiseHtml: string;
  trustItems: string[];
  kpis: ServiceKpi[];
  explainTitleHtml: string;
  explainBodyHtml: string[];
  bullets: ServiceBullet[];
  subservices: ServiceSubservice[];
  process: ServiceProcessStep[];
  proof: {
    tag: string;
    quoteHtml: string;
    metrics: ServiceProofMetric[];
    authorName: string;
    authorRole: string;
    initials: string;
  };
  faq: ServiceFaq[];
  faqAside: string[];
  finalCtaTitleHtml: string;
  finalCtaDescription: string;
  finalCards: ServiceFinalCard[];
  related: Array<{
    slug: string;
    name: string;
    tag: string;
  }>;
};

const SERVICE_LABELS: Record<string, string> = {
  "trafego-pago": "Tráfego Pago",
  "seo-e-conteudo": "SEO & Conteúdo",
  "redes-sociais": "Redes Sociais",
  "sites-e-landing-pages": "Sites & Landing Pages",
  "automacao-e-crm": "Automação & CRM",
  consultoria: "Consultoria Estratégica",
};

const DEFAULT_FINAL_CARDS: ServiceFinalCard[] = [
  {
    title: "Falar no WhatsApp",
    subtitle: "Resposta em 1 dia útil",
  },
  {
    title: "Receber análise por e-mail",
    subtitle: "Preencha um briefing curto",
  },
  {
    title: "Entender o Framework R/4",
    subtitle: "Nossa metodologia em 4 etapas",
  },
];

function decodeHtml(value: string) {
  return value
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&uacute;/g, "ú")
    .replace(/&ccedil;/g, "ç")
    .replace(/&atilde;/g, "ã")
    .replace(/&otilde;/g, "õ")
    .replace(/&eacute;/g, "é")
    .replace(/&aacute;/g, "á")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó");
}

function stripHtml(value: string) {
  return decodeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function matchFirst(pattern: RegExp, input: string) {
  return input.match(pattern)?.[1] ?? "";
}

function matchAll(pattern: RegExp, input: string) {
  return [...input.matchAll(pattern)].map((match) => match[1] ?? "");
}

function normalizeOrigin(url: string) {
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    return `${getSiteOrigin()}${parsed.pathname}`;
  } catch {
    return undefined;
  }
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function parseServiceFile(slug: string): ServicePageData {
  const filePath = path.join(process.cwd(), "_template_", "servicos", `${slug}.html`);
  const html = readFileSync(filePath, "utf8");

  const trustBlock = matchFirst(/<div class="pillar-trust-row">([\s\S]*?)<\/div>/i, html);
  const explainBlock = matchFirst(/<div class="explain-body">([\s\S]*?)<\/div>/i, html);
  const faqAsideBlock = matchFirst(/<aside class="faq-aside">([\s\S]*?)<\/aside>/i, html);
  const finalCards = [
    ...html.matchAll(
      /<a [^>]*class="fcta-mini"[^>]*>[\s\S]*?<div class="fc-title">([\s\S]*?)<\/div>[\s\S]*?<div class="fc-sub">([\s\S]*?)<\/div>[\s\S]*?<\/a>/g,
    ),
  ].map((match) => ({
    title: stripHtml(match[1]),
    subtitle: stripHtml(match[2]),
  }));
  const proofMetrics = [
    ...html.matchAll(
      /<p class="pn-num">([\s\S]*?)<\/p>\s*<p class="pn-label">([\s\S]*?)<\/p>/g,
    ),
  ].map((match) => ({
    value: stripHtml(match[1]),
    label: stripHtml(match[2]),
  }));

  return {
    slug,
    navLabel:
      SERVICE_LABELS[slug] ??
      stripHtml(matchFirst(/<span class="current">([\s\S]*?)<\/span>/i, html)),
    pageTitle: decodeHtml(matchFirst(/<title>([\s\S]*?)<\/title>/i, html)),
    serviceType: decodeHtml(matchFirst(/"serviceType":\s*"([^"]+)"/i, html)),
    description: decodeHtml(matchFirst(/<meta name="description" content="([\s\S]*?)"/i, html)),
    keywords: decodeHtml(matchFirst(/<meta name="keywords" content="([\s\S]*?)"/i, html))
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    canonical: buildSiteUrl(`/servicos/${slug}`),
    ogImage: normalizeOrigin(
      decodeHtml(matchFirst(/<meta property="og:image" content="([\s\S]*?)"/i, html)),
    ),
    heroEyebrow: `${stripHtml(matchFirst(/<span class="accent">([\s\S]*?)<\/span>/i, matchFirst(/<span class="pillar-eyebrow">([\s\S]*?)<\/span>/i, html)))} ${SERVICE_LABELS[slug] ?? ""}`.trim(),
    heroTitleHtml: decodeHtml(matchFirst(/<h1>([\s\S]*?)<\/h1>/i, html)),
    heroPromiseHtml: decodeHtml(
      matchFirst(/<p class="pillar-promise">([\s\S]*?)<\/p>/i, html),
    ).trim(),
    trustItems: matchAll(/<span>([\s\S]*?)<\/span>/g, trustBlock)
      .map((item) => stripHtml(item))
      .filter(Boolean),
    kpis: [...html.matchAll(/<div class="pillar-kpi">([\s\S]*?)<\/div>/g)].map((match) => ({
      label: stripHtml(matchFirst(/<p class="kpi-label">([\s\S]*?)<\/p>/i, match[1])),
      value: stripHtml(matchFirst(/<p class="kpi-num">([\s\S]*?)<\/p>/i, match[1])),
      footnote: stripHtml(matchFirst(/<p class="kpi-foot">([\s\S]*?)<\/p>/i, match[1])),
    })),
    explainTitleHtml: decodeHtml(
      matchFirst(/<section class="pillar-explain"[\s\S]*?<h2>([\s\S]*?)<\/h2>/i, html),
    ),
    explainBodyHtml: matchAll(/<p>([\s\S]*?)<\/p>/g, explainBlock).map((item) =>
      decodeHtml(item).trim(),
    ),
    bullets: matchAll(/<div class="bullet">([\s\S]*?)<\/div>/g, html).map((block) => ({
      label: stripHtml(matchFirst(/<p class="b-label">([\s\S]*?)<\/p>/i, block)),
      title: stripHtml(matchFirst(/<h3 class="b-title">([\s\S]*?)<\/h3>/i, block)),
      description: stripHtml(matchFirst(/<p class="b-desc">([\s\S]*?)<\/p>/i, block)),
    })),
    subservices: matchAll(/<article class="sub-service">([\s\S]*?)<\/article>/g, html).map(
      (block) => ({
        idx: stripHtml(matchFirst(/<span class="ss-idx">([\s\S]*?)<\/span>/i, block)),
        title: stripHtml(matchFirst(/<h3>([\s\S]*?)<\/h3>/i, block)),
        description: stripHtml(matchFirst(/<p>([\s\S]*?)<\/p>/i, block)),
        tags: matchAll(/<span class="ss-tag">([\s\S]*?)<\/span>/g, block).map(stripHtml),
      }),
    ),
    process: matchAll(/<div class="pt-step">([\s\S]*?)<\/div>/g, html).map((block) => ({
      num: stripHtml(matchFirst(/<p class="pt-num">([\s\S]*?)<\/p>/i, block)),
      title: stripHtml(matchFirst(/<h3>([\s\S]*?)<\/h3>/i, block)),
      description: stripHtml(matchFirst(/<p>([\s\S]*?)<\/p>/i, block)),
    })),
    proof: {
      tag: stripHtml(matchFirst(/<span class="proof-tag">([\s\S]*?)<\/span>/i, html)),
      quoteHtml: decodeHtml(
        matchFirst(/<blockquote class="case-quote">([\s\S]*?)<\/blockquote>/i, html),
      ).trim(),
      metrics: proofMetrics,
      authorName: stripHtml(matchFirst(/<div class="pa-name">([\s\S]*?)<\/div>/i, html)),
      authorRole: stripHtml(matchFirst(/<div class="pa-role">([\s\S]*?)<\/div>/i, html)),
      initials: getInitials(
        stripHtml(matchFirst(/<div class="pa-name">([\s\S]*?)<\/div>/i, html)),
      ),
    },
    faq: [
      ...html.matchAll(
        /<details class="faq-item[^"]*"[\s\S]*?<summary class="faq-q">([\s\S]*?)<\/summary>[\s\S]*?<div class="faq-a">([\s\S]*?)<\/div>[\s\S]*?<\/details>/g,
      ),
    ].map((match) => ({
      question: stripHtml(match[1]).replace(/^Q\/\d+\s*/i, ""),
      answerHtml: decodeHtml(match[2]).trim(),
    })),
    faqAside: matchAll(/<p>([\s\S]*?)<\/p>/g, faqAsideBlock).map((item) =>
      decodeHtml(item).trim(),
    ),
    finalCtaTitleHtml: decodeHtml(
      matchFirst(/<section class="pillar-final-cta"[\s\S]*?<h2>([\s\S]*?)<\/h2>/i, html),
    ),
    finalCtaDescription: stripHtml(
      matchFirst(/<section class="pillar-final-cta"[\s\S]*?<p>([\s\S]*?)<\/p>/i, html),
    ),
    finalCards: finalCards.length ? finalCards : DEFAULT_FINAL_CARDS,
    related: [],
  };
}

function loadServices() {
  const servicesDirectory = path.join(process.cwd(), "_template_", "servicos");

  if (!existsSync(servicesDirectory)) {
    console.error("[services] Missing directory in runtime:", servicesDirectory);
    return [] as ServicePageData[];
  }

  try {
    const serviceFiles = readdirSync(servicesDirectory)
      .filter((file) => file.endsWith(".html"))
      .map((file) => file.replace(/\.html$/, ""))
      .sort(
        (a, b) => Object.keys(SERVICE_LABELS).indexOf(a) - Object.keys(SERVICE_LABELS).indexOf(b),
      );

    const parsedServices = serviceFiles.map(parseServiceFile);

    for (const service of parsedServices) {
      service.related = parsedServices
        .filter((item) => item.slug !== service.slug)
        .slice(0, 3)
        .map((item) => ({
          slug: item.slug,
          name: item.navLabel,
          tag: item.serviceType,
        }));
    }

    return parsedServices;
  } catch (error) {
    console.error("[services] Failed to parse service templates:", error);
    return [] as ServicePageData[];
  }
}

const parsedServices = loadServices();

export function getAllServices() {
  return parsedServices;
}

export function getServiceBySlug(slug: string) {
  return parsedServices.find((service) => service.slug === slug) ?? null;
}

export function getServiceStaticParams() {
  return parsedServices.map((service) => ({ slug: service.slug }));
}
