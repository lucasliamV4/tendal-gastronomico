import { usePromotion } from "@/hooks/useSupabaseQueries";

const CupomSection = () => {
  const { data: promotion } = usePromotion();
  if (!promotion?.active) return null;

  return (
    <section id="cupom" className="bg-primary/5 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
          <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {promotion.badge_text || "Promocao ativa"}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">{promotion.headline}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{promotion.description}</p>
          <p className="mt-3 text-xs text-muted-foreground">{promotion.eligibility_text}</p>
          <p className="mt-8 text-sm font-semibold text-primary">
            Basta apresentar seu crachá funcional no caixa ao fazer o pedido.
          </p>
        </div>
      </div>
    </section>
  );
};
export default CupomSection;
