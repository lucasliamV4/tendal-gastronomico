import { useSiteConfigData } from "@/hooks/useSupabaseQueries";
import type { SiteConfig } from "@/lib/supabase";
import { createContext, useContext, type ReactNode } from "react";

type Value = { config: SiteConfig | null; loading: boolean };

const Ctx = createContext<Value>({ config: null, loading: true });

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useSiteConfigData();
  return (
    <Ctx.Provider value={{ config: data ?? null, loading: isLoading }}>{children}</Ctx.Provider>
  );
}

export function useSiteConfig() {
  return useContext(Ctx);
}
