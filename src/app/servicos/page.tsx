import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbListSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import { getAllServices } from "@/lib/services";
import { buildSiteUrl } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    ...buildPageMetadata({
      title: "Serviços de Marketing da SMZ",
      description:
        "Tráfego pago, SEO, redes sociais, sites, automação e consultoria estratégica em páginas dedicadas da SMZ.",
      canonical: buildSiteUrl("/servicos"),
    }),
    keywords: [
      "serviços de marketing",
      "tráfego pago",
      "SEO",
      "redes sociais",
      "sites",
      "CRM",
      "consultoria estratégica",
    ],
    other: {
      "geo.region": "BR",
      "geo.country": "Brasil",
    },
  };
}

export default function ServicesPage() {
  const services = getAllServices();
  const seo = {
    title: "Serviços de Marketing da SMZ",
    description:
      "Tráfego pago, SEO, redes sociais, sites, automação e consultoria estratégica em páginas dedicadas da SMZ.",
    canonical: buildSiteUrl("/servicos"),
  };

  return (
    <>
      <JsonLd
        data={buildBreadcrumbListSchema([
          { name: "Início", url: buildSiteUrl("/") },
          { name: "Serviços", url: buildSiteUrl("/servicos") },
        ])}
      />
      <JsonLd
        data={buildCollectionPageSchema({
          seo,
          name: "Serviços SMZ",
          description:
            "Coleção de páginas de serviços da SMZ com estrutura pensada para SEO, AEO e GEO.",
        })}
      />
      <JsonLd
        data={buildWebPageSchema({
          seo,
          name: "Serviços de Marketing da SMZ",
          description: seo.description,
          type: "CollectionPage",
        })}
      />
      <JsonLd
        data={buildItemListSchema({
          id: `${seo.canonical}#service-list`,
          name: "Lista de serviços SMZ",
          items: services.map((service) => ({
            name: service.navLabel,
            url: service.canonical,
          })),
        })}
      />
      <ServicesOverview services={services} />
    </>
  );
}
