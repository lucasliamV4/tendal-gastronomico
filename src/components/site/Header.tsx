import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoTendal from "@/assets/logo-tendal.png";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useSiteImage } from "@/hooks/useSupabaseQueries";

const NAV_LINKS = [
  { href: "#cardapio", label: "Cardapio" },
  { href: "#cupom", label: "Cupom" },
  { href: "#como-chegar", label: "Como chegar" },
  { href: "#testemunhos", label: "Testemunhos" },
  { href: "#faq", label: "FAQ" },
];

const Header = () => {
  const { config } = useSiteConfig();
  const { openWhatsApp } = useWhatsApp();
  const logo = useSiteImage("logo_tendal");
  const [open, setOpen] = useState(false);

  const handleWhatsAppClick = () => {
    openWhatsApp({
      source: "header_cta",
      template: `Ola! Quero almocar no ${config?.business_name ?? "Tendal"}. Pode me dar mais informacoes?`,
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/90 text-white backdrop-blur">
      <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-3">
          <img
            src={logo?.url || logoTendal}
            alt={logo?.alt_text || config?.business_name || "Tendal Gastronomia"}
            className="h-16 md:h-24 w-auto"
          />
          <span className="sr-only">{config?.business_name ?? "Tendal Gastronomia"}</span>
        </a>

        <nav
          aria-label="Secoes do site"
          className="hidden items-center gap-6 text-sm text-white/80 md:flex"
        >
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="rounded-md bg-whatsapp px-3 py-2 text-xs md:text-sm font-semibold text-whatsapp-foreground hover:bg-whatsapp/90"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/80 hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Menu mobile"
          className="md:hidden border-t border-white/10 bg-neutral-950/95 backdrop-blur"
        >
          <ul className="container mx-auto flex flex-col px-4 py-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-white/85 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
