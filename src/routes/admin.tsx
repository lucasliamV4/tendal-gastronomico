import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useUploadSiteImage } from "@/hooks/useSupabaseQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const uploadImage = useUploadSiteImage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "tendal2026") {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadImage.mutateAsync({ slotKey: "full_menu_image", file });
      alert("Cardápio atualizado com sucesso!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer upload. Verifique se o Storage do Supabase está configurado corretamente.");
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
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        <div className="border p-6 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Atualizar Foto do Cardápio Completo</h2>
          <p className="text-sm text-gray-500 mb-4">Esta imagem aparecerá quando os clientes clicarem em "Ver Cardápio Completo".</p>
          
          <div className="flex flex-col gap-4">
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploadImage.isPending}
            >
              {uploadImage.isPending ? "Enviando..." : "Salvar Foto"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
