import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { usePromotion, useSiteImage } from "@/hooks/useSupabaseQueries";
import { trackEvent } from "@/lib/tracking";

const HeroSection = () => {
  const { config } = useSiteConfig();
  const { redeemCoupon } = useWhatsApp();
  const heroBg = useSiteImage("hero_background");
  const { data: promotion } = usePromotion();

  const reference = config?.reference_distance ?? "60 metros do Poupa Tempo Lapa";

  const handleRedeem = async () => {
    await redeemCoupon({
      source: "hero_redeem",
      template: promotion?.whatsapp_message_template,
      promotionId: promotion?.id ?? null,
    });
  };

  const handleSeeMap = () => {
    trackEvent("FindLocation", { source: "hero_map" });
    if (config?.google_maps_url) {
      window.open(config.google_maps_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-neutral-900 text-white"
      style={{
        backgroundImage: `url('/images/hero.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex max-w-full items-center whitespace-nowrap overflow-hidden text-ellipsis rounded-full bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
            {reference}
          </span>

          <h1 className="mt-4 break-words font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-5xl lg:text-6xl">
            Almoço de verdade na Lapa: brasa, ambiente arborizado e chopp artesanal próprio.
          </h1>

          <p className="mt-5 text-lg text-white/85 md:text-xl">
            Dentro do Centro Cultural Tendal da Lapa. Carne grelhada no charbroiler, arroz que muda
            toda semana, e um pátio pra você comer sem pressa.
          </p>

          {promotion?.active && (
            <div className="mt-6 rounded-lg border border-white/15 bg-white/5 p-4 backdrop-blur">
              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                {promotion.badge_text}
              </span>
              <p className="mt-2 text-sm text-white/90">{promotion.description}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {promotion?.active && (
              <button
                type="button"
                onClick={handleRedeem}
                className="rounded-md bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                {promotion.cta_button_text || "Resgatar brinde no WhatsApp"}
              </button>
            )}
            <button
              type="button"
              onClick={handleSeeMap}
              className="rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ver no mapa
            </button>
          </div>

          <p className="mt-8 text-xs uppercase tracking-wide text-white/65">
            Almoco de segunda a sexta · 11h30 as 15h
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
