import logoTendal from "@/assets/logo-tendal.png";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useSiteImage } from "@/hooks/useSupabaseQueries";

const Header = () => {
  const { config } = useSiteConfig();
  const { openWhatsApp } = useWhatsApp();
  const logo = useSiteImage("logo_tendal");

  const handleWhatsAppClick = () => {
    openWhatsApp({
      source: "header_cta",
      template: `Ola! Quero almocar no ${config?.business_name ?? "Tendal"}. Pode me dar mais informacoes?`,
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/90 text-white backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-3">
          <img
            src={logo?.url || logoTendal}
            alt={logo?.alt_text || config?.business_name || "Tendal Gastronomia"}
            className="h-16 md:h-20 w-auto"
          />
          <span className="sr-only">{config?.business_name ?? "Tendal Gastronomia"}</span>
        </a>

        <nav
          aria-label="Secoes do site"
          className="hidden items-center gap-6 text-sm text-white/80 md:flex"
        >
          <a href="#cardapio" className="hover:text-white">
            Cardapio
          </a>
          <a href="#como-chegar" className="hover:text-white">
            Como chegar
          </a>
          {config?.testemunhos_visible && (
            <a href="#testemunhos" className="hover:text-white">
              Testemunhos
            </a>
          )}
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>

        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="rounded-md bg-whatsapp px-3 py-2 text-sm font-semibold text-whatsapp-foreground hover:bg-whatsapp/90"
        >
          WhatsApp
        </button>
      </div>
    </header>
  );
};

export default Header;
