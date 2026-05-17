# TASKS — Next.js Headless WordPress + Template HTML

## Regra principal

Antes de implementar qualquer etapa:

- leia este arquivo
- execute apenas a próxima task pendente
- não pule etapas
- não crie integrações WordPress antes da estrutura visual estar estável
- ao final de cada task, pare e informe:
  - o que foi feito
  - arquivos criados/alterados
  - problemas encontrados
  - próximos passos sugeridos

---

# FASE 0 — Preparação do repositório

## Task 0.1 — Validar estrutura existente

Verificar se existem:

- `PRD.MD`
- pasta `_template_` ou `template`
- arquivos HTML
- CSS
- assets
- uploads

Se a pasta estiver como `template`, padronizar referências internas do projeto para `_template_` apenas se necessário, sem quebrar arquivos existentes.

Não criar projeto ainda.

---

## Task 0.2 — Criar planejamento técnico final

Gerar um resumo curto com:

- templates encontrados
- rotas equivalentes no Next.js
- componentes reutilizáveis
- problemas de URL
- scripts inline que virarão Client Components

Parar para aprovação.

---

# FASE 1 — Scaffold Next.js

## Task 1.1 — Criar projeto Next.js

Criar estrutura Next.js com:

- App Router
- TypeScript
- `src/`
- ESLint
- TailwindCSS, se compatível com o template
- estrutura preparada para deploy

Criar:

```txt
src/app
src/components
src/lib
src/graphql
src/styles
src/types
src/utils
public
```

---

## Task 1.2 — Configurar ambiente

Criar:

```txt
.env.example
```

Com:

```env
NEXT_PUBLIC_SITE_URL=https://seudominio.com
WORDPRESS_GRAPHQL_ENDPOINT=https://wp.seudominio.com/graphql
WORDPRESS_SITE_URL=https://wp.seudominio.com
REVALIDATE_SECRET=change-me
```

Não usar valores reais ainda.

---

# FASE 2 — Preparação para GitHub + EasyPanel

## Task 2.1 — Criar arquivos de deploy

Criar:

```txt
Dockerfile
.dockerignore
```

O Dockerfile deve usar build otimizado para produção Next.js.

Preferência:

- Node LTS Alpine
- install dependencies
- build
- run production
- expor porta `3000`

---

## Task 2.2 — Preparar package scripts

