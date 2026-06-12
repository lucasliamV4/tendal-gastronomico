import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "estacionamento",
    question: "Tem estacionamento?",
    answer: "Não. O estacionamento interno do Tendal da Lapa não está disponível para clientes."
  },
  {
    id: "vale-refeicao",
    question: "Vocês aceitam vale-refeição?",
    answer: "No momento não aceitamos, mas estamos avaliando essa possibilidade."
  },
  {
    id: "promocao",
    question: "Como funciona a promoção para funcionários da região?",
    answer: "Funcionários do Poupatempo, JUCESP e Subprefeitura recebem um refrigerante pequeno grátis na compra do almoço mediante apresentação do crachá funcional."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Perguntas frequentes</h2>
          <p className="mt-3 text-lg text-muted-foreground">Dúvidas comuns sobre o Tendal.</p>
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
