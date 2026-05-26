import logoTendal from "@/assets/logo-tendal.png";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useSiteImage } from "@/hooks/useSupabaseQueries";

const NAV_LINKS = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#cupom", label: "Cupom" },
  { href: "#como-chegar", label: "Como chegar" },
  { href: "#testemunhos", label: "Testemunhos" },
  { href: "#faq", label: "FAQ" },
];

const Header = () => {
  const { config } = useSiteConfig();
  const logo = useSiteImage("logo_tendal");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/90 text-white backdrop-blur">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between pl-2 pr-3 md:pl-3 md:pr-4">
        <a href="/" className="flex items-center">
          <img
            src={logo?.url || logoTendal}
            alt={logo?.alt_text || config?.business_name || "Tendal Gastronomia"}
            className="h-12 md:h-14 w-auto"
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

        <a
          href="#como-chegar"
          className="rounded-md border border-white/30 px-3 py-2 text-xs md:text-sm font-semibold text-white hover:bg-white/10"
        >
          Como chegar
        </a>
      </div>
    </header>
  );
};

export default Header;
