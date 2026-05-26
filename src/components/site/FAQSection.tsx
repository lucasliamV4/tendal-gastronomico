import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQ } from "@/hooks/useSupabaseQueries";
const FAQSection = () => {
  const { data: faqs } = useFAQ({ onlyActive: true });
  if (!faqs || faqs.length === 0) return null;
  return (
    <section id="faq" className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Perguntas frequentes</h2>
          <p className="mt-3 text-lg text-muted-foreground">Duvidas comuns sobre o Tendal.</p>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
export default FAQSection;
