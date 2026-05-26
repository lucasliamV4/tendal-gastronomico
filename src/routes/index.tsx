import CardapioSection from "@/components/site/CardapioSection";
import ComoChegarSection from "@/components/site/ComoChegarSection";
import CupomSection from "@/components/site/CupomSection";
import DiferenciaisSection from "@/components/site/DiferenciaisSection";
import FAQSection from "@/components/site/FAQSection";
import FooterCTA from "@/components/site/FooterCTA";
import Header from "@/components/site/Header";
import HeroSection from "@/components/site/HeroSection";
import TestemunhosSection from "@/components/site/TestemunhosSection";
import UrgentBanner from "@/components/site/UrgentBanner";
import WhatsAppWidget from "@/components/site/WhatsAppWidget";
import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://tendal-gastronomico.lovable.app";
const OG_IMAGE = `${SITE_URL}/images/hero.png`;
const TITLE = "Tendal Gastronomia — Almoço com brasa na Lapa | Chopp artesanal";
const DESCRIPTION =
  "Almoço grelhado no charbroiler, pátio arborizado e chopp artesanal próprio. Dentro do Centro Cultural Tendal da Lapa, a 60m do Poupa Tempo. Segunda a sexta, 11h30 às 15h.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "restaurante Lapa, almoço Lapa, churrasco Lapa, chopp artesanal, Tendal da Lapa, Poupa Tempo Lapa, charbroiler, almoço executivo São Paulo",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Tendal Gastronomia" },

      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "Prato grelhado no charbroiler do Tendal Gastronomia" },

      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Tendal Gastronomia",
          description: DESCRIPTION,
          url: SITE_URL,
          image: OG_IMAGE,
          servesCuisine: ["Brasileira", "Grelhados", "Churrasco"],
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Centro Cultural Tendal da Lapa",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            addressCountry: "BR",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "11:30",
              closes: "15:00",
            },
          ],
          acceptsReservations: false,
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <UrgentBanner />
      <Header />
      <main>
        <HeroSection />
        <DiferenciaisSection />
        <CardapioSection />
        <CupomSection />
        <ComoChegarSection />
        <TestemunhosSection />
        <FAQSection />
      </main>
      <FooterCTA />
      <WhatsAppWidget />
    </div>
  );
}
