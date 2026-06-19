import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useSiteImages } from "@/hooks/useSupabaseQueries";

const TESTEMUNHO_SLOTS = [
  "testemunho_1",
  "testemunho_2",
  "testemunho_3",
  "testemunho_4",
  "testemunho_5",
  "testemunho_6",
];

const TestemunhosSection = () => {
  const { config } = useSiteConfig();
  const { data: allImages } = useSiteImages();

  const images = (allImages ?? [])
    .filter((img) => TESTEMUNHO_SLOTS.includes(img.slot_key))
    .sort((a, b) => a.slot_key.localeCompare(b.slot_key));

  // Hide section if not configured or no images uploaded
  if (!config?.testemunhos_visible || images.length === 0) return null;

  const title = config.testemunhos_title ?? "Quem já foi";
  const subtitle = config.testemunhos_subtitle ?? "O que os clientes falam.";

  return (
    <section id="testemunhos" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Horizontal scroll gallery */}
        <div
          className="mt-12 flex gap-5 overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="flex-shrink-0 overflow-hidden rounded-2xl border border-border/40 shadow-sm transition-transform duration-300 hover:scale-[1.02]"
              style={{
                scrollSnapAlign: "start",
                width: "min(85vw, 420px)",
              }}
            >
              <img
                src={img.url}
                alt={img.alt_text || "Testemunho de cliente"}
                className="block h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestemunhosSection;
