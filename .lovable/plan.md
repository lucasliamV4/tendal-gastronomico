Análise de performance: o site carrega 55MB de imagens. Os culpados:

| Arquivo | Tamanho | Uso |
|---|---|---|
| `ambiente.jpg` | **24MB** | Card "Pátio arborizado" (4:3, pequeno) |
| `logo_tria.jpg` | **12MB** | Card "Chopp artesanal" (4:3, pequeno) |
| `charbroiler.png` | 2.7MB | Card "Carne na brasa" |
| `hero.png` | 2.3MB | Background do Hero (LCP) |
| `plate_*.png` (5 arquivos) | ~2.5MB cada | Cardápio (quadrado ~600px) |
| `scroll_*.png` (5 arquivos) | ~600–900KB | Thumbs 80×80 do cardápio |

FCP = 3.2s, DOM Interactive = 1.7s. Cada imagem leva 1.5–2.2s pra baixar.

## Plano

### 1. Comprimir imagens (sem mudar caminho)
Usar `imagemagick` (via nix) para reescrever todos os arquivos in-place, mantendo nomes:
- `ambiente.jpg` → reencodar a 1600px largura, qualidade 80 (~200KB)
- `logo_tria.jpg` → idem
- `hero.png` → reencodar como PNG otimizado de 1920px (~300KB)
- `charbroiler.png` e `plate_*.png` → reduzir para 800px, qualidade 85 (~150KB cada)
- `scroll_*.png` → 160×160 (2× o tamanho exibido), qualidade 80 (~20KB cada)

Mantenho extensões originais para não tocar em código.

### 2. Lazy-load + decoding async em imagens não-críticas
- `DiferenciaisSection`: `loading="lazy" decoding="async"` nas 3 imagens
- `CardapioSection`: `loading="lazy"` nas thumbs e prato
- `ComoChegarSection`: já tem `loading="lazy"` no iframe ✓

### 3. Hero como LCP
- O hero é background-image via CSS (`url('/images/hero.png')`). Background images não são pré-detectadas pelo preload scanner.
- Adicionar `<link rel="preload" as="image" href="/images/hero.png" fetchpriority="high">` no `head().links` da rota `/`.

### 4. Adicionar `width`/`height` nas imagens
Previne CLS — DiferenciaisSection, CardapioSection plates e thumbs.

### 5. Iframe do Google Maps
Já tem `loading="lazy"`. Sem mudança.

## Fora de escopo
- Não vou migrar para `.webp` (exigiria renomear arquivos no Supabase e em vários componentes). A compressão JPEG/PNG já resolve 95% do problema.
- Não vou mexer em fontes, bundle splitting ou CSS — não são o gargalo.
- Não vou trocar PNGs por JPG (a transparência é irrelevante aqui mas evita risco de regressão visual).

## Resultado esperado
- 55MB → ~3MB de imagens
- FCP esperado: 3.2s → ~1.2s
- LCP do hero pré-carregado