import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  useUploadSiteImage,
  useMenuCarouselImages,
  useDeleteMenuCarouselImage,
} from "@/hooks/useSupabaseQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

const SLOT_KEYS = [
  "menu_carousel_1",
  "menu_carousel_2",
  "menu_carousel_3",
  "menu_carousel_4",
  "menu_carousel_5",
];

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const uploadTimestamps = useRef<number[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "tendal2026") {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta");
    }
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
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-sm text-gray-500 mb-8">
          Gerencie as imagens do cardápio completo. Máximo de 5 imagens, até {MAX_FILE_SIZE_MB}MB cada.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SLOT_KEYS.map((slotKey, index) => (
            <SlotCard
              key={slotKey}
              slotKey={slotKey}
              index={index}
              uploadTimestamps={uploadTimestamps}
            />
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700">
            <strong>Limite de segurança:</strong> máximo de {RATE_LIMIT_MAX} uploads a cada 2 minutos.
          </p>
        </div>
      </div>
    </div>
  );
}

function SlotCard({
  slotKey,
  index,
  uploadTimestamps,
}: {
  slotKey: string;
  index: number;
  uploadTimestamps: React.MutableRefObject<number[]>;
}) {
  const carouselImages = useMenuCarouselImages();
  const uploadImage = useUploadSiteImage();
  const deleteImage = useDeleteMenuCarouselImage();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingImage = carouselImages.find((i) => i.slot_key === slotKey);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    // Remove timestamps older than the window
    uploadTimestamps.current = uploadTimestamps.current.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );
    if (uploadTimestamps.current.length >= RATE_LIMIT_MAX) {
      const oldestInWindow = uploadTimestamps.current[0];
      const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldestInWindow)) / 1000);
      alert(`Limite de uploads atingido. Tente novamente em ${waitSeconds} segundos.`);
      return false;
    }
    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be re-selected
    e.target.value = "";

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    if (!checkRateLimit()) return;

    setIsUploading(true);
    try {
      uploadTimestamps.current.push(Date.now());
      await uploadImage.mutateAsync({ slotKey, file });
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer upload. Verifique se o Storage do Supabase está configurado.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remover esta imagem do cardápio?")) return;
    try {
      await deleteImage.mutateAsync(slotKey);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover imagem.");
    }
  };

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
      <p className="text-sm font-semibold text-gray-700">
        Imagem {index + 1}
      </p>

      {/* Preview */}
      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        {existingImage ? (
          <img
            src={existingImage.url}
            alt={`Cardápio ${index + 1}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-center px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <p className="text-xs">Sem imagem</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Enviando…
            </span>
          ) : existingImage ? (
            "Trocar"
          ) : (
            "Adicionar"
          )}
        </Button>

        {existingImage && (
          <Button
            variant="destructive"
            size="sm"
            disabled={isUploading || deleteImage.isPending}
            onClick={handleDelete}
          >
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
