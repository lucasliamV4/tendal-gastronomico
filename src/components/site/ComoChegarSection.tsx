import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useSiteImage } from "@/hooks/useSupabaseQueries";
import { trackEvent } from "@/lib/tracking";

const ComoChegarSection = () => {
  const { config } = useSiteConfig();
  const videoPoster = useSiteImage("route_video_poster");
  const handleOpenMaps = () => {
    trackEvent("FindLocation", { source: "como_chegar_button" });
    if (config?.google_maps_url)
      window.open(config.google_maps_url, "_blank", "noopener,noreferrer");
  };
  return (
    <section id="como-chegar" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">Como chegar</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              A {config?.reference_distance ?? "60 metros do Poupa Tempo"}, num quintal que você não
              imagina que existe.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Estamos dentro do {config?.reference_landmark ?? "Centro Cultural Tendal da Lapa"}. A
              entrada fica recuada da rua.
            </p>
            <div className="mt-8 rounded-xl border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Endereço
              </p>
              <p className="mt-2 font-heading text-xl font-bold">
                {config?.address_street ?? "Rua Guaicurus, 1100"}
              </p>
              <p className="text-sm text-muted-foreground">
                {config?.address_neighborhood ?? "Lapa"} - {config?.address_city ?? "São Paulo"}/
                {config?.address_state ?? "SP"} - {config?.address_postal_code ?? "05033-002"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenMaps}
              className="mt-6 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Abrir no Google Maps
            </button>
          </div>
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d384.53023699842925!2d-46.695966110537206!3d-23.52211478437109!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef86e2f4bbced%3A0x6a7648fd5bc55629!2sCentro%20Cultural%20Tendal%20da%20Lapa!5e0!3m2!1spt-BR!2sbr!4v1778870293016!5m2!1spt-BR!2sbr"
                title="Mapa"
                className="h-full w-full"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {videoPoster?.url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={videoPoster.url}
                  alt={videoPoster.alt_text || "Como chegar"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ComoChegarSection;
