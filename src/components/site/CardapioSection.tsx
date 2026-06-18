import { useState } from "react";
import { useMenuItems, useSiteImage } from "@/hooks/useSupabaseQueries";
import { formatBRL } from "@/lib/format";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const proteins = [
  { id: 'espetinho-carne', name: 'Espetinho de Carne', price: 'R$ 29,90', thumb: '/images/scroll_espetinho_carne.png', plate: '/images/plate_espetinho_carne.png' },
  { id: 'espetinho-frango', name: 'Espetinho de Frango', price: 'R$ 26,90', thumb: '/images/scroll_espetinho_frango.png', plate: '/images/plate_espetinho_frango.png' },
  { id: 'espetinho-misto', name: 'Espetinho Misto', price: 'R$ 28,90', thumb: '/images/scroll_espetinho_misto.png', plate: '/images/plate_espetinho_misto.png' },
  { id: 'espetinho-linguica', name: 'Espetinho de Linguiça', price: 'R$ 26,90', thumb: '/images/scroll_espetinho_linguica.png', plate: '/images/plate_espetinho_linguica.png' },
  { id: 'file-frango', name: 'Filé de Frango', price: 'R$ 27,90', thumb: '/images/scroll_file_frango.png', plate: '/images/plate_file_frango.png' },
  { id: 'contra-file', name: 'Contra-Filé', price: 'R$ 34,90', thumb: '/images/scroll_contra_file.png', plate: '/images/plate_contra_file.png' },
  { id: 'bisteca', name: 'Bisteca Suína', price: 'R$ 28,90', thumb: '/images/scroll_bisteca.png', plate: '/images/plate_bisteca.png' },
  { id: 'calabresa', name: 'Calabresa', price: 'R$ 26,90', thumb: '/images/scroll_calabresa.png', plate: '/images/plate_calabresa.png' }
];

const CardapioSection = () => {
  const { data: items, isLoading } = useMenuItems({ onlyActive: true });
  const [selectedProtein, setSelectedProtein] = useState(proteins[0]);
  const fullMenuImage = useSiteImage("full_menu_image");

  return (
    <section id="cardapio" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center">
          
          {/* Lado Esquerdo: Imagens (Reduzido) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted shadow-md">
              <img 
                src={selectedProtein.plate} 
                alt={selectedProtein.name} 
                className="h-full w-full object-cover transition-opacity duration-500" 
              />
            </div>
            
            {/* Scroll Horizontal de Proteínas */}
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {proteins.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProtein(p)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 snap-start transition-all ${
                    selectedProtein.id === p.id ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={p.thumb} 
                    alt={p.name} 
                    className="h-full w-full object-cover bg-white" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Lado Direito: Copy / CTA */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:py-8">
            <h3 className="font-heading text-3xl md:text-4xl font-black uppercase text-foreground leading-tight tracking-tight">
              {selectedProtein.name} <span className="text-primary">{selectedProtein.price}</span>
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nosso tradicional Prato Feito acompanha arroz branco soltinho, feijão temperado com aquele gostinho caseiro, salada fresca, legumes salteados na manteiga e a proteína da sua escolha. Tudo preparado com ingredientes selecionados e o inconfundível sabor da brasa!
            </p>

            <div className="mt-2 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
              <div className="flex-1">
                <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                  PF servido de terça a sexta, das 11h30 às 15h.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-fit">
              <a 
                href="https://wa.me/5511995120441" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#25D366] px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 w-full"
              >
                Pedir pelo WhatsApp
              </a>

              {fullMenuImage?.url && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full">
                      Ver Cardápio Completo
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-[95vw] p-1 bg-transparent border-none shadow-none flex justify-center items-center">
                    <img 
                      src={fullMenuImage.url} 
                      alt="Cardápio Completo" 
                      className="max-h-[90vh] max-w-full object-contain rounded-xl"
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardapioSection;
