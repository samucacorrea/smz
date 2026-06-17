"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type LeadAttribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_keyword: string;
  utm_id: string;
  fbclid: string;
  gclid: string;
};

type LeadCaptureContextValue = {
  openLeadModal: (source?: string) => void;
  closeLeadModal: () => void;
};

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

function readAttribution(): LeadAttribution {
  if (typeof window === "undefined") {
    return {
      utm_source: "notset",
      utm_medium: "notset",
      utm_campaign: "notset",
      utm_content: "notset",
      utm_keyword: "notset",
      utm_id: "notset",
      fbclid: "notset",
      gclid: "notset",
    };
  }

  const searchParams = new URLSearchParams(window.location.search);

  return {
    utm_source: searchParams.get("utm_source") ?? "notset",
    utm_medium: searchParams.get("utm_medium") ?? "notset",
    utm_campaign: searchParams.get("utm_campaign") ?? "notset",
    utm_content: searchParams.get("utm_content") ?? "notset",
    utm_keyword:
      searchParams.get("utm_keyword") ?? searchParams.get("utm_term") ?? "notset",
    utm_id: searchParams.get("utm_id") ?? "notset",
    fbclid: searchParams.get("fbclid") ?? "notset",
    gclid: searchParams.get("gclid") ?? "notset",
  };
}

type LeadCaptureProviderProps = {
  children: ReactNode;
};

export function LeadCaptureProvider({ children }: LeadCaptureProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("cta");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [attribution, setAttribution] = useState<LeadAttribution>(() => readAttribution());

  useEffect(() => {
    setAttribution(readAttribution());
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const closeLeadModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openLeadModal = useCallback((nextSource?: string) => {
    setSource(nextSource?.trim() || "cta");
    setStatus("idle");
    setErrorMessage("");
    setName("");
    setPhone("");
    setAttribution(readAttribution());
    setIsOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus("submitting");
      setErrorMessage("");

      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            source,
            attribution,
            page: {
              title: typeof document !== "undefined" ? document.title : "SMZ",
              path: typeof window !== "undefined" ? window.location.pathname : "/",
              url: typeof window !== "undefined" ? window.location.href : "",
            },
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | {
              ok?: boolean;
              error?: string;
              leadId?: string;
              redirectUrl?: string;
              response?: unknown;
            }
          | null;

        if (!response.ok) {
          const errorText =
            data?.error ||
            (typeof data?.response === "string" ? data.response : "") ||
            "Falha ao enviar o lead.";
          window.alert(errorText);
          throw new Error(errorText);
        }

        if (!data?.leadId) {
          const errorText = "O webhook nao retornou um leadId valido.";
          window.alert(errorText);
          throw new Error(errorText);
        }

        sendGTMEvent({
          event: "generate_lead",
          form_name: "lead_modal",
          lead_source: source,
          page_location: typeof window !== "undefined" ? window.location.href : "",
          page_path: typeof window !== "undefined" ? window.location.pathname : "",
          user_name: name,
          phone_provided: Boolean(phone),
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          utm_content: attribution.utm_content,
          utm_id: attribution.utm_id,
          gclid: attribution.gclid,
          fbclid: attribution.fbclid,
          leadId: data.leadId,
          lead_id: data.leadId,
        });

        setStatus("success");

        if (data.redirectUrl) {
          window.setTimeout(() => {
            window.location.assign(data.redirectUrl as string);
          }, 600);
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Nao foi possivel enviar o lead.",
        );
      }
    },
    [attribution, name, phone, source],
  );

  const contextValue = useMemo(
    () => ({
      openLeadModal,
      closeLeadModal,
    }),
    [closeLeadModal, openLeadModal],
  );

  return (
    <LeadCaptureContext.Provider value={contextValue}>
      {children}

      {isOpen ? (
        <div
          className="lead-modal-backdrop"
          role="presentation"
          onClick={closeLeadModal}
        >
          <div
            className="lead-modal-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lead-modal-close"
              aria-label="Fechar formulario"
              onClick={closeLeadModal}
            >
              ×
            </button>

            <div className="lead-modal-copy">
              <span className="eyebrow">Contato rapido</span>
              <h2 id="lead-modal-title">Fale com a SMZ em menos de 1 minuto.</h2>
              <p>
                Deixe seus dados para o nosso time entrar em contato e entender o seu momento.
              </p>
            </div>

            <form className="form-card lead-modal-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="lead-name">Seu nome</label>
                <input
                  id="lead-name"
                  type="text"
                  placeholder="Ex.: Samuel Correa"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="lead-phone">Seu WhatsApp</label>
                <input
                  id="lead-phone"
                  type="tel"
                  placeholder="Ex.: (11) 99999-9999"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>

              <input type="hidden" name="utm_source" value={attribution.utm_source} readOnly />
              <input type="hidden" name="utm_medium" value={attribution.utm_medium} readOnly />
              <input
                type="hidden"
                name="utm_campaign"
                value={attribution.utm_campaign}
                readOnly
              />
              <input type="hidden" name="utm_content" value={attribution.utm_content} readOnly />
              <input type="hidden" name="utm_keyword" value={attribution.utm_keyword} readOnly />
              <input type="hidden" name="utm_id" value={attribution.utm_id} readOnly />
              <input type="hidden" name="fbclid" value={attribution.fbclid} readOnly />
              <input type="hidden" name="gclid" value={attribution.gclid} readOnly />

              <button
                type="submit"
                className="btn btn-primary lead-submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Enviando..." : "Quero receber contato"}
              </button>

              <p className="lead-source">
                Atendimento em horário comercial. Origem: <strong>{source}</strong>
              </p>

              {status === "success" ? (
                <p className="lead-feedback success">
                  Recebemos seus dados. O time da SMZ fala com você em breve.
                </p>
              ) : null}

              {status === "error" ? (
                <p className="lead-feedback error">{errorMessage}</p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </LeadCaptureContext.Provider>
  );
}

export function useLeadCapture() {
  const context = useContext(LeadCaptureContext);

  if (!context) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider.");
  }

  return context;
}
