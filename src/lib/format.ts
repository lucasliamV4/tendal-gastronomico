export const WEEKDAY_LABELS_PT: Record<number, string> = {
  0: "Domingo",
  1: "Segunda",
  2: "Terca",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sabado",
};

export function formatBRL(cents: number | null | undefined): string {
  const value = (cents ?? 0) / 100;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseBRLToCents(input: string): number {
  if (!input) return 0;
  const cleaned = input
    .replace(/[^0-9,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  if (isNaN(n)) return 0;
  return Math.round(n * 100);
}

export function formatTime(t: string | null | undefined): string {
  if (!t) return "-";
  // Postgres time pode vir como "11:30:00"
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}
