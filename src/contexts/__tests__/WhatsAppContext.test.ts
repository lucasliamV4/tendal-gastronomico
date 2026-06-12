import { describe, expect, it } from "vitest";
import {
  applyCouponTemplate,
  buildWhatsAppUrl,
  DEFAULT_COUPON_MESSAGE,
  DEFAULT_DIRECT_MESSAGE,
  pickMessage,
} from "../WhatsAppContext";

describe("buildWhatsAppUrl", () => {
  it("monta URL com número limpo e mensagem encodada", () => {
    const url = buildWhatsAppUrl("+55 (11) 91234-5678", "Olá mundo");
    expect(url).toBe("https://wa.me/5511912345678?text=Ol%C3%A1%20mundo");
  });

  it("remove TODOS os caracteres não numéricos do telefone", () => {
    expect(buildWhatsAppUrl("+1-202-555-0173 ext.4", "x")).toMatch(
      /^https:\/\/wa\.me\/120255501734\?/,
    );
  });

  it("encoda caracteres reservados de URL na mensagem", () => {
    const url = buildWhatsAppUrl("11999999999", "a&b=c d?e#f/g+h");
    expect(url).toBe("https://wa.me/11999999999?text=a%26b%3Dc%20d%3Fe%23f%2Fg%2Bh");
  });

  it("aceita mensagem vazia", () => {
    expect(buildWhatsAppUrl("11999999999", "")).toBe("https://wa.me/11999999999?text=");
  });

  it("retorna número vazio quando não há dígitos", () => {
    expect(buildWhatsAppUrl("abc-+", "oi")).toBe("https://wa.me/?text=oi");
  });

  it("preserva quebras de linha como %0A", () => {
    const url = buildWhatsAppUrl("11999999999", "linha1\nlinha2");
    expect(url).toContain("linha1%0Alinha2");
  });
});

describe("applyCouponTemplate", () => {
  it("substitui {coupon_code} pelo código gerado", () => {
    expect(applyCouponTemplate("Olá! Meu cupom é {coupon_code}.", "TENDAL-AB123")).toBe(
      "Olá! Meu cupom é TENDAL-AB123.",
    );
  });

  it("substitui múltiplas ocorrências (regex global)", () => {
    expect(applyCouponTemplate("Cupom: {coupon_code}. Confirme: {coupon_code}", "TENDAL-XY9")).toBe(
      "Cupom: TENDAL-XY9. Confirme: TENDAL-XY9",
    );
  });

  it("retorna o template inalterado quando não há placeholder", () => {
    expect(applyCouponTemplate("Olá, sem cupom aqui.", "TENDAL-ABC")).toBe("Olá, sem cupom aqui.");
  });

  it("é case-sensitive: {COUPON_CODE} NÃO é substituído", () => {
    expect(applyCouponTemplate("{COUPON_CODE}", "TENDAL-ZZZ")).toBe("{COUPON_CODE}");
  });

  it("não toca placeholders parecidos (espaços/sublinhados extras)", () => {
    expect(applyCouponTemplate("{ coupon_code } {couponcode}", "TENDAL-1")).toBe(
      "{ coupon_code } {couponcode}",
    );
  });

  it("template vazio retorna vazio", () => {
    expect(applyCouponTemplate("", "TENDAL-ABC")).toBe("");
  });

  it("substitui mesmo quando o código contém caracteres regex-especiais", () => {
    expect(applyCouponTemplate("X={coupon_code}", "A$1.B")).toBe("X=A$1.B");
  });
});

describe("buildWhatsAppUrl + applyCouponTemplate (fluxo completo)", () => {
  it("gera URL final pronta para abrir o WhatsApp com cupom no texto", () => {
    const tpl = "Olá! Quero usar meu cupom {coupon_code} no Tendal.";
    const code = "TENDAL-ABCDE";
    const message = applyCouponTemplate(tpl, code);
    const url = buildWhatsAppUrl("+55 11 99999-9999", message);

    expect(url).toContain("https://wa.me/5511999999999?text=");
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toBe("Olá! Quero usar meu cupom TENDAL-ABCDE no Tendal.");
  });
});

describe("pickMessage (fallback de mensagens)", () => {
  it("usa o template do CTA quando presente", () => {
    expect(pickMessage("CTA aqui", "config", "fallback")).toBe("CTA aqui");
  });

  it("ignora template apenas com espaços e usa o default da config", () => {
    expect(pickMessage("   ", "config msg", "fallback")).toBe("config msg");
  });

  it("usa o default da config quando o template é null/undefined", () => {
    expect(pickMessage(null, "config msg", "fallback")).toBe("config msg");
    expect(pickMessage(undefined, "config msg", "fallback")).toBe("config msg");
  });

  it("cai no fallback quando template e config estão vazios", () => {
    expect(pickMessage("", "", "fallback")).toBe("fallback");
    expect(pickMessage(null, null, "fallback")).toBe("fallback");
    expect(pickMessage("  ", "  ", "fallback")).toBe("fallback");
  });

  it("usa as constantes exportadas como fallback final", () => {
    expect(pickMessage(null, null, DEFAULT_DIRECT_MESSAGE)).toBe(DEFAULT_DIRECT_MESSAGE);
    expect(pickMessage(null, null, DEFAULT_COUPON_MESSAGE)).toContain("{coupon_code}");
  });

  it("o fallback de cupom contém o placeholder {coupon_code}", () => {
    const msg = applyCouponTemplate(DEFAULT_COUPON_MESSAGE, "TENDAL-X1");
    expect(msg).toContain("TENDAL-X1");
    expect(msg).not.toContain("{coupon_code}");
  });
});
