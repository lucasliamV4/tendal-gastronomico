## Revisão ortográfica do português

Vou corrigir os textos hardcoded com acentos/cedilhas faltando. Strings vindas do banco (FAQ, depoimentos, cardápio, promoção, banner urgente, config do site) não são tocadas — são editáveis pelo admin.

### `src/components/site/Header.tsx`
- "Cardapio" → "Cardápio"
- "Secoes do site" → "Seções do site"

### `src/components/site/HeroSection.tsx`
- Já corrigido anteriormente. Manter.

### `src/components/site/DiferenciaisSection.tsx`
- "Contrafile Ancho, bisteca, linguicas artesanais. Tudo no charbroiler - a mesma brasa do churrasco gaucho." → "Contrafilé Ancho, bisteca, linguiças artesanais. Tudo no charbroiler — a mesma brasa do churrasco gaúcho."
- "Patio arborizado, fora do barulho da rua" → "Pátio arborizado, fora do barulho da rua"
- "Refugio urbano" → "Refúgio urbano"
- "Chopp artesanal proprio" → "Chopp artesanal próprio"
- "O chopp servido aqui sai da nossa propria cervejaria. Frescor garantido, e voce so vai encontrar nesse endereco." → "O chopp servido aqui sai da nossa própria cervejaria. Frescor garantido, e você só vai encontrar nesse endereço."
- "Cervejaria propria" → "Cervejaria própria"
- "Nao competimos por preco - competimos por experiencia." → "Não competimos por preço — competimos por experiência."
- "Na regiao da Lapa tem 15 lugares vendendo PF a R$ 17. Nenhum entrega o que voce vai encontrar aqui." → "Na região da Lapa tem 15 lugares vendendo PF a R$ 17. Nenhum entrega o que você vai encontrar aqui."

### `src/components/site/CardapioSection.tsx`
- "Nosso cardapio" → "Nosso cardápio"
- "Escolha sua proteina e monte o prato perfeito." → "Escolha sua proteína e monte o prato perfeito."

### `src/components/site/CupomSection.tsx`
- "Mostre o codigo ${code} ao garcom." → "Mostre o código ${code} ao garçom."
- "Nao foi possivel gerar o cupom agora." → "Não foi possível gerar o cupom agora."
- "Promocao ativa" → "Promoção ativa"
- "Seu codigo de cupom" → "Seu código de cupom"
- "Mostre esse codigo ao garcom no momento do pedido. O WhatsApp ja foi aberto em outra aba." → "Mostre esse código ao garçom no momento do pedido. O WhatsApp já foi aberto em outra aba."

### `src/components/site/ComoChegarSection.tsx`
- "A {reference}, num quintal que voce nao imagina que existe." → "A {reference}, num quintal que você não imagina que existe."
- "Endereco" → "Endereço"
- Defaults: "Sao Paulo" → "São Paulo" (apenas no fallback do JSX)

### `src/components/site/TestemunhosSection.tsx`
- "Quem ja foi" → "Quem já foi"

### `src/components/site/FAQSection.tsx`
- "Duvidas comuns sobre o Tendal." → "Dúvidas comuns sobre o Tendal."

### `src/components/site/FooterCTA.tsx`
- "Bate o ponto, atravessa a rua e vem almocar." → "Bate o ponto, atravessa a rua e vem almoçar."
- "Brasa acesa de segunda a sexta, 11h30 as 15h." → "Brasa acesa de segunda a sexta, 11h30 às 15h."
- Fallback "Sao Paulo" → "São Paulo"

### Não alterado
- `UrgentBanner`, `WhatsAppWidget`, `FAQSection` (conteúdo de banco), `TestemunhosSection` (conteúdo de banco), strings de tracking (`source: "como_chegar_button"` etc — são identificadores internos).
