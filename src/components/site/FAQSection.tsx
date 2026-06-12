import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "onde-fica",
    question: "Onde fica o Tendal Gastronomia?",
    answer: "Estamos dentro do Centro Cultural Tendal da Lapa, na Rua Guaicurus, 1100 - Lapa. A entrada fica recuada cerca de 60 metros da rua, atravessando o portão do Centro Cultural."
  },
  {
    id: "horario",
    question: "Qual o horário de almoço?",
    answer: "De segunda a sexta-feira, das 11h30 às 15h."
  },
  {
    id: "estacionamento",
    question: "Tem estacionamento?",
    answer: "Não. O estacionamento interno do Tendal da Lapa não está disponível para clientes."
  },
  {
    id: "cartao-pix",
    question: "Aceitam cartão e Pix?",
    answer: "Sim, aceitamos todos os cartões de crédito e débito, Pix e dinheiro."
  },
  {
    id: "vale-refeicao",
    question: "Vocês aceitam vale-refeição?",
    answer: "No momento não aceitamos, mas estamos avaliando essa possibilidade."
  },
  {
    id: "vegetariana",
    question: "Tem opção vegetariana?",
    answer: "Sim, temos pelo menos uma opção vegetariana no PF de cada dia. Pergunte ao atendente sobre o cardápio do dia."
  },
  {
    id: "promocao",
    question: "Como funciona a promoção para funcionários da região?",
    answer: "Funcionários do Poupatempo, JUCESP e Subprefeitura recebem um refrigerante pequeno grátis na compra do almoço mediante apresentação do crachá funcional."
  },
  {
    id: "reserva",
    question: "Posso fazer reserva?",
    answer: "No almoço a casa funciona por ordem de chegada, sem reservas."
  },
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
