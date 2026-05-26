import { useTestimonials } from "@/hooks/useSupabaseQueries";
const TestemunhosSection = () => {
  const { data: testimonials } = useTestimonials({ onlyActive: true });
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section id="testemunhos" className="bg-secondary/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Quem já foi</h2>
          <p className="mt-3 text-lg text-muted-foreground">O que os clientes falam.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <span key={i} aria-hidden>
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed break-words">{t.content}</p>
              <div className="mt-4 border-t pt-3">
                <p className="text-sm font-semibold">{t.author_name}</p>
                {t.author_context && (
                  <p className="text-xs text-muted-foreground">{t.author_context}</p>
                )}
                {t.source && (
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    via {t.source}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TestemunhosSection;
