import Image from "next/image";
import Link from "next/link";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getAllServices } from "@/lib/services";

const navigationItems = [
  { href: "/#resultados", label: "Resultados" },
  { href: "/#processo", label: "Processo" },
  { href: "/blog", label: "Blog" },
  { href: "/#contato", label: "Contato" },
];

export function SiteHeader() {
  const services = getAllServices();

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="SMZ — Início">
          <Image
            className="logo-dark"
            src="/assets/logos/logo-dark.png"
            alt="SMZ"
            width={152}
            height={44}
            sizes="152px"
          />
          <Image
            className="logo-light"
            src="/assets/logos/logo-light.png"
            alt="SMZ"
            width={152}
            height={44}
            sizes="152px"
          />
        </Link>

        <nav aria-label="Principal">
          <ul className="nav-links">
            <li className="nav-dropdown">
              <Link href="/servicos" className="nav-dropdown-trigger">
                Serviços
              </Link>
              <div className="nav-dropdown-menu" role="menu" aria-label="Serviços SMZ">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/servicos/${service.slug}`}
                    className="nav-dropdown-item"
                  >
                    <span className="nav-dropdown-title">{service.navLabel}</span>
                    <span className="nav-dropdown-meta">{service.serviceType}</span>
                  </Link>
                ))}
              </div>
            </li>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <ThemeToggle />

          <LeadCtaButton className="btn btn-primary btn-sm" source="header_whatsapp">
            Falar no WhatsApp
            <svg
              className="arrow"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </LeadCtaButton>
        </div>
      </div>
    </header>
  );
}
