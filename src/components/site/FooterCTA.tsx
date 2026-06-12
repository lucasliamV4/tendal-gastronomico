import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { usePromotion, useSiteImage } from "@/hooks/useSupabaseQueries";
import { trackEvent } from "@/lib/tracking";
import logoTendal from "@/assets/logo-tendal.png";
const FooterCTA = () => {
  const { config } = useSiteConfig();
  const { redeemCoupon, openWhatsApp } = useWhatsApp();
  const { data: promotion } = usePromotion();
  const logo = useSiteImage("logo_tendal");
  const handleOpenMaps = () => {
    trackEvent("FindLocation", { source: "footer_map" });
    if (config?.google_maps_url)
      window.open(config.google_maps_url, "_blank", "noopener,noreferrer");
  };
  const handleRedeem = async () => {
    if (promotion?.active)
      await redeemCoupon({
        source: "footer_redeem",
        template: promotion.whatsapp_message_template,
        promotionId: promotion.id,
      });
    else await openWhatsApp({ source: "footer_whatsapp" });
  };
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-8">
            <img
              src={logo?.url || logoTendal}
              alt={logo?.alt_text || config?.business_name || "Tendal Gastronomia"}
              className="h-32 md:h-40 w-auto"
            />
          </div>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Bate o ponto, atravessa a rua e vem almocar.
          </h2>
          <p className="mt-4 text-lg text-white/80">
            A {config?.reference_distance ?? "60 metros do Poupa Tempo"}. Brasa acesa de segunda a
            sexta, 11h30 as 15h.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRedeem}
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {promotion?.active
                ? promotion.cta_button_text || "Resgatar brinde no WhatsApp"
                : "Falar no WhatsApp"}
            </button>
            <button
              type="button"
              onClick={handleOpenMaps}
              className="rounded-md border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Ver no mapa
            </button>
          </div>
          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/65">
            <p>
              {config?.business_name ?? "Tendal Gastronomia"} -{" "}
              {config?.address_street ?? "Rua Guaicurus, 1100"} -{" "}
              {config?.address_neighborhood ?? "Lapa"}, {config?.address_city ?? "Sao Paulo"}/
              {config?.address_state ?? "SP"}
            </p>
            {config?.instagram_url && (
              <p className="mt-2">
                <a
                  href={config.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  Instagram
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterCTA;
