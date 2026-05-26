import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { usePromotion } from "@/hooks/useSupabaseQueries";
import { useState } from "react";
import { toast } from "sonner";

const CupomSection = () => {
  const { redeemCoupon } = useWhatsApp();
  const { data: promotion } = usePromotion();
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  if (!promotion?.active) return null;

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const code = await redeemCoupon({
        source: "cupom_section",
        template: promotion.whatsapp_message_template,
        promotionId: promotion.id,
      });
      setIssuedCode(code);
      toast.success("Cupom gerado!", { description: `Mostre o codigo ${code} ao garcom.` });
    } catch {
      toast.error("Nao foi possivel gerar o cupom agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cupom" className="bg-primary/5 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
          <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {promotion.badge_text || "Promocao ativa"}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">{promotion.headline}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{promotion.description}</p>
          <p className="mt-3 text-xs text-muted-foreground">{promotion.eligibility_text}</p>
          {issuedCode ? (
            <div className="mt-8 rounded-lg border-2 border-dashed border-primary bg-primary/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Seu codigo de cupom
              </p>
              <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold tracking-widest text-primary break-all">
                {issuedCode}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Mostre esse codigo ao garcom no momento do pedido. O WhatsApp ja foi aberto em outra
                aba.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRedeem}
              disabled={loading}
              className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Gerando..." : promotion.cta_button_text || "Resgatar agora"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
export default CupomSection;
