Revisão da versão mobile (390px) da landing do Tendal. Naveguei pelo preview e identifiquei os ajustes abaixo.

## Problemas encontrados

### 1. Header (`src/components/site/Header.tsx`)
- **Logo gigante**: `h-16 md:h-20` ocupa quase metade da altura do header no mobile, espremendo o botão WhatsApp.
- **Navegação sumida**: o `<nav>` está `hidden md:flex`. No mobile não existe menu hambúrguer — usuário não consegue pular para Cardápio, Cupom, Como chegar, etc.

### 2. FooterCTA (`src/components/site/FooterCTA.tsx`)
- Logo `h-32 md:h-40` (128px) é exagerada no mobile, empurra o conteúdo principal para baixo.

### 3. CardapioSection (`src/components/site/CardapioSection.tsx`)
- Existe um `<div className="mx-auto max-w-2xl text-center">` **vazio** logo no topo da seção (linhas 20–22) gerando espaço morto.
- Não há um título de seção “Cardápio” acima — só aparece o H3 "O PRATO NOSSO DE CADA DIA...".

### 4. WhatsAppWidget (`src/components/site/WhatsAppWidget.tsx`)
- Botão flutuante fixo em `bottom-5 right-5` sobrepõe o botão verde "Pedir pelo WhatsApp" no cardápio e os CTAs do footer no mobile.
- Sem `padding-bottom` no `<main>` para compensar.

### 5. Hero (`src/components/site/HeroSection.tsx`)
- O badge "60 METROS DO POUPA TEMPO LAPA" quebra em duas linhas. Pode usar `whitespace-nowrap` ou texto mais curto no mobile.
- H1 com `break-words` ok, mas o tamanho `text-3xl sm:text-4xl` pode ser ajustado para `text-4xl` no mobile para mais impacto.

### 6. ComoChegarSection (`src/components/site/ComoChegarSection.tsx`)
- O mapa do Google fica vazio/branco no preview mobile (visualmente é um grande bloco em branco entre "Abrir no Google Maps" e o footer). Vou validar se o iframe está carregando ou se precisa de fallback.

## Tarefas

1. **Header**: reduzir logo para `h-10 md:h-14`, adicionar menu hambúrguer mobile (sheet/drawer simples) com os links de seção.
2. **FooterCTA**: reduzir logo para `h-20 md:h-32`.
3. **CardapioSection**: remover o div vazio, adicionar título "Nosso Cardápio" + subtítulo curto no padrão das outras seções.
4. **WhatsAppWidget**: ocultar widget flutuante quando o footer estiver visível (intersection observer) **ou** mais simples — adicionar `pb-24` no `<main>` para que o widget nunca cubra CTA. Vou pela solução simples.
5. **Hero**: badge com `whitespace-nowrap` e padding reduzido; aumentar H1 mobile para `text-4xl`.
6. **ComoChegar**: confirmar que iframe carrega; senão, manter mas garantir altura mínima razoável e adicionar um link "Abrir mapa" como fallback (já existe).

## Fora de escopo
- Não vou mexer em paleta de cores, tipografia ou backend.
- Não vou alterar a Testemunhos / FAQ (já retornam `null` quando sem dados — comportamento correto).