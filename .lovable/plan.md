## Diagnóstico

Hoje todo o CI roda em **um único job** chamado `pre-publish-checks`. No GitHub, branch protection só consegue exigir _status checks_ por **nome de job** (ou nome de check externo) — não por step. Resultado: o máximo que dá para exigir hoje é "o job inteiro tem que passar". Não dá para dizer "merge bloqueia se `typecheck` falhar mas pode passar mesmo se `lint` falhar", nem expor "alias check" como check independente no painel do PR.

Além disso, branch protection é **configuração do repositório no GitHub**, não vive em arquivos versionados — precisa ser ativada via UI ou API. Posso:

1. Refatorar o CI para que cada check vire um job/status separado, addressable por nome.
2. Documentar e fornecer o comando exato para o usuário ligar a branch protection no GitHub (eu não tenho permissão de admin no repo dele).

## Plano

### 1. Refatorar `.github/workflows/ci.yml` em jobs paralelos

Cada check vira um job independente — aparece como status check separado no PR e pode ser exigido individualmente via branch protection.

Para evitar reinstalar dependências em cada job, uso uma **composite action local** em `.github/actions/setup/action.yml` que faz checkout + setup-bun + install + cache. Cada job invoca essa action.

```text
.github/
  actions/setup/action.yml      ← composite (checkout + bun + install + cache)
  workflows/ci.yml              ← jobs paralelos, cada um um check
```

Estrutura final do `ci.yml`:

```yaml
jobs:
  alias-check:
    name: Alias imports check # ← nome que aparece no PR
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: bun run check:imports 2>&1 | tee ci-artifacts/check-imports.log
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: alias-check-logs, path: ci-artifacts/ }

  routes-check:
    name: Route tree drift check
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: bun run routes:generate
      - run: git diff --exit-code src/routeTree.gen.ts

  format-check:
    name: Format check (Prettier)
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: bun run format:check 2>&1 | tee ci-artifacts/format-check.log
      - upload-artifact: ...

  typecheck:
    name: Typecheck (tsc --noEmit)
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: bun run routes:generate # tsc precisa do tree
      - run: bun run typecheck:fresh 2>&1 | tee ci-artifacts/typecheck.log
      - upload-artifact: ...

  lint:
    name: Lint (ESLint)
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: bunx eslint . --max-warnings=0 --format json --output-file ci-artifacts/eslint.json 2>&1 | tee ci-artifacts/lint.log
      - upload-artifact: ...
```

Vantagens:

- Cada job tem nome estável (`Alias imports check`, `Typecheck (tsc --noEmit)`, etc.) — viram status checks individuais no PR.
- Jobs rodam em paralelo → tempo total cai.
- Falha em um job não impede os outros de rodar (dev vê todos os erros de uma vez).
- `routes-check` é separado para o caso "alguém esqueceu de commitar `routeTree.gen.ts`" ficar como falha distinta de typecheck.

### 2. Composite action `setup`

`.github/actions/setup/action.yml`:

```yaml
name: Setup project
runs:
  using: composite
  steps:
    - uses: actions/checkout@v4
    - uses: oven-sh/setup-bun@v2
      with: { bun-version: latest }
    - run: bun install --frozen-lockfile
      shell: bash
    - run: mkdir -p ci-artifacts
      shell: bash
```

`setup-bun@v2` já cacheia o store do Bun automaticamente — não precisa de `actions/cache` extra.

### 3. Documentar como exigir os checks no GitHub

Criar `.github/BRANCH_PROTECTION.md` com instruções claras (UI + CLI) para o usuário ligar a regra. Eu não posso fazer isso pelo lado do código — é setting do repositório.

**Conteúdo principal:**

#### Opção A — UI do GitHub (recomendado)

1. Abrir o repo → **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main` (ou o branch default)
3. Marcar **Require a pull request before merging**
4. Marcar **Require status checks to pass before merging**
5. Marcar **Require branches to be up to date before merging**
6. Em **Status checks that are required**, buscar e adicionar:
   - `Alias imports check`
   - `Typecheck (tsc --noEmit)`
   - (opcional) `Format check (Prettier)`, `Lint (ESLint)`, `Route tree drift check`
7. Salvar.

> Os nomes só aparecem no buscador depois que o CI rodou ao menos uma vez no branch. Se não aparecerem, abrir um PR de teste primeiro.

#### Opção B — `gh` CLI (reproduzível)

```bash
gh api -X PUT repos/<OWNER>/<REPO>/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f 'required_status_checks.contexts[]=Alias imports check' \
  -f 'required_status_checks.contexts[]=Typecheck (tsc --noEmit)' \
  -f 'required_status_checks.contexts[]=Format check (Prettier)' \
  -f 'required_status_checks.contexts[]=Lint (ESLint)' \
  -f 'required_status_checks.contexts[]=Route tree drift check' \
  -F enforce_admins=true \
  -F required_pull_request_reviews=null \
  -F restrictions=null
```

#### Opção C — Repository ruleset (GitHub novo)

Settings → Rules → Rulesets → New branch ruleset → mesmas opções da UI clássica, com a vantagem de aplicar a múltiplos branches via pattern.

### 4. Validação local

Não dá para validar branch protection sem subir para o GitHub e ter alguém com admin. O que valida:

```bash
# o yaml é válido?
bunx --bun yaml-lint .github/workflows/ci.yml
# os scripts referenciados existem?
bun run check:imports && bun run format:check && bun run lint && bun run typecheck:fresh
```

E após o primeiro push: confirmar no GitHub que os 5 checks aparecem como linhas separadas no painel "Checks" do PR.

## Resultado

- 5 status checks independentes no GitHub: `Alias imports check`, `Route tree drift check`, `Format check (Prettier)`, `Typecheck (tsc --noEmit)`, `Lint (ESLint)`.
- Branch protection pode exigir qualquer combinação deles (o pedido específico — typecheck + alias check — fica trivial).
- Documentação reproduzível dentro do repo (`BRANCH_PROTECTION.md`) com UI + CLI.
- Jobs paralelos = CI mais rápido + erros mostrados todos juntos.

## Fora de escopo

- Ativar a regra no GitHub: o usuário precisa fazer (eu não tenho permissão).
- CODEOWNERS / required reviewers: pedido só falou de status checks.
- Auto-merge bot (Mergify, Kodiak): não foi pedido.
- Pre-commit hooks locais (Husky): branch protection no servidor já cobre o gating.
