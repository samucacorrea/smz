"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";

type MobileMenuItem = {
  href: string;
  label: string;
};

type MobileServiceItem = {
  slug: string;
  navLabel: string;
};

type MobileMenuProps = {
  navigationItems: MobileMenuItem[];
  services: MobileServiceItem[];
};

export function MobileMenu({ navigationItems, services }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, []);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen ? (
        <div
          className="mobile-nav-backdrop"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <div
            id="mobile-nav-panel"
            className="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-nav-head">
              <p className="mobile-nav-title">Menu</p>
              <button
                type="button"
                className="mobile-nav-close"
                aria-label="Fechar menu"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className="mobile-nav-links" aria-label="Menu mobile">
              <Link href="/servicos" onClick={() => setIsOpen(false)}>
                Todos os serviços
              </Link>

              <button
                type="button"
                className="mobile-nav-services-toggle"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((current) => !current)}
              >
                Serviços
              </button>

              {servicesOpen ? (
                <div className="mobile-nav-services-list">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/servicos/${service.slug}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {service.navLabel}
                    </Link>
                  ))}
                </div>
              ) : null}

              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mobile-nav-cta">
              <LeadCtaButton className="btn btn-primary" source="mobile_menu_cta">
                Falar no WhatsApp
              </LeadCtaButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
