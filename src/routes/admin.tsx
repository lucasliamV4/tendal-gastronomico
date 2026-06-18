import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  useUploadSiteImage,
  useMenuCarouselImages,
  useDeleteMenuCarouselImage,
  useSiteImages,
  useSiteConfigData,
  useUpdateSiteConfig,
} from "@/hooks/useSupabaseQueries";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000;

const CAROUSEL_SLOTS = [
  "menu_carousel_1",
  "menu_carousel_2",
  "menu_carousel_3",
  "menu_carousel_4",
  "menu_carousel_5",
];

const PROTEINS = [
  { id: "espetinho-carne", name: "Espetinho de Carne" },
  { id: "espetinho-frango", name: "Espetinho de Frango" },
  { id: "espetinho-misto", name: "Espetinho Misto" },
  { id: "espetinho-linguica", name: "Espetinho de Linguiça" },
  { id: "file-frango", name: "Filé de Frango" },
  { id: "contra-file", name: "Contra-Filé" },
  { id: "bisteca", name: "Bisteca Suína" },
  { id: "calabresa", name: "Calabresa" },
];

type TabId = "cardapio" | "pratos" | "hero" | "textos";

const TABS: { id: TabId; label: string }[] = [
  { id: "cardapio", label: "Cardápio Completo" },
  { id: "pratos", label: "Fotos dos Pratos" },
  { id: "hero", label: "Hero" },
  { id: "textos", label: "Textos" },
];

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("cardapio");
  const uploadTimestamps = useRef<number[]>([]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Fallback/simplificação: ainda aceitamos a senha fixa para facilitar,
    // MAS precisamos fazer o login real no Supabase por trás dos panos
    // para ganhar a permissão 'authenticated' do RLS.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@tendal.com",
      password: password,
    });

    if (error) {
      console.error("Login erro:", error);
      alert("Senha incorreta ou usuário não configurado no Supabase.");
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoggingIn(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center mb-2">Acesso Restrito</h1>
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {activeTab === "cardapio" && (
            <TabCardapio uploadTimestamps={uploadTimestamps} />
          )}
          {activeTab === "pratos" && (
            <TabPratos uploadTimestamps={uploadTimestamps} />
          )}
          {activeTab === "hero" && (
            <TabHero uploadTimestamps={uploadTimestamps} />
          )}
          {activeTab === "textos" && <TabTextos />}
        </div>

        <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700">
            <strong>Limite de segurança:</strong> máximo de {RATE_LIMIT_MAX} uploads a cada 2 minutos. Tamanho máximo: {MAX_FILE_SIZE_MB}MB por imagem.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Rate limiter helper
   ============================================================ */

function checkRateLimit(uploadTimestamps: React.MutableRefObject<number[]>): boolean {
  const now = Date.now();
  uploadTimestamps.current = uploadTimestamps.current.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (uploadTimestamps.current.length >= RATE_LIMIT_MAX) {
    const oldest = uploadTimestamps.current[0];
    const wait = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
    alert(`Limite de uploads atingido. Tente novamente em ${wait} segundos.`);
    return false;
  }
  return true;
}

/* ============================================================
   Reusable image slot component
   ============================================================ */

function ImageSlot({
  slotKey,
  label,
  uploadTimestamps,
  aspectRatio = "aspect-[3/4]",
}: {
  slotKey: string;
  label: string;
  uploadTimestamps: React.MutableRefObject<number[]>;
  aspectRatio?: string;
}) {
  const { data: allImages } = useSiteImages();
  const uploadImage = useUploadSiteImage();
  const deleteImage = useDeleteMenuCarouselImage();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingImage = allImages?.find((i) => i.slot_key === slotKey);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    if (!checkRateLimit(uploadTimestamps)) return;

    setIsUploading(true);
    try {
      uploadTimestamps.current.push(Date.now());
      await uploadImage.mutateAsync({ slotKey, file });
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remover esta imagem?")) return;
    try {
      await deleteImage.mutateAsync(slotKey);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover imagem.");
    }
  };

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div className={`${aspectRatio} w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center`}>
        {existingImage ? (
          <img src={existingImage.url} alt={label} className="h-full w-full object-contain" />
        ) : (
          <div className="text-gray-400 text-center px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <p className="text-xs">Sem imagem</p>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
          {isUploading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Enviando…
            </span>
          ) : existingImage ? "Trocar" : "Adicionar"}
        </Button>
        {existingImage && (
          <Button variant="destructive" size="sm" disabled={isUploading || deleteImage.isPending} onClick={handleDelete}>
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Tab 1: Cardápio Completo (carousel images)
   ============================================================ */

function TabCardapio({ uploadTimestamps }: { uploadTimestamps: React.MutableRefObject<number[]> }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Imagens do Cardápio Completo</h2>
      <p className="text-sm text-gray-500 mb-6">
        Estas imagens aparecem quando o cliente clica em "Cardápio Completo". Máximo 5 imagens.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAROUSEL_SLOTS.map((slot, i) => (
          <ImageSlot key={slot} slotKey={slot} label={`Página ${i + 1}`} uploadTimestamps={uploadTimestamps} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Tab 2: Fotos dos Pratos
   ============================================================ */

function TabPratos({ uploadTimestamps }: { uploadTimestamps: React.MutableRefObject<number[]> }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Fotos dos Pratos</h2>
      <p className="text-sm text-gray-500 mb-6">
        Cada prato tem 2 fotos: a miniatura do scroll e a foto grande. Se nenhuma for enviada, a imagem padrão será usada.
      </p>
      <div className="space-y-8">
        {PROTEINS.map((protein) => (
          <div key={protein.id} className="border rounded-xl p-4 bg-gray-50/50">
            <h3 className="font-semibold text-lg mb-4">{protein.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageSlot
                slotKey={`protein_thumb_${protein.id}`}
                label="Miniatura (scroll)"
                uploadTimestamps={uploadTimestamps}
                aspectRatio="aspect-square"
              />
              <ImageSlot
                slotKey={`protein_plate_${protein.id}`}
                label="Foto do prato"
                uploadTimestamps={uploadTimestamps}
                aspectRatio="aspect-square"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Tab 3: Hero
   ============================================================ */

function TabHero({ uploadTimestamps }: { uploadTimestamps: React.MutableRefObject<number[]> }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Imagem de Fundo do Hero</h2>
      <p className="text-sm text-gray-500 mb-6">
        Esta é a imagem de fundo que aparece na parte superior do site.
      </p>
      <div className="max-w-md">
        <ImageSlot
          slotKey="hero_background"
          label="Fundo do Hero"
          uploadTimestamps={uploadTimestamps}
          aspectRatio="aspect-video"
        />
      </div>
    </div>
  );
}

/* ============================================================
   Tab 4: Textos
   ============================================================ */

function TabTextos() {
  const { data: config } = useSiteConfigData();
  const updateConfig = useUpdateSiteConfig();

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [menuDesc, setMenuDesc] = useState("");
  const [menuSchedule, setMenuSchedule] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load current values from config
  if (config && !loaded) {
    setHeroTitle(config.hero_title ?? "Almoço e tranquilidade na Lapa: brasa, ambiente arborizado e chopp artesanal próprio.");
    setHeroSubtitle(config.hero_subtitle ?? "Dentro do Centro Cultural Tendal da Lapa. Carne grelhada no charbroiler, arroz que muda toda semana, e um patio pra voce comer sem pressa.");
    setMenuDesc(config.menu_description ?? "Nosso tradicional Prato Feito acompanha arroz branco soltinho, feijão temperado com aquele gostinho caseiro, salada fresca, legumes salteados na manteiga e a proteína da sua escolha. Tudo preparado com ingredientes selecionados e o inconfundível sabor da brasa!");
    setMenuSchedule(config.menu_schedule_text ?? "PF servido de terça a sexta, das 11h30 às 15h.");
    setLoaded(true);
  }

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        menu_description: menuDesc,
        menu_schedule_text: menuSchedule,
      });
      alert("Textos salvos com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar textos.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Textos do Site</h2>
      <p className="text-sm text-gray-500 mb-6">
        Edite os textos que aparecem nas seções principais do site.
      </p>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título do Hero</label>
          <textarea
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo do Hero</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Cardápio</label>
          <textarea
            value={menuDesc}
            onChange={(e) => setMenuDesc(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário do Cardápio</label>
          <Input
            value={menuSchedule}
            onChange={(e) => setMenuSchedule(e.target.value)}
          />
        </div>
        <Button onClick={handleSave} disabled={updateConfig.isPending} className="w-full sm:w-auto">
          {updateConfig.isPending ? "Salvando..." : "Salvar Textos"}
        </Button>
      </div>
    </div>
  );
}
