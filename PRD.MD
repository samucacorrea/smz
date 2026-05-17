# PRD — Next.js Headless WordPress usando _template_ como base visual

## 1. Objetivo

Criar um site em Next.js conectado ao WordPress Headless, usando como base os arquivos HTML, CSS e JS existentes dentro da pasta _template_.

O WordPress será usado como CMS para edição de conteúdo, enquanto o Next.js será responsável pelo frontend público, performance, SEO e otimização para IA.

---

## 2. Contexto do Projeto

Já existem templates HTML estáticos para:

- página principal
- single page
- archive
- category
- author
- search
- 404

Esses arquivos estarão dentro da pasta:

txt _template_/ 

O objetivo é converter esses arquivos estáticos em componentes dinâmicos no Next.js, preservando o visual original e tornando todo o conteúdo editável via WordPress.

---

## 3. Stack Obrigatória

- Next.js App Router
- TypeScript
- TailwindCSS ou CSS Modules, conforme melhor adaptação do template
- WordPress Headless
- WPGraphQL
- ACF PRO
- WPGraphQL for ACF
- RankMath ou Yoast SEO
- next/image
- next/font

---

## 4. Estrutura Inicial Esperada

txt project/ ├── _template_/ │   ├── index.html │   ├── single.html │   ├── archive.html │   ├── category.html │   ├── author.html │   ├── search.html │   ├── 404.html │   ├── assets/ │   │   ├── css/ │   │   ├── js/ │   │   └── images/ │ ├── src/ │   ├── app/ │   ├── components/ │   ├── lib/ │   ├── graphql/ │   ├── types/ │   ├── styles/ │   └── utils/ 

---

## 5. Instrução Principal para o Codex

O Codex deve analisar os arquivos dentro de _template_, identificar estruturas repetidas e convertê-las em componentes reutilizáveis.

Exemplos:

- header
- footer
- menus
- cards de posts
- hero sections
- blocos de CTA
- breadcrumbs
- sidebar
- search form
- author box
- pagination
- related posts
- FAQ
- sections globais

---

## 6. Rotas Next.js

txt src/app/ ├── page.tsx ├── blog/ │   ├── page.tsx │   └── [slug]/ │       └── page.tsx ├── categoria/ │   └── [slug]/ │       └── page.tsx ├── autor/ │   └── [slug]/ │       └── page.tsx ├── busca/ │   └── page.tsx ├── not-found.tsx ├── sitemap.ts ├── robots.ts ├── layout.tsx 

---

## 7. Mapeamento dos HTMLs

### _template_/index.html

Converter para:

txt src/app/page.tsx 

Função:
- página inicial
- seções editáveis via WordPress/ACF
- SEO da home
- Schema Organization
- Schema WebSite

---

### _template_/blog/single.html

Converter para:

txt src/app/blog/[slug]/page.tsx 

Função:
- post individual
- conteúdo vindo do WordPress
- título
- H1
- imagem destacada
- autor
- data
- categoria
- tags
- conteúdo
- FAQ
- posts relacionados
- Article Schema

---

### _template_/blog/archive.html

Converter para:

txt src/app/blog/page.tsx 

Função:
- listagem geral de posts
- paginação
- cards dinâmicos
- filtros opcionais
- SEO de arquivo

---

### _template_/blog/categoria/category.html

Converter para:

txt src/app/categoria/[slug]/page.tsx 

Função:
- listagem por categoria
- título da categoria
- descrição da categoria
- posts da categoria
- paginação
- CollectionPage Schema

---

### _template_/blog/autor/author.html

Converter para:

txt src/app/autor/[slug]/page.tsx 

Função:
- página do autor
- avatar
- bio
- redes sociais
- posts do autor
- Person Schema

---

### _template_/search.html

Converter para:

txt src/app/busca/page.tsx 

Função:
- busca de posts
- parâmetro ?q=
- resultados dinâmicos
- fallback sem resultados

---

### _template_/404.html

Converter para:

txt src/app/not-found.tsx 

Função:
- página de erro personalizada
- busca
- links úteis
- CTA de recuperação

---

## 8. Requisitos de Conversão do Template

Ao converter HTML para React/Next:

- trocar class por className
- converter estilos inline quando necessário
- transformar blocos repetidos em componentes
- remover scripts bloqueantes
- substituir imagens por next/image
- mover assets para public/assets
- adaptar JS antigo para componentes client-side apenas quando necessário
- preservar o visual original
- evitar dependências desnecessárias

---

## 9. Tratamento dos Arquivos CSS e JS

### CSS

O Codex deve:

- analisar CSS existente em _template_/assets/css
- preservar o design original
- migrar para src/styles/globals.css quando global
- usar CSS Modules para estilos específicos, se necessário
- remover CSS morto quando possível
- garantir responsividade

### JS

O Codex deve:

- analisar scripts em _template_/assets/js
- identificar funcionalidades reais
- recriar interações em React
- usar "use client" apenas nos componentes interativos
- evitar carregar JS global desnecessário
- usar dynamic import quando possível

Exemplos de JS a converter:

- menu mobile
- sliders
- tabs
- accordions
- animações
- search overlay
- scroll effects

---

## 10. Componentes Esperados

