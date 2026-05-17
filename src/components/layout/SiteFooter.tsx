import Image from "next/image";
import Link from "next/link";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";

const serviceLinks = [
  "Tráfego pago",
  "SEO & conteúdo",
  "Redes sociais",
  "Sites & LPs",
  "Automação & CRM",
  "Consultoria",
];

const agencyLinks = [
  { href: "/#resultados", label: "Resultados" },
  { href: "/#processo", label: "Metodologia R/4" },
  { href: "/#depoimentos", label: "Depoimentos" },
  { href: "/blog", label: "Blog" },
];

const contactLinks = [
  { href: "https://instagram.com/ag.smz", label: "@ag.smz", type: "external" as const },
  { label: "WhatsApp", type: "lead" as const },
  { href: "mailto:contato@ag.smz", label: "contato@ag.smz", type: "external" as const },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
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
            <p>
              Agência de marketing focada em previsibilidade de receita. Trabalhamos com
              poucas marcas, em profundidade, e medimos tudo.
            </p>
          </div>

          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              {serviceLinks.map((label) => (
                <li key={label}>
                  <Link href="/#servicos">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Agência</h4>
            <ul>
              {agencyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              {contactLinks.map((item) => (
                <li key={item.label}>
                  {item.type === "lead" ? (
                    <LeadCtaButton className="footer-link-button" source="footer_whatsapp">
                      {item.label}
                    </LeadCtaButton>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-mark" aria-hidden="true">
          Resultado.<span className="accent">.</span>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SMZ Agência. Todos os direitos reservados.</span>
          <div className="legals">
            <Link href="#">Política de privacidade</Link>
            <Link href="#">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
