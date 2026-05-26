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

export const Route = createFileRoute("/")({
  component: Index,
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