txt src/components/ ├── layout/ │   ├── Header.tsx │   ├── Footer.tsx │   ├── MainLayout.tsx │ ├── blog/ │   ├── PostCard.tsx │   ├── PostGrid.tsx │   ├── PostContent.tsx │   ├── RelatedPosts.tsx │   ├── AuthorBox.tsx │   ├── CategoryHeader.tsx │   ├── Pagination.tsx │ ├── sections/ │   ├── Hero.tsx │   ├── CtaSection.tsx │   ├── FaqSection.tsx │   ├── Testimonials.tsx │ ├── seo/ │   ├── JsonLd.tsx │   ├── Breadcrumbs.tsx │ ├── ui/ │   ├── Button.tsx │   ├── Container.tsx │   ├── Section.tsx 

---

## 11. WordPress como CMS

O WordPress deve controlar:

- páginas
- posts
- categorias
- tags
- autores
- imagens
- menus
- SEO title
- meta description
- Open Graph image
- textos da home
- CTAs
- FAQs
- blocos editáveis via ACF

---

## 12. Dados Editáveis da Home

A home deve ser baseada em uma página do WordPress com campos ACF.

Campos mínimos:

txt hero_title hero_subtitle hero_button_text hero_button_url hero_image sections services testimonials faq final_cta_title final_cta_text final_cta_button_text final_cta_button_url 

---

## 13. Dados Editáveis do Post

Cada post deve puxar:

txt title slug excerpt content featuredImage date modified author categories tags seoTitle seoDescription seoCanonical faq relatedPosts 

---

## 14. API

Preferência:

txt WPGraphQL 

Criar camada de serviço em:

txt src/lib/wordpress.ts src/graphql/queries.ts 

O código não deve chamar GraphQL diretamente dentro dos componentes visuais.

---

## 15. Variáveis de Ambiente

Criar .env.example:

env NEXT_PUBLIC_SITE_URL=https://smz.agency WORDPRESS_GRAPHQL_ENDPOINT=https://smz.agency/graphql WORDPRESS_SITE_URL=https://wp.smz.agency REVALIDATE_SECRET=change-me 

---

## 16. Estratégia de Renderização

### Home
ISR

### Blog archive
ISR

### Single post
ISR + generateStaticParams

### Categoria
ISR + generateStaticParams

### Autor
ISR + generateStaticParams

### Busca
SSR/dinâmica

### 404
estática

---

## 17. SEO Técnico

Implementar:

- generateMetadata por rota
- title dinâmico
- description dinâmica
- canonical
- Open Graph
- Twitter Card
- robots
- sitemap dinâmico
- breadcrumbs
- JSON-LD
- headings semânticos
- HTML limpo

---

## 18. Schemas JSON-LD

Implementar schemas:

- Organization
- WebSite
- Article
- BreadcrumbList
- FAQPage
- Person
- CollectionPage

---

## 19. Otimização para IA/LLMs

Criar automaticamente:

txt /llms.txt /llms-full.txt 

Esses arquivos devem resumir:

- quem é a empresa
- principais serviços
- páginas importantes
- posts principais
- categorias
- autoridade editorial
- links relevantes

Também garantir:

- conteúdo semanticamente organizado
- H1 único por página
- FAQ em posts e páginas principais
- breadcrumbs
- resumo inicial nos artigos
- dados estruturados
- conteúdo rastreável sem JS obrigatório

---

## 20. Performance

Metas:

txt Performance: 95+ SEO: 100 Accessibility: 95+ Best Practices: 100 

Obrigatório:

- next/image
- fontes otimizadas
- CSS crítico bem controlado
- JS mínimo
- Server Components por padrão
- Client Components apenas quando necessário
- lazy loading
- cache com revalidate
- evitar bibliotecas pesadas
- remover scripts antigos não usados

---

## 21. Acessibilidade

Obrigatório:

- alt em imagens
- labels em formulários
- contraste adequado
- navegação por teclado
- aria-label em botões icônicos
- estrutura correta de headings
- landmarks semânticos

---

## 22. Regras de Qualidade

O projeto deve:

- compilar sem erros
- usar TypeScript corretamente
- evitar any sempre que possível
- ter componentes pequenos
- separar dados, UI e SEO
- preservar visual do template
- permitir troca futura do CMS
- ter código limpo e documentado

---

## 23. Entregáveis

O Codex deve entregar:

- projeto Next.js funcional
- templates convertidos
- componentes reutilizáveis
- conexão com WordPress via GraphQL
- .env.example
- sitemap
- robots
- llms.txt
- llms-full.txt
- schemas JSON-LD
- README com instruções
- estrutura preparada para deploy

---

## 24. Critérios de Aceite

O projeto será considerado pronto quando:

- o visual dos HTMLs for preservado
- o conteúdo vier do WordPress
- posts forem dinâmicos
- categorias forem dinâmicas
- autores forem dinâmicos
- busca funcionar
- página 404 funcionar
- SEO metadata for gerado por página
- sitemap funcionar
- robots funcionar
- llms.txt funcionar
- build passar sem erro
- Lighthouse atingir as metas definidas

---

## 25. Observação Importante

A pasta _template_ é apenas referência de design e estrutura.

O código final deve ser convertido para Next.js moderno, componentizado e otimizado.

Não copiar HTML bruto diretamente sem adaptação.

Não carregar JS antigo globalmente se a funcionalidade puder ser recriada em React.

Não depender de Elementor no frontend público.

WordPress deve funcionar como CMS. Next.js deve ser responsável pela experiência final do usuário.