Garantir no `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

O projeto deve conseguir rodar via:

```bash
npm install
npm run build
npm run start
```

---

## Task 2.3 — Criar README de deploy

Criar `README.md` com:

- como rodar localmente
- variáveis de ambiente
- como subir no GitHub
- como importar no EasyPanel
- porta usada: `3000`
- comando de build
- comando de start
- observação sobre WordPress externo/headless

---

# FASE 3 — Migração visual base

## Task 3.1 — Migrar assets

Mover/copiar assets necessários para:

```txt
public/assets
```

Preservar:

- logos
- imagens
- uploads
- SVGs quando necessário

Não apagar `_template_`.

---

## Task 3.2 — Migrar CSS base

Analisar `styles.css`.

Criar:

```txt
src/styles/globals.css
```

Importar no `src/app/layout.tsx`.

Preservar visual original.

Não refatorar tudo de uma vez.

---

## Task 3.3 — Criar layout global

Criar componentes:

```txt
src/components/layout/SiteHeader.tsx
src/components/layout/SiteFooter.tsx
src/components/layout/MainLayout.tsx
```

Extrair header/footer dos HTMLs.

---

# FASE 4 — Componentização principal

## Task 4.1 — Criar componentes UI base

Criar:

```txt
src/components/ui/Button.tsx
src/components/ui/Chip.tsx
src/components/ui/Container.tsx
src/components/ui/Section.tsx
src/components/ui/EmptyState.tsx
```

---

## Task 4.2 — Criar componentes de blog

Criar:

```txt
src/components/blog/PostCard.tsx
src/components/blog/PostGrid.tsx
src/components/blog/Pagination.tsx
src/components/blog/NewsletterCta.tsx
src/components/blog/Breadcrumbs.tsx
```

---

## Task 4.3 — Criar componentes de artigo

Criar:

```txt
src/components/single/ArticleHeader.tsx
src/components/single/ArticleBody.tsx
src/components/single/TableOfContents.tsx
src/components/single/ShareBar.tsx
src/components/single/AuthorBio.tsx
src/components/single/RelatedPosts.tsx
```

Client Components apenas quando necessário.

---

# FASE 5 — Rotas estáticas usando dados mockados

Antes de conectar WordPress, criar dados mockados tipados.

## Task 5.1 — Criar mock data

Criar:

```txt
src/lib/mock-data.ts
src/types/content.ts
```

Com dados para:

- posts
- categorias
- tags
- autores
- home
- SEO

---

## Task 5.2 — Criar rotas

Criar:

```txt
src/app/page.tsx
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/blog/categoria/[slug]/page.tsx
src/app/blog/autor/[slug]/page.tsx
src/app/blog/tag/[slug]/page.tsx
src/app/busca/page.tsx
src/app/not-found.tsx
```

Usar os templates HTML como referência visual.

Ainda sem WordPress.

---

# FASE 6 — Client Components controlados

## Task 6.1 — Tema claro/escuro

Criar componente client-side para:

- toggle de tema
- persistência com `localStorage`
- troca correta de logo

---

## Task 6.2 — Slider

Criar slider do destaque como Client Component isolado.

Evitar bibliotecas pesadas inicialmente.

---

## Task 6.3 — TOC e copiar link

Criar:

- scroll spy do índice
- botão copiar link
- share buttons

Apenas no single post.

---

## Task 6.4 — Busca local temporária

Criar busca funcional usando mock data.

Depois será trocada por WordPress GraphQL.

---

# FASE 7 — SEO base

## Task 7.1 — Metadata global

Configurar `layout.tsx` com:

- title template
- description padrão
- icons
- metadataBase

---

## Task 7.2 — Metadata por rota

Implementar `generateMetadata` nas rotas principais.

Usar mock data inicialmente.

---

## Task 7.3 — JSON-LD

Criar:

```txt
src/components/seo/JsonLd.tsx
src/lib/seo/schema.ts
src/lib/seo/metadata.ts
```

Implementar:

- Organization
- WebSite
- Article
- BreadcrumbList
- CollectionPage
- Person

---

## Task 7.4 — Arquivos SEO

Criar:

```txt
src/app/sitemap.ts
src/app/robots.ts
src/app/llms.txt/route.ts
src/app/llms-full.txt/route.ts
```

Usar mock data inicialmente.

---

# FASE 8 — Integração WordPress Headless

Só iniciar após a parte visual estar aprovada.

## Task 8.1 — Criar client GraphQL

Criar:

```txt
src/lib/wp-client.ts
src/graphql/queries.ts
src/types/wp.ts
```

Implementar fetch GraphQL com:

- tratamento de erro
- cache
- revalidate
- tipagem básica

---

## Task 8.2 — Queries WordPress

Criar queries para:

- posts
- post por slug
- páginas
- categorias
- categoria por slug
- tags
- tag por slug
- autores
- autor por slug
- SEO metadata

---

## Task 8.3 — Trocar mock data por WordPress

Substituir progressivamente:

1. `/blog`
2. `/blog/[slug]`
3. `/blog/categoria/[slug]`
4. `/blog/tag/[slug]`
5. `/blog/autor/[slug]`
6. `/`
7. `/busca`

---

# FASE 9 — Performance

## Task 9.1 — Otimizar imagens

Trocar imagens por `next/image`.

Garantir:

- width/height
- alt
- lazy loading
- priority apenas no LCP

---

## Task 9.2 — Otimizar fontes

Remover Google Fonts via `<link>`.

Usar `next/font`.

---

## Task 9.3 — Reduzir JS

Auditar Client Components.

Tudo que não precisa ser client deve voltar para Server Component.

---

## Task 9.4 — Build final

Executar:

```bash
npm run lint
npm run build
```

Corrigir todos os erros.

---

# FASE 10 — Deploy EasyPanel

## Task 10.1 — Validar Docker local

Testar build Docker:

```bash
docker build -t next-wordpress-headless .
docker run -p 3000:3000 next-wordpress-headless
```

---

## Task 10.2 — Garantir compatibilidade EasyPanel

Confirmar:

- app escuta na porta `3000`
- Dockerfile está na raiz
- `.env.example` documentado
- build não depende de arquivos locais fora do repo
- `_template_` pode permanecer como referência ou ser removida depois

---

## Task 10.3 — Checklist para GitHub

Antes do push:

- remover `.env`
- manter `.env.example`
- garantir `.gitignore`
- garantir README
- garantir Dockerfile
- garantir build passando

---

# FASE 11 — Critérios finais de aceite

O projeto só estará pronto quando:

- todas as rotas renderizarem
- visual estiver fiel ao template
- conteúdo estiver dinâmico via WordPress
- build passar
- Docker funcionar
- README explicar deploy no EasyPanel
- SEO metadata funcionar
- sitemap funcionar
- robots funcionar
- llms.txt funcionar
- single post tiver Article Schema
- categorias/tags/autores tiverem páginas dinâmicas
- busca funcionar
- 404 funcionar
- Client Components estiverem limitados ao necessário

---

# Observação final

Não avançar para integração WordPress antes de aprovar:

- visual base
- rotas mockadas
- componentização
- estrutura de deploy