import { useSiteImage } from "@/hooks/useSupabaseQueries";

type Differential = {
  imageSlot: string;
  title: string;
  description: string;
  badge?: string;
};

const DIFFERENTIALS: Differential[] = [
  {
    imageSlot: "charbroiler.png",
    title: "Carne grelhada na brasa",
    description:
      "Contrafile Ancho, bisteca, linguicas artesanais. Tudo no charbroiler - a mesma brasa do churrasco gaucho. Nada de chapa, nada de pressa.",
    badge: "Charbroiler",
  },
  {
    imageSlot: "ambiente.jpg",
    title: "Patio arborizado, fora do barulho da rua",
    description:
      "Um quintal verde dentro do Centro Cultural. Almoco sem buzina, com sombra de arvore e seguranca monitorada. Pausa de verdade.",
    badge: "Refugio urbano",
  },
  {
    imageSlot: "logo_tria.jpg",
    title: "Chopp artesanal proprio",
    description:
      "O chopp servido aqui sai da nossa propria cervejaria. Frescor garantido, e voce so vai encontrar nesse endereco.",
    badge: "Cervejaria propria",
  },
];

const DiferenciaisSection = () => (
  <section className="bg-background py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold md:text-4xl">O que nos diferencia</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Nao competimos por preco - competimos por experiencia.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Na regiao da Lapa tem 15 lugares vendendo PF a R$ 17. Nenhum entrega o que voce vai
          encontrar aqui.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {DIFFERENTIALS.map((diff) => (
          <DifferentialCard key={diff.imageSlot} {...diff} />
        ))}
      </div>
    </div>
  </section>
);

const DifferentialCard = ({ imageSlot, title, description, badge }: Differential) => {
  const localImageUrl = `/images/${imageSlot}`;
  
  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img src={localImageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {badge}
          </span>
        )}
        <h3 className="mt-3 font-heading text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </article>
  );
};

export default DiferenciaisSection;
