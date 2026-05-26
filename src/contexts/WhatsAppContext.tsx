import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/tracking";
import { createContext, useContext, type ReactNode } from "react";
import { toast } from "sonner";
import { useSiteConfig } from "./SiteConfigContext";

type OpenArgs = { source: string; template?: string };
type RedeemArgs = OpenArgs & { promotionId?: string | null };

type Value = {
  openWhatsApp: (args: OpenArgs) => Promise<void>;
  redeemCoupon: (args: RedeemArgs) => Promise<string>;
};

const Ctx = createContext<Value | null>(null);

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "tendal_session_id";
  let sid = window.sessionStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    window.sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

function generateCouponCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem caracteres ambiguos
  let out = "TENDAL-";
  for (let i = 0; i < 5; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/**
 * Mensagens padrão usadas quando nem o template do CTA nem
 * `whatsapp_default_message` da config estão definidos.
 */
export const DEFAULT_DIRECT_MESSAGE = "Olá! Gostaria de mais informações sobre o Tendal.";
export const DEFAULT_COUPON_MESSAGE = "Olá! Quero usar meu cupom {coupon_code} no Tendal.";

/**
 * Escolhe a mensagem efetiva, na ordem: template explícito do CTA →
 * default da config (do banco) → fallback hard-coded. Strings vazias
 * ou só espaços são tratadas como ausentes.
 */
export function pickMessage(
  template: string | null | undefined,
  configDefault: string | null | undefined,
  fallback: string,
): string {
  const tpl = template?.trim();
  if (tpl) return tpl;
  const cfg = configDefault?.trim();
  if (cfg) return cfg;
  return fallback;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const cleaned = number.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Substitui todas as ocorrências de `{coupon_code}` no template pelo código
 * gerado. Mantém o restante da mensagem intacto.
 */
export function applyCouponTemplate(template: string, code: string): string {
  return template.replace(/\{coupon_code\}/g, code);
}

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const { config } = useSiteConfig();

  const openWhatsApp = async ({ source, template }: OpenArgs) => {
    const number = config?.whatsapp_number?.replace(/\D/g, "") ?? "";
    if (!number) {
      trackEvent("whatsapp_unavailable", { cta: source, type: "direct" });
      toast.error("WhatsApp indisponível no momento", {
        description: "Tente novamente em instantes ou ligue para o restaurante.",
      });
      return;
    }
    const message = pickMessage(template, config?.whatsapp_default_message, DEFAULT_DIRECT_MESSAGE);
    trackEvent("Contact", { source, channel: "whatsapp" });
    // Conversão dedicada por CTA — facilita filtrar no GA4/GTM/Meta por
    // botão de origem (header / hero / cupom / footer / widget).
    trackEvent("whatsapp_click", {
      cta: source,
      channel: "whatsapp",
      type: "direct",
    });
    const url = buildWhatsAppUrl(config!.whatsapp_number, message);
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  const redeemCoupon = async ({ source, template, promotionId }: RedeemArgs): Promise<string> => {
    const code = generateCouponCode();

    const insertPayload = {
      coupon_code: code,
      promotion_id: promotionId ?? null,
      session_id: getSessionId(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      source_cta: source,
    };

    const { error } = await supabase.from("coupons_claimed").insert(insertPayload as never);
    if (error) throw error;

    trackEvent("Lead", { source, coupon_code: code });

    const number = config?.whatsapp_number?.replace(/\D/g, "") ?? "";
    if (number) {
      const tpl = pickMessage(template, config?.whatsapp_default_message, DEFAULT_COUPON_MESSAGE);
      const message = applyCouponTemplate(tpl, code);
      trackEvent("whatsapp_click", {
        cta: source,
        channel: "whatsapp",
        type: "coupon",
        coupon_code: code,
      });
      const url = buildWhatsAppUrl(config!.whatsapp_number, message);
      if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Cupom já foi gravado no banco — o usuário não pode perder o código.
      trackEvent("whatsapp_unavailable", { cta: source, type: "coupon", coupon_code: code });
      toast.warning("Cupom gerado, mas não conseguimos abrir o WhatsApp", {
        description: `Anote seu código: ${code}. Mostre ao garçom no momento do pedido.`,
        duration: 15000,
      });
    }

    return code;
  };

  return <Ctx.Provider value={{ openWhatsApp, redeemCoupon }}>{children}</Ctx.Provider>;
}

export function useWhatsApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWhatsApp must be used inside WhatsAppProvider");
  return ctx;
}
