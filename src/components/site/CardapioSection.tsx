import { useState } from "react";
import { useMenuItems, useMenuCarouselImages, useSiteImages, useSiteConfigData } from "@/hooks/useSupabaseQueries";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const proteins = [
  { id: 'espetinho-carne', name: 'Espetinho de Carne', thumb: '/images/scroll_espetinho_carne.png', plate: '/images/plate_espetinho_carne.png' },
  { id: 'espetinho-frango', name: 'Espetinho de Frango', thumb: '/images/scroll_espetinho_frango.png', plate: '/images/plate_espetinho_frango.png' },
  { id: 'espetinho-misto', name: 'Espetinho Misto', thumb: '/images/scroll_espetinho_misto.png', plate: '/images/plate_espetinho_misto.png' },
  { id: 'espetinho-linguica', name: 'Espetinho de Linguiça', thumb: '/images/scroll_espetinho_linguica.png', plate: '/images/plate_espetinho_linguica.png' },
  { id: 'file-frango', name: 'Filé de Frango', thumb: '/images/scroll_file_frango.png', plate: '/images/plate_file_frango.png' },
  { id: 'contra-file', name: 'Contra-Filé', thumb: '/images/scroll_contra_file.png', plate: '/images/plate_contra_file.png' },
  { id: 'bisteca', name: 'Bisteca Suína', thumb: '/images/scroll_bisteca.png', plate: '/images/plate_bisteca.png' },
  { id: 'calabresa', name: 'Calabresa', thumb: '/images/scroll_calabresa.png', plate: '/images/plate_calabresa.png' }
];

const CardapioSection = () => {
  const { data: items, isLoading } = useMenuItems({ onlyActive: true });
  const [selectedProtein, setSelectedProtein] = useState(proteins[0]);
  const carouselImages = useMenuCarouselImages();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { data: allImages } = useSiteImages();
  const { data: siteTexts } = useSiteConfigData();

  // Helper to get dynamic image URL with local fallback
  const getThumb = (p: typeof proteins[0]) => {
    const dynamic = allImages?.find((i) => i.slot_key === `protein_thumb_${p.id}`);
    return dynamic?.url || p.thumb;
  };
  const getPlate = (p: typeof proteins[0]) => {
    const dynamic = allImages?.find((i) => i.slot_key === `protein_plate_${p.id}`);
    return dynamic?.url || p.plate;
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="cardapio" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black uppercase text-foreground leading-tight">
            Conheça nosso Cardápio
          </h2>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center">
          
          {/* Lado Esquerdo: Imagens (Reduzido) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted shadow-md">
              <img 
                src={getPlate(selectedProtein)} 
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
                    src={getThumb(p)} 
                    alt={p.name} 
                    className="h-full w-full object-cover bg-white" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Lado Direito: Copy / CTA */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:py-8">
            <h3 className="font-heading text-2xl md:text-3xl font-black uppercase text-primary leading-tight tracking-tight">
              {selectedProtein.name}
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {siteTexts?.menu_description || "Nosso tradicional Prato Feito acompanha arroz branco soltinho, feijão temperado com aquele gostinho caseiro, salada fresca, legumes salteados na manteiga e a proteína da sua escolha. Tudo preparado com ingredientes selecionados e o inconfundível sabor da brasa!"}
            </p>

            <div className="mt-2 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
              <div className="flex-1">
                <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                  {siteTexts?.menu_schedule_text || "PF servido de terça a sexta, das 11h30 às 15h."}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full">
              <a 
                href="https://wa.me/5511995120441" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#25D366] px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 whitespace-nowrap"
              >
                Pedir pelo WhatsApp
              </a>

              <Dialog onOpenChange={() => setCarouselIndex(0)}>
                <DialogTrigger asChild>
                  <button className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap">
                    Cardápio Completo
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] p-0 bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
                  <div className="flex flex-col">
                    {/* Carousel Area */}
                    {carouselImages.length > 0 ? (
                      <div className="relative w-full bg-gray-100">
                        <img 
                          src={carouselImages[carouselIndex]?.url} 
                          alt={`Cardápio página ${carouselIndex + 1}`} 
                          className="w-full max-h-[70vh] object-contain mx-auto"
                        />
                        
                        {/* Navigation arrows */}
                        {carouselImages.length > 1 && (
                          <>
                            <button 
                              onClick={handlePrev}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                              aria-label="Imagem anterior"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <button 
                              onClick={handleNext}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                              aria-label="Próxima imagem"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                          </>
                        )}

                        {/* Dot indicators */}
                        {carouselImages.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {carouselImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCarouselIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                  idx === carouselIndex 
                                    ? 'bg-primary scale-125' 
                                    : 'bg-white/70 hover:bg-white'
                                }`}
                                aria-label={`Ir para imagem ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                        <p className="text-muted-foreground text-lg">Cardápio em breve!</p>
                      </div>
                    )}

                    {/* WhatsApp CTA inside popup */}
                    <div className="p-6 flex justify-center">
                      <a 
                        href="https://wa.me/5511995120441" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex h-14 items-center justify-center rounded-full bg-[#25D366] px-10 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                      >
                        Pedir pelo WhatsApp
                      </a>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardapioSection;
