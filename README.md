# SMZ Headless

Projeto frontend em Next.js para consumo de conteúdo via WordPress Headless com WPGraphQL.

## Stack

- Next.js App Router
- TypeScript
- WordPress Headless
- WPGraphQL

## Requisitos

- Node.js 22+
- npm 10+

## Variáveis de ambiente

Use o arquivo `.env.example` como base.

```env
NEXT_PUBLIC_SITE_URL=https://seudominio.com
WORDPRESS_GRAPHQL_ENDPOINT=https://wp.seudominio.com/graphql
WORDPRESS_SITE_URL=https://wp.seudominio.com
REVALIDATE_SECRET=change-me
```

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie seu arquivo `.env.local` a partir de `.env.example`.

3. Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

4. Acesse:

```txt
http://localhost:3000
```

## Build de produção

```bash
npm run build
npm run start
```

Porta usada:

```txt
3000
```

## Deploy com Docker

Build da imagem:

```bash
docker build -t smz-headless .
```

Executar localmente:

```bash
docker run -p 3000:3000 smz-headless
```

## Como subir no GitHub

1. Inicialize o repositório Git localmente, se necessário.
2. Crie o repositório remoto no GitHub.
3. Adicione o remoto:

```bash
git remote add origin <URL_DO_REPOSITORIO>
```

4. Envie o código:

```bash
git add .
git commit -m "Initial scaffold"
git push -u origin main
```

## Como importar no EasyPanel

1. Crie um novo app baseado em repositório Git.
2. Conecte o repositório do GitHub.
3. Configure as variáveis de ambiente necessárias.
4. Garanta que a aplicação use a porta `3000`.
5. Use Dockerfile do projeto para build e runtime.

## Build e start no EasyPanel

Com Dockerfile presente no projeto, o EasyPanel pode usar o build containerizado.

Se precisar informar comandos manualmente:

Build:

```bash
npm run build
```

Start:

```bash
npm run start
```

## Observação sobre WordPress Headless

O WordPress é externo e funciona apenas como CMS/headless backend. O frontend público será servido pelo Next.js, responsável por renderização, SEO, performance e experiência final.
