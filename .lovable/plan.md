## Mudanças no Header

**Arquivo:** `src/components/site/Header.tsx`

1. **Reduzir margem/padding da logo** para que ela ocupe mais espaço visual sem precisar aumentar a barra:
   - Remover o `px-4` do container e usar padding menor (`px-2`), ou deixar a logo encostar mais à esquerda.
   - Diminuir a altura do header de volta para algo enxuto (ex.: `h-14 md:h-16`), já que a logo agora ocupará a altura disponível de forma mais eficiente (`h-12 md:h-14` mantendo proporção).

2. **Remover** o botão verde de WhatsApp e o botão hamburger (menu mobile) do topo.

3. **Adicionar** no lugar deles um único botão "Como chegar" que faz scroll para a seção `#como-chegar` (link âncora simples `<a href="#como-chegar">`), com estilo discreto (borda branca translúcida, igual ao botão "Ver no mapa" do hero).

4. **Remover** o estado `open`, o `useState`, e todo o bloco do menu mobile expandido, já que o hamburger sai.

5. **Manter** a nav de links no desktop (`hidden md:flex`) como está — ela continua útil em telas grandes.

## Resultado esperado

- Logo maior visualmente sem aumentar a altura do header.
- Topo limpo no mobile: só logo à esquerda + botão "Como chegar" à direita.
- O CTA de WhatsApp continua disponível via widget flutuante (`WhatsAppWidget`) e no rodapé (`FooterCTA`), então nenhuma conversão é perdida.
