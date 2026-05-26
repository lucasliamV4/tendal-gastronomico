Plano de configuracao das tags de SEO para a landing page do Tendal Gastronomia.

O que ja existe:
- `src/routes/__root.tsx` possui tags meta basicas (title, description, OG, twitter) no root
- `src/routes/index.tsx` (landing page) NAO possui `head()` configurado
- `lang="en"` no HTML — deve ser `pt-BR`
- Nao existe `robots.txt` nem `sitemap.xml`
- Nao existe JSON-LD estruturado
- `twitter:site` aponta para `@Lovable`

### Tarefas

1. **Corrigir idioma e defaults no `__root.tsx`**
   - Alterar `lang="en"` para `lang="pt-BR"`
   - Manter no root apenas meta tags globais (charset, viewport, og:type, twitter:card)
   - Remover title/description especificos do root (deixar para a rota filha)
   - Corrigir `twitter:site` se houver identidade do restaurante; senao, remover

2. **Adicionar `head()` ao `src/routes/index.tsx`**
   - `title`: titulo otimizado para a landing page
   - `name="description"`: descricao com palavras-chave de restaurante/almoco/Lapa
   - `property="og:title"` / `og:description"` / `og:type"` / `og:url"` / `og:image"`
   - `name="twitter:card"` / `twitter:title"` / `twitter:description"` / `twitter:image"`
   - `link rel="canonical"` com URL relativa "/"
   - `script type="application/ld+json"` com schema Restaurant (nome, endereco, horario, telefone, imagem)

3. **Criar `public/robots.txt`**
   - Permitir crawl em todas as rotas
   - Apontar sitemap

4. **Criar `public/sitemap.xml`**
   - URL da home com lastmod e prioridade 1.0

5. **Verificar imagem para OG**
   - Existe `/images/hero.png` que pode ser usada como og:image
   - Usar caminho absoluto relativo para og:image (o crawler resolve)

### Detalhes tecnicos
- Seguir o padrao TanStack Start: `head()` retorna `{ meta, links, scripts }`
- Title eh meta entry: `{ title: "..." }`
- Canonical vive em links: `[{ rel: "canonical", href: "/" }]`
- JSON-LD em scripts: `[{ type: "application/ld+json", children: JSON.stringify(...) }]`
- OG image usar path absoluto: `https://...` se possivel, senao relativo "/images/hero.png"
- Como o projeto ainda nao tem custom domain, og:url e canonical usam paths relativos