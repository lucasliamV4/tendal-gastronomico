# Branch protection — required status checks

O CI deste repositório expõe **5 status checks** independentes (um por job).
Para que um PR só possa ser mergeado quando os checks de typecheck e alias
passarem, configure branch protection no GitHub.

> Branch protection é configuração do repositório no GitHub — não vive em
> arquivos versionados. Faça uma das opções abaixo após o primeiro push do
> CI atualizado (os nomes só aparecem no buscador do GitHub depois que cada
> job rodou ao menos uma vez).

## Status checks expostos

| Nome no GitHub             | Job no `ci.yml` | O que valida                                              |
| -------------------------- | --------------- | --------------------------------------------------------- |
| `Alias imports check`      | `alias-check`   | Todo `import "@/..."` resolve (existência + caixa exata). |
| `Route tree drift check`   | `routes-check`  | `src/routeTree.gen.ts` está commitado e atualizado.       |
| `Format check (Prettier)`  | `format-check`  | `prettier --check` passa.                                 |
| `Typecheck (tsc --noEmit)` | `typecheck`     | `tsc --noEmit` (fresh, sem cache) passa.                  |
| `Lint (ESLint)`            | `lint`          | `eslint . --max-warnings=0` passa.                        |
| `Unit tests (Vitest)`      | `unit-tests`    | Suite Vitest passa (`bun run test`).                      |

Pedido mínimo (Typecheck + Alias): exija `Typecheck (tsc --noEmit)` e
`Alias imports check`. Recomendado exigir os 5.

## Opção A — UI do GitHub (recomendado)

1. Repo → **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main` (ou o branch default)
3. Marcar **Require a pull request before merging**
4. Marcar **Require status checks to pass before merging**
5. Marcar **Require branches to be up to date before merging**
6. Em **Status checks that are required**, adicionar:
   - `Alias imports check`
   - `Typecheck (tsc --noEmit)`
   - (recomendado) `Format check (Prettier)`, `Lint (ESLint)`, `Route tree drift check`, `Unit tests (Vitest)`
7. **Create / Save changes**

## Opção B — `gh` CLI (reproduzível)

Substitua `<OWNER>/<REPO>` e `main` se necessário:

```bash
gh api -X PUT repos/<OWNER>/<REPO>/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -F required_status_checks.strict=true \
  -f 'required_status_checks.contexts[]=Alias imports check' \
  -f 'required_status_checks.contexts[]=Typecheck (tsc --noEmit)' \
  -f 'required_status_checks.contexts[]=Format check (Prettier)' \
  -f 'required_status_checks.contexts[]=Lint (ESLint)' \
  -f 'required_status_checks.contexts[]=Unit tests (Vitest)' \
  -f 'required_status_checks.contexts[]=Route tree drift check' \
  -F enforce_admins=true \
  -F required_pull_request_reviews=null \
  -F restrictions=null
```

## Opção C — Repository ruleset (GitHub novo)

**Settings → Rules → Rulesets → New branch ruleset**, target = branch default,
em **Require status checks to pass** adicione os mesmos nomes da tabela acima.
Vantagem: aplica a múltiplos branches via pattern.

## Verificação

Depois de salvar:

1. Abra um PR de teste.
2. O painel **Checks** deve listar os 5 status checks separadamente.
3. O botão **Merge** deve ficar bloqueado enquanto qualquer check exigido estiver vermelho.